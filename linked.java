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
        n.next=null;
        if(head==null){
            head=n;
            tail=n;
        }
        else{
            tail.next=n;
            tail=n;
        }
        }
    void insertbegin(int data){
        node n=new node(data);
        n.next=head;
        head=n;
    }
    void insertp(int p,int data){
        node n=new node(data);
        node temp=head;
        for(int i=0;i<p-1;i++){
            temp=temp.next;
        }
        n.next=temp.next;
        temp.next=n;
    }
    void delete(){
        node temp=head;
        while(temp.next!=tail){
            temp=temp.next;
        }
        temp.next=null;
        tail=temp;
        }
    void deletebegin(){
        head=head.next;
    }
    void delepo(int p){
        node temp=head;
        for(int i=0;i<p-1;i++){
           temp=temp.next;
        }
        temp.next=temp.next.next;
    }
    void display(){
        node temp=head;
        while (temp!=null){
            System.out.print(temp.data +"->");
            temp=temp.next;
        }
    }
    }
public class linked {
    public static void main(String[] args) {
        li l=new li();
        l.insert(10);
        l.insert(20);
        l.insert(30);
        l.insertp(2,40);
        l.insertbegin(5);
        l.delete();
        l.delepo(2);
        l.deletebegin();
        l.display();
    }
    
}
