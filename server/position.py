from Adafruit_BNO055 import BNO055
import time
import json

def log_position(self):
    bno = BNO055.BNO055(serial_port='/dev/ttyAMA0', rst=12)
    if not bno.begin():
        raise RuntimeError('Failed to initialize BNO055')

    with open('log.txt', 'w') as f:
        while True:
            json.dump({ "Euler": sensor.euler, "Quaternion": sensor.quaternion }, f, separators=(',', ':'), indent=4)
            await asyncio.sleep(0.25)
