class Node{
    int data;
    Node next;
    Node(int data){
        this.data=data;
    }
}
class stack{
    Node top=null;
    void push(int data){
        Node n=new Node(data);
            n.next=top;
            top=n;

    }
    void pop(){
        if(top==null){
            System.out.print("stack is empty");
        }
        else{
            top=top.next;
        }
    }
    void empty(){
        if(top==null){
            System.out.print("Stack is empty");
        }
        else{
            System.out.print("Stack is not empty");
        }
    }
    void peek(){
        if(top==null){
            System.out.print("Stack is empty");
        }
        else{
            System.out.println(top.data);
        }
    }
    void display(){
        Node temp=top;
        while(temp!=null){
            System.out.print(temp.data+" ");
            temp=temp.next;
        }
    }
}
public class stacklink {
    public static void main(String[]args){
        stack s=new stack();
        s.push(11);
        s.push(22);
        s.push(33);
        s.push(44);
        s.display();
        s.pop();
        s.peek();
        s.display();
        s.empty();
    }
}
