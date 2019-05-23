from Adafruit_BNO055 import BNO055
import time
import json

def log_position(self):
	bno = BNO055.BNO055(serial_port='/dev/ttyAMA0', rst=12)
	if not bno.begin():
		raise RuntimeError('Failed to initialize BNO055')

	status, self_test, error = bno.get_system_status()
	print('System status: {0}'.format(status))
	print('Self test result (0x0F is normal): 0x{0:02X}'.format(self_test))
	# Print out an error if system status is in error mode.
	if status == 0x01:
	    print('System error: {0}'.format(error))
	print('See datasheet section 4.3.59 for the meaning.')


	with open('log.txt', 'rw') as f:
		while true:
			heading, roll, pitch = bno.read_euler()
			json.dump((heading, roll, pitch), f)
			time.sleep(0.25)
