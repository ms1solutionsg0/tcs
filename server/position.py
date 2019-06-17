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

        with open('data.txt', 'w') as my_data_file:
            while True:
                ser_bytes = ser.readline().decode("utf-8")
                my_data_file.write(ser_bytes)
                await asyncio.sleep(0.35)

                