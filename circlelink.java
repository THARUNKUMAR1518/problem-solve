class node{
    int data;
    node next;
    node(int data){
        this.data=data;
    }
}
class li{
    node head,tail;
    void insert(int data){
        node n=new node(data);  
        n.next=head;
        if(head==null){
            head=n;
            tail=n;
            n.next=head;
        }
        else{
            tail.next=n;
            tail=n;
            n.next=head;
        }
        }
    void display(){
        node temp=head;
        do{
            System.out.print(temp.data +"->");
            temp=temp.next;
        }while (temp!=head);
        }  
    void delete(){
        node temp=head;
        while(temp.next!=tail){
            temp=temp.next;
        }
        temp.next=head;
        tail=temp;
        }
}
public class circlelink {
    public static void main(String[] args) {
        li cl=new li();
        cl.insert(10);
        cl.insert(20);
        cl.insert(30);
        cl.insert(40);
        cl.delete();kk
        cl.display();
        
    }
}
 