import board
import busio
import adafruit_bno055
import json
import asyncio
from firmware import Shield

from datetime import datetime

Euler_theta = 230
Euler_forward = 1

class Position():
    def __init__(self, ws_server, http_server):
        self.ws_server = ws_server
        http_server.add_background_task(("flip", self.prevent_flip))
        self.prevent_flip_forward = False
        self.prevent_flip_backward = False


    async def prevent_flip(self):
        i2c = busio.I2C(board.SCL, board.SDA)
        sensor = adafruit_bno055.BNO055(i2c)

        with open('log.txt', 'w') as f:
            while True:
                if (sensor.euler[0] > Euler_theta):
                    if (self.prevent_flip_forward == False and Euler_forward > sensor.euler[1]):
                        json.dump({ "Euler": sensor.euler, "Direction": "forward", "Time": datetime.now() }, f, separators=(',', ':'), indent=4 )
                        self.prevent_flip_forward = True
                        await self.ws_server.namespace.set_flip_state('forward')
                    elif (self.prevent_flip_backward == False and Euler_forward < sensor.euler[1]):
                        json.dump({ "Euler": sensor.euler, "Direction": "backward", "Time": datetime.now() }, f, separators=(',', ':'), indent=4 )
                        self.prevent_flip_backward = True
                        await self.ws_server.namespace.set_flip_state('backward')
                    else:
                        json.dump({ "Euler": sensor.euler, "Direction": "idk sensor went off", "Time": datetime.now() }, f, separators=(',', ':'), indent=4 )
                elif (self.prevent_flip_forward == True or self.prevent_flip_backward == True):
                    json.dump({ "Euler": sensor.euler, "Direction": "normal in elif", "Time": datetime.now() }, f, separators=(',', ':'), indent=4 )
                    self.prevent_flip_backward = False
                    self.prevent_flip_forward = False
                    await self.ws_server.namespace.set_flip_state('normal')
                
                await asyncio.sleep(.25)
                
