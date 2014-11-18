import socket
from practicum import findDevices
from peri import PeriBoard
from time import sleep

#######################  Edit Here #########################
HOST = '10.2.19.221'    # The remote host
PORT = 50008              # The same port as used by the server
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
checkVal = 111
while True :
    try :
        newLight = b.getLight() > 500;
        if newLight != oldLight :
            s.sendall('TurnShip|' + b.getDeviceName() + '|' + str(checkVal) + '|' + b.getVendorName()

        newSwitch = b.getSwitch()
        if newSwitch != oldSwitch :
            s.sendall('ShootingToggle|' + b.getDeviceName() + '|' + str(checkVal) + '|' + b.getVendorName()

        print "Round %d ----> Switch state: %-8s | Light value: %d" % (round, state, light)
        round += 1
    except :
        print "BomB"
data = s.recv(1024)
s.close()
print 'Received', repr(data)