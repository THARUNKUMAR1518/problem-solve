public class palindrome_in_Linkedlist {
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

    public boolean isPalindrome() {
        Node slow_ptr = head;
        Node fast_ptr = head;
        Node prev_of_slow_ptr = head;
        Node midnode = null;

        if (head != null && head.next != null) {
            while (fast_ptr != null && fast_ptr.next != null) {
                fast_ptr = fast_ptr.next.next;
                prev_of_slow_ptr = slow_ptr;
                slow_ptr = slow_ptr.next;
            }

            if (fast_ptr != null) {
                midnode = slow_ptr;
                slow_ptr = slow_ptr.next;
            }

            prev_of_slow_ptr.next = null;

            Node second_half = reverse(slow_ptr);
            boolean result = compareLists(head, second_half);

            second_half = reverse(second_half);

            if (midnode != null) {
                prev_of_slow_ptr.next = midnode;
                midnode.next = second_half;
            } else {
                prev_of_slow_ptr.next = second_half;
            }

            return result;
        }
        return true; // A single node or empty list is a palindrome
    }

    private Node reverse(Node node) {
        Node prev = null;
        Node current = node;
        Node next;

        while (current != null) {
            next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        return prev; // New head of the reversed list
    }

    private boolean compareLists(Node head1, Node head2) {
        while (head1 != null && head2 != null) {
            if (head1.data != head2.data)
                return false;
            head1 = head1.next;
            head2 = head2.next;
        }
        return (head1 == null && head2 == null); // Both should reach the end
    }
    
}
