class Node {
    int data;
    Node next;
    
    Node(int data) {
        this.data = data;
        this.next = null;
    }
}
class Lin {
    Node front, rear;
    void enqueue(int x) {
        Node n = new Node(x);
        if(front == null) {
            front = rear = n;
        } else {
            rear.next = n;
            rear = n;
        }
    }
    
    void dequeue() {
        if (front == null) {
            System.out.println("underflow");
        }
        else{
            front = front.next;
            }
        }
        
    
    
    void peek() {
        if (front == null) {
            System.out.println("underflow");
        }
        System.out.println(front.data);
    }
    
    void display() {
        if (front == null) {
            System.out.println("underflow");
        }
        Node temp =front;
        while (temp != null) {
            System.out.print(temp.data + " ");
            temp = temp.next;
        }
        System.out.println();
    }
}
public class queuelink {
    public static void main(String[] args) {
        Lin queue = new Lin();
        queue.enqueue(10);
        queue.enqueue(20);
        queue.enqueue(30);
        queue.display();
        queue.dequeue();
        queue.display();
        queue.peek();
    }
    
}
