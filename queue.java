class o{
    int a[]=new int[5];
    int f=-1,r=-1;
    void q(int x){
        if(r==a.length-1){
            System.out.println("overflow");
        }
        else{
            if(f==-1){
                f=0;
            }
            r++;
            a[r]=x;
        }
    }
    void deq(){
        if(f==-1 && r==-1){
            System.out.println("underflow");
        }
        else{
            f++;
        }
    }
    void peek(){
        if(f==-1 && r==-1){
            System.out.println("underflow");
        }
        else{
            System.out.println(a[f]);
        }
    }
    void display(){
        if(f==-1 && r==-1){
            System.out.println("underflow");
        }
        else{
            for(int i=f;i<=r;i++){
                System.out.print(a[i]+" ");
            }
        }
    }
}   
public class queue {
    public static void main(String[] args) {
        o l=new o();
        l.q(10);
        l.q(20);
        l.q(30);
        l.q(40);
        l.q(50);
        l.deq();
        l.display();
    }
}
