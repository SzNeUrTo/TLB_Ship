import socket
from practicum import findDevices
from peri import PeriBoard
from time import sleep
from random import randrange

#######################  Edit Here #########################
HOST = '127.0.0.1'    # The remote host
PORT = 8081              # The same port as used by the server
#######################  Edit Here #########################
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))
round = 0
oldLight = 'A'
newLight = 'A'
oldSwitch = 'A'
newSwitch = 'A'
checkVal = 1234
A = '5610501016'
B = 'Supanut'
s.sendall('JoinGame|' + A + '|' + str(checkVal) + '|' + B)
while True :
    try :
        print "OldLight = ",oldLight
        newLight = raw_input('NewLight : ')
        if newLight == oldLight :
            s.sendall('TurnShipToggle|' + A + '|' + str(checkVal) + '|' + B)

        round += 1
    except :
        print "BomB"
data = s.recv(1024)
s.close()
print 'Received', repr(data)
