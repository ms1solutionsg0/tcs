import json
import serial
import asyncio
from firmware import Shield
from enum import Enum
from datetime import datetime
from log import logname
import time
logger = logname()

class Direction(Enum):
    FORWARD = 'forward'
    BACKWARD = 'backward'
    NORMAL = 'normal'

class Position():
    def __init__(self, ws_server, http_server):
        self.ws_server = ws_server
        http_server.add_background_task(("flip", self.prevent_flip))
        self.direction = Direction.NORMAL
        self.previous_direction = Direction.NORMAL

    async def prevent_flip(self):
        ser = serial.Serial('/dev/ttyUSB0')
        ser.flushInput()

        while True:
            try:
                ser_bytes = ser.readline().decode("utf-8")
                ser_bytes_dict = json.loads(ser_bytes)
                x = ser_bytes_dict['x']
                y = ser_bytes_dict['y']
                z = ser_bytes_dict['z']
            except:
                continue
            
            self.previous_direction = self.direction
            
            if z < -50.0:
                self.direction = Direction.FORWARD
            elif z > 50.0:
                self.direction = Direction.BACKWARD
            else:
                self.direction = Direction.NORMAL
            
            if self.direction != self.previous_direction:
                await self.ws_server.namespace.set_flip_state(self.direction.value)
            
            await asyncio.sleep(0.05)

