class Node {
    int data;
    Node next;
    Node prev;

    Node(int data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}

class queue {
    Node front, rear;

    void enqueue(int x) {
        Node n = new Node(x);
        n.next = null;
        n.prev = null;
        if (front == null) {
            front = rear = n;
        } else {
            rear.next = n;
            n.prev = rear;
            rear = n;
        }
    }

    void dequeue() {
        if (front == null) {
            System.out.println("underflow");
        } else {
            front = front.next;
        }
    }
    void peek(){
        if(front==null){
            System.out.println("underflow");
        }
        else{
            System.out.println(front.data);
        }
    }
    void display() {
        Node temp = front;
        while (temp != null) {
            System.out.print(temp.data + " ");
            temp = temp.next;
        }
        System.out.println();
    }
}

public class queuedoulink {
    public static void main(String[] args) {
        queue q = new queue();
        q.enqueue(10);
        q.enqueue(20);
        q.enqueue(30);
        q.enqueue(40);
        q.enqueue(50);
        q.dequeue();
        q.display();
        q.peek();

    }
}
