export const Stream = function (actions) {
    this.protocol = location.protocol === "https:" ? "wss:" : "ws:";
    this.hostname = document.location.hostname;
    this.port = 8090;

    this.url = this.protocol + '//' + this.hostname + ":" + this.port + '/stream/webrtc';

    this.websocket = null;
    this.peerConnection = null;
    this.dataChannel = null;
    this.remoteDesc = false;

    this.iceCandidates = [];

    this.noReconnect = false;

    this.actions = actions;
    this.timeout = null;
};

Stream.prototype.start = function() {
    if (this.noReconnect) {
        return;
    }

    console.log('[stream] Starting on:', this.url);

    this.websocket = new WebSocket(this.url);

    this.websocket.onopen = () => this.open();
    this.websocket.onmessage = (event) => this.message(event);
    this.websocket.onclose = (event) => this.close(event);
    this.websocket.onerror = (event) => this.error(event);
}

Stream.prototype.createPeerConnection = function() {
    this.peerConnection = new window.RTCPeerConnection(null);
    // TODO: NEAL: ^^ works, bottom is older code.

    this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            let candidate = JSON.stringify({
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                sdpMid: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
            let command = JSON.stringify({
                what: "addicecandidate",
                data: candidate
            });
            this.websocket.send(command);
        } else {
            console.log("[stream] End of candidates");
        }
    }


    this.peerConnection.ontrack = (event) => {
        console.log("[stream] remote stream added:", event.streams[0]);
        console.log('NEAL: event ontrack: ', event);
        const mediaStream = event.streams[0];
        let remoteVideoElement = document.getElementById('stream');
        remoteVideoElement.autoplay = "true";
        remoteVideoElement.defaultMuted = "true";
        remoteVideoElement.muted = "muted";
        remoteVideoElement.playsinline = "true";

        if ('srcObject' in remoteVideoElement) {
            remoteVideoElement.srcObject = mediaStream;
        } else {
            // Avoid using this in new browsers, as it is going away.
            remoteVideoElement.src = URL.createObjectURL(mediaStream);
        }
        // remoteVideoElement.load();
        console.log("NEAL: remoteVideoElement: ", remoteVideoElement);
        let playPromise = remoteVideoElement.play();

        if (playPromise !== undefined) {
            playPromise.then((_) => {
                console.log("NEAL:---------------------------------------------------------------------------------");
                console.log("NEAL: success playpromise");
                console.log("NEAL: muted?: ", remoteVideoElement.muted);
                console.log("NEAL: networkState?: ", remoteVideoElement.networkState);
                console.log("NEAL: readyState?: ", remoteVideoElement.readyState);
                console.log("NEAL: mediaStream: ", mediaStream);
                console.log("NEAL:---------------------------------------------------------------------------------");
                console.log("NEAL:---------------------------------------------------------------------------------");
            }).catch((err) => {
                console.error("NEAL: playPromise error: ", err);
                console.error("NEAL: what is the error?: ", remoteVideoElement.error);
            })
        } else {
            console.error("NEAL: playPromise is undefined: ", playPromise);
            remoteVideoElement.load();
        }
    }

    this.peerConnection.onremovestream = () => console.log('[stream] remove');

    this.peerConnection.oniceconnectionstatechange = (evt) => {
        const { iceConnectionState } = this.peerConnection;
        switch(iceConnectionState) {
            case "connected":
                this.actions.setMsiStreamRefreshPending(false);
                break;
            case "failed":
            case "closed":
                console.log(`[stream] connection state changed to: ${iceConnectionState}`);
                this.reconnect();
            default:
                break;
        }
    }
}

Stream.prototype.reconnect = function() {
    clearTimeout(this.timeout);
    this.stop();
    this.timeout = setTimeout(this.start.bind(this), 5000);
}

Stream.prototype.offer = function() {
    this.createPeerConnection();
    this.iceCandidates = [];
    this.remoteDesc = false;
    var command = {
        what: "call",
        options: {
            force_hw_vcodec: true,
            vformat: 25,
            trickle_ice: true
        }
    };
    this.websocket.send(JSON.stringify(command));
    console.log("[stream] offer(), command=" + JSON.stringify(command));
}

Stream.prototype.open = function() {
    this.offer();
    console.log('[stream] state:', this.websocket.readyState);
}

Stream.prototype.addIceCandidates = function () {
    
    console.log("NEAL: iceCandidates, ", this.iceCandidates);
    debugger;
    this.iceCandidates.forEach((candidate) => {
        this.peerConnection.addIceCandidate(candidate,
            function() {
                console.log("[stream] IceCandidate added: " + JSON.stringify(candidate));
            },
            function(error) {
                console.error("NEAL: addicecandidate error: ", error);
                console.error("[stream] addIceCandidate error: " + error);
            }
        );
    });
    this.iceCandidates = [];
}

Stream.prototype.message = function(event) {
    var msg = JSON.parse(event.data);
    var what = msg.what;
    var data = msg.data;
    console.log("[stream] message =" + what);

    switch (what) {
        case "offer":
            this.peerConnection.setRemoteDescription(
                new window.RTCSessionDescription(JSON.parse(data)),
                () => this._onRemoteSdpSuccess(),
                () => this._onRemoteSdpError()
            );
            break;

        case "answer":
            break;

        case "message":
            console.log("NEAL: error message thing, event: ", event);
            console.error('[stream]',msg.data);
            break;

        case "iceCandidate": // when trickle is enabled
            if (!msg.data) {
                console.log("[stream] Ice Gathering Complete");
                break;
            }

            var elt = JSON.parse(msg.data);
            let candidate = new RTCIceCandidate({
                sdpMLineIndex: elt.sdpMLineIndex,
                candidate: elt.candidate
            });

            this.iceCandidates.push(candidate);
            if (this.remoteDesc) {
                this.addIceCandidates();
            }
            break;


        case "iceCandidates":
            console.log("NEAL: hit iceCandidates, not iceCandidate");
            var candidates = JSON.parse(msg.data);
            for (var i = 0; candidates && i < candidates.length; i++) {
                var elt = candidates[i];
                let candidate = new window.RTCIceCandidate({
                    sdpMLineIndex: elt.sdpMLineIndex,
                    candidate: elt.candidate
                });
                this.addIceCandidates();
            }
            if (remoteDesc){
                addIceCandidates();
            }
            break;
    }
}



Stream.prototype._onRemoteSdpSuccess = function() {
    console.log('[stream] onRemoteSdpSucces()');
    this.remoteDesc = true;
    this.peerConnection.createAnswer((sessionDescription) => {
            this.peerConnection.setLocalDescription(sessionDescription);
            let request = JSON.stringify({
                what: "answer",
                data: JSON.stringify(sessionDescription)
            });
            console.log('[stream] sdp success', request);

            this.websocket.send(request);

        },
        (error) => console.error(error), {
            optional: [],
            mandatory: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            }
        });
}

Stream.prototype._onRemoteSdpError = function(event) {
    console.error('[stream] Failed to set remote description (unsupported codec on this browser?):', event);
    this.stop();
}

Stream.prototype.close = function(event) {
    if (this.peerConnection) {
        this.peerConnection.close();
    }
}

Stream.prototype.error = function(event) {
    console.error('[stream] error', event);
    this.websocket.close();
}

Stream.prototype.stop = function() {
    // stop_record();
    document.getElementById('stream').src = '';

    this.close();
    
    if (this.websocket) {
        this.websocket.close();
        this.websocket = null;
    }
    console.info('[stream] Stop.')
}

Stream.prototype.preventReconnect = function() {
    this.noReconnect = true;
}

Stream.prototype.allowReconnect = function() {
    this.noReconnect = false;
}