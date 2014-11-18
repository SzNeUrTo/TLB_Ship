import socket
from practicum import findDevices
from peri import PeriBoard
from time import sleep

#######################  Edit Here #########################
HOST = '127.0.0.1'    # The remote host
PORT = 8081              # The same port as used by the server
#######################  Edit Here #########################


s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))
while True :
    try :
        raw_input('press enter to start Game [GM] ')
        s.sendall("GameStart")
    except :
        print "BomB"
data = s.recv(1024)
s.close()
print 'Received', repr(data)