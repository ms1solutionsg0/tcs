import board
import busio
import adafruit_bno055
import json
import asyncio

async def log_position():
    i2c = busio.I2C(board.SCL, board.SDA)
    sensor = adafruit_bno055.BNO055(i2c)

    with open('log.txt', 'w') as f:
        while True:
            json.dump({ "Euler": sensor.euler, "Quaternion": sensor.quaternion }, f, separators=(',', ':'), indent=4 )
            await asyncio.sleep(0.25)
