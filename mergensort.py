def merge_n_sort(A, B, n, m):
    if n == 0 and m == 0:
        print('Given lists are empty!!')
    elif n == 0:
        for el in B:
            A.append(el)
        return A
    elif m == 0:
        return A
    else:
        p1,p2 = n-1, n+m-1
        # shifting elements to right of the Array A
        while p1 >= 0:
            A[p2] = A[p1]
            p1 -= 1
            p2 -= 1
        
        p1,p2,q = 0,m,0
        # here p1 pointing the start of array A,
        # p2 pointing the start of the elements that were shifted to right in array A
        # q is pointing to the start of array B

        # till right shifted elements of A exhausted or till the array B exhausted
        while p2 < n+m and q < m:
            if B[q] < A[p2]:
                A[p1] = B[q]
                q += 1
            else:
                A[p1] = A[p2]
                p2 += 1

            p1 += 1

        # for remaining elements in B 
        # if all the right shifted elements of A are compared
        while q < m:
            A[p1] = B[q]
            p1 += 1
            q += 1
        
        return A

A = [1,3,5,6,8,None,None,None]
B = [0,2,10]
merge_n_sort(A,B,5,3)
print(A)