class A{
    void display(){
    System.out.println("Class A");

}}
class B extends A{
    void key(){
    System.out.println("Class B");
}}
class single_Inheritance{
    public static void main(String[] args) {
        B obj = new B();
        obj.key();
        obj.display();
        
    }
}