import sys
        
def isPrime(n):
    count =0
    for i in range(1, n):
        if n % i == 0:
            count += 1
    return 'Yes' if count == 1 else 'No'


fd = open(sys.argv[1], 'r')
fcontent = fd.read().split('\n')

t = int(fcontent[0])

for _ in range(1, t + 1):
    print(isPrime(int(fcontent[_])))