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
print '1 : GameStart'
print '2 : LetGo'
while True :
    try :
        cmd = raw_input('press enter to start Game [GM] ')
        if cmd == '1':
            cmd = 'GameStart'
        elif cmd == '2':
            cmd = 'LetGo'
        s.sendall(cmd)
    except :
        print "BomB"
data = s.recv(1024)
s.close()
print 'Received', repr(data)