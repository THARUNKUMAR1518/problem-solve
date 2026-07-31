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


void emptycheck(){
    if(head==null){
        System.out.println("Linked list is empty");
    }
    else{
        System.out.println("Linked list is not empty");
    }

}    void size(){
        node temp=head;
        int c=0;
        while(temp!=null){
            c++;
            temp=temp.next;
        }
        temp=head;
        for(int i=0;i<c/2;i++){
            temp=temp.next;
        }
        System.out.println("Middle element is: "+temp.data);

    }
    void even(){
        node temp=head;
        int e=0;
        while(temp!=null){
            if(temp.data%2==0){
            e++;
        }
            temp=temp.next;
        }
        System.out.println("Number of even elements: " + e);
    }
    void deletep(int p){
        node temp=head;
        for(int i=0;i<p-1;i++){
           temp=temp.next;
        }
        temp.next=temp.next.next;
    }
    void del_first(){
        head=head.next;
        System.out.println();
    }
    void display(){
        node temp=head;
        while(temp!=null){
            System.out.print(temp.data +"->");
            temp=temp.next;
    }

    }}
public class linkedempty_change {
    public static void main(String[]args){
        li l=new li();
        l.insert(1);
        l.insert(2);
        l.insert(3);
        l.insert(4);
        l.insert(5);
        l.emptycheck();
        l.size();
        l.even();
        l.display();
        l.del_first();
        l.display();
    }
    
}
