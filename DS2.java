class Node {
    int data;
    Node left, right;
    Node(int data) {
        this.data = data;
        left = right = null;
    }
}
public class DS2 {
    Node root;
    void insert(int data) {
        Node newNode = new Node(data);
        if (root == null) {
            root = newNode;
            return;
        }
        Node[] arr = new Node[100];
        int front = 0;
        int rear = 0;
        arr[rear++] = root;
        while (front < rear) {
            Node temp = arr[front++];
            if (temp.left == null) {
                temp.left = newNode;
                return;
            } else {
                arr[rear++] = temp.left;
            }
            if (temp.right == null) {
                temp.right = newNode;
                return;
            } else {
                arr[rear++] = temp.right;
            }
        }
    }
    void inorder(Node root) {
        if (root == null)
            return;
        inorder(root.left);
        System.out.print(root.data + " ");
        inorder(root.right);
    }
    public static void main(String[] args) {
        DS2 tree = new DS2();
        tree.insert(1);
        tree.insert(2);
        tree.insert(3);
        tree.insert(4);
        tree.insert(5);

        tree.inorder(tree.root);
    }
}