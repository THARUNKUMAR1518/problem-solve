class A{
    void display(A obj){
    System.out.println("Class A");
    }
    void show(){
        display(this);
    }
}
public class this4way {
    public static void main(String[] args) {
        A obj=new A();
        obj.show();
    }
    
}
