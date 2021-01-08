class Node:
    def __init__(self,value):
        self.value = value
        self.left = None
        self.right = None


def inorder_traversal(root):
    if root == None:
        return
    else:
        # traversing left
        inorder_traversal(root.left)
        # printing data
        print(root.value,end=" ")
        # traversaing right
        inorder_traversal(root.right)

if __name__ == "__main__":
    root = Node(4)
    root.left = Node(2)
    root.right = Node(8)
    root.left.left = Node(1)
    root.left.right = Node(3)
    root.right.left = Node(6)
    root.right.left.left = Node(5)
    root.right.right = Node(9)

    root1 = Node(1)
    root1.left = Node(2)
    root1.left.left = Node(3)
    root1.left.left.left = Node(4)
    root1.left.left.left.left = Node(5)
    root1.left.left.left.left.left = Node(6)
    inorder_traversal(root1)    

    