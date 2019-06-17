import board
import busio
import adafruit_bno055
import json
import asyncio
from firmware import Shield
from enum import Enum
from datetime import datetime
from log import logname
import time
logger = logname()

Euler_theta = 230
Euler_forward = 1

class Direction(Enum):
    Forward = 'forward'
    Backward = 'backward'
    Normal = 'normal'

class Position():
    def __init__(self, ws_server, http_server):
        self.ws_server = ws_server
        http_server.add_background_task(("flip", self.prevent_flip))
        self.direction = Direction.Normal
        self.previous_direction = Direction.Normal

    async def prevent_flip(self):
        i2c = busio.I2C(board.SCL, board.SDA)
        sensor = adafruit_bno055.BNO055(i2c)

        while True:
            self.previous_direction = self.direction
            if sensor.euler[0] > Euler_theta:
                if (Euler_forward > sensor.euler[1]):
                    logger.info(json.dumps({ "Euler": sensor.euler, "Direction": "forward", "Time": time.time() }, separators=(',', ':'), indent=4))
                    self.direction = Direction.Forward
                elif (Euler_forward < sensor.euler[1]):
                    logger.info(json.dumps({ "Euler": sensor.euler, "Direction": "backward", "Time": time.time() }, separators=(',', ':'), indent=4))
                    self.direction = Direction.Backward
            else:
                logger.info(json.dumps({ "Euler": sensor.euler, "Direction": "normal", "Time": time.time() }, separators=(',', ':'), indent=4 ))
                self.direction = Direction.Normal
            if self.direction != self.previous_direction:
                await self.ws_server.namespace.set_flip_state(self.direction)

            await asyncio.sleep(0.25)
                
