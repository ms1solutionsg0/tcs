import { h } from 'hyperapp';

export const Stream = ({ stream, mode }) =>
    <div class="stream-wrapper">
        <video id="stream" class="stream stream--drive-mode" oncreate={(el) => stream.start(el)}>
            Sorry, your browser doesn't support embedded videos.
        </video>
    </div>;
