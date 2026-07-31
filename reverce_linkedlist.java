public class reverce_linkedlist {
    Node head;

    class Node {
        int data;
        Node next;

        Node(int d) {
            data = d;
            next = null;
        }
    }

    public void push(int new_data) {
        Node new_node = new Node(new_data);
        new_node.next = head;
        head = new_node;
    }

    public void reverse() {
        Node prev = null;
        Node current = head;
        Node next = null;

        while (current != null) {
            next = current.next; // Store next node
            current.next = prev; // Reverse current node's pointer
            prev = current; // Move prev to current node
            current = next; // Move to next node
        }
        head = prev; // Update head to the new front of the list
    }

    public void printList() {
        Node temp = head;
        while (temp != null) {
            System.out.print(temp.data + " ");
            temp = temp.next;
        }
        System.out.println();
    }

    public static void main(String[] args) {
        reverce_linkedlist list = new reverce_linkedlist();
        list.push(1);
        list.push(2);
        list.push(3);
        list.push(4);

        System.out.println("Original List:");
        list.printList();

        list.reverse();

        System.out.println("Reversed List:");
        list.printList();
    }
    
}
