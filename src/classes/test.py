import numpy as np

x = np.array([[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6]])
#print(x.sum())
#x = np.array([[1, 2, 3], [2, 3, 4], [3, 4, 5]])
print(x)
y = x -1
#print(y)
# print(x.sum())
# print(x.sum(axis=0))
#alphas = x.sum(axis=0) / x.sum()
# alpha = alphas + 5
# print(10/42)
alphas = x.sum(axis=0) / x.sum() + 0.1
#print(alphas)
#print(y + [1, 2, 3])
#print(x)
#print(alphas)
print(x-1)
# print((x * np.log(x - 1 + alphas)).sum())
print(x-1 + alphas)
print(np.log(x-1 + alphas))
print(x * np.log(x - 1 + alphas))
# rng = np.random.default_rng()
# print(rng)