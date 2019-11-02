import sys


def factorial(n):
    if n <= 1:
        return n
    else:
        return n*(factorial(n-1))


fd = open(sys.argv[1], 'r')
fcontent = fd.read().split('\n')

t = int(fcontent[0])

for _ in range(1, t + 1):
    print(factorial(int(fcontent[_])))