import socket
from practicum import findDevices
from peri import PeriBoard
from time import sleep
from random import randrange

#######################  Edit Here #########################
HOST = '10.2.4.98'    # The remote host
PORT = 8081              # The same port as used by the server
#######################  Edit Here #########################

devs = findDevices()

# if len dev == 2
if len(devs) == 0:
    print "*** No MCU board found."
    exit(1)

b = PeriBoard(devs[0])
print "*** MCU board found"
print "*** Device manufacturer: %s" % b.getVendorName()
print "*** Device name: %s" % b.getDeviceName()

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))
round = 0
oldLight = False
newLight = False
oldSwitch = False
newSwitch = False
checkVal = randrange(1000)
# Run after server start
s.sendall('JoinGame|' + b.getDeviceName() + '|' + str(checkVal) + '|' + b.getVendorName())
while True :
    try :
        newLight = b.getLight() < 120;
        if newLight != oldLight :
            s.sendall('TurnShipToggle|' + str(b.getDeviceName()) + '|' + str(checkVal) + '|' + (b.getVendorName()))

        newSwitch = b.getSwitch()
        if newSwitch != oldSwitch :
            if newSwitch :
                s.sendall('ShootingToggle|' + str(b.getDeviceName()) + '|' + str(checkVal) + '|' + str(b.getVendorName()))
        oldSwitch = newSwitch
        print "Round %d ----> Switch state: %-8s | Light value: %d" % (round, b.getSwitch(), b.getLight())
        round += 1
    except :
        print 'bomb'
data = s.recv(1024)
s.close()
print 'Received', repr(data)