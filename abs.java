abstract class A{
    abstract void display();   ///abstract method
    void show(){     //concrete method
        System.out.println("Class A");
    }

}
class B extends A{
    void display(){
        System.out.println("Hello");
    }}
public class abs {
    public static void main(String[] args) {
         B obj=new B();
         obj.display();
         obj.show();
    }
}
