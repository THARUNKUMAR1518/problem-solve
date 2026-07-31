class Node {
    int data;
    Node prev;
    Node next;

    Node(int data) {
        this.data = data;
    }
}

class li {
    Node head,tail;

    void insert(int data) {
        Node n = new Node(data);
        if (head == null) {
            head = tail=n;
        }
       else{
        tail.next = n;
        n.prev = tail;
        tail=n;
    }}
    void insertbegin(int data) {
        Node n = new Node(data);
        if (head == null) {
            head = tail = n;
        } else {
            n.next = head;
            head.prev = n;
            head = n;
        }
    }
    void delete(){
        tail=tail.prev;
        tail.next=null;
    }
    void deletepo(int p){
        Node temp=head;
        for(int i=1;i<p-1;i++){
            temp=temp.next;
        }
        temp.next=temp.next.next;
        temp.next.prev=temp.prev;
        }
    
    void display() {
        Node temp = tail;
        while (temp != null) {
            System.out.print(temp.data + "-> ");
            temp = temp.prev;
        }
        System.out.println("null");
    }}


public class doublelink {
    public static void main(String[] args) {
        li dll = new li();

        dll.insert(10);
        dll.insert(20);
        dll.insert(30);
        dll.insert(40);
        dll.insertbegin(5);
        // dll.deletepo(3);
        // dll.delete();
        dll.display();
    }
}
