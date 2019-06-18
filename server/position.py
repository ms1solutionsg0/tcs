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
        ser = serial.Serial('/dev/ttyACM0')
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
            
            if (x < 40.0) and (z < -60.0):
                # x = 3.8125 y = -1.8125 z = -82.6875 -- sample data
                self.direction = Direction.FORWARD
            elif (x > 305.0) and (z > 30.0):
                # x = 356.125 y = 5.0625 z = 40.75 -- sample data
                self.direction = Direction.BACKWARD
            else:
                # x = 0.0625 y = 4.5625 z = 37.8125 -- sample data
                self.direction = Direction.NORMAL
            
            if self.direction != self.previous_direction:
                await self.ws_server.namespace.set_flip_state(self.direction)
            
            await asyncio.sleep(0.1)

