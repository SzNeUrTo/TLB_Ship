import socket

HOST = '127.0.0.1'    # The remote host
PORT = 8081              # The same port as used by the server
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))
while True :
	word = raw_input('Your Word : ')
	s.sendall(word)
	if word == "exit" :
		break
data = s.recv(1024)
s.close()
print 'Received', repr(data)