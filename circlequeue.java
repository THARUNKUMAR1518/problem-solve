class Node {
    int data;
    Node next;

    Node(int data) {
        this.data = data;
        this.next = null;
    }
}

class queue {
    Node front, rear;
    void enqueue(int x) {
        Node n = new Node(x);
        if (front == null) {
            front = rear = n;
            rear.next = front; // Making it circular
        } else {
            rear.next = n;
            rear = n;
            rear.next = front; // Maintaining circular nature
        }
    }

    void dequeue() {
        if (front == rear) { // Only one element
            front = rear = null;
        } else {
            front = front.next;
            rear.next = front; // Maintaining circular nature
        }
    }

    void peek() {
        if (front == null) {
            System.out.println("underflow");
        } else {
            System.out.println(front.data);
        }
    }

    void display() {
        if (front == null) {
            System.out.println("Queue is empty");
            return;
        }
        Node temp = front;
        do {
            System.out.print(temp.data + " ");
            temp = temp.next;
        } while (temp != front);
        System.out.println();
    }
}

public class circlequeue {
    public static void main(String[] args) {
        queue q = new queue();
        q.enqueue(10);
        q.enqueue(20);
        q.enqueue(30);
        q.enqueue(40);
        q.display();
        q.dequeue();
        q.display();

    }

}
