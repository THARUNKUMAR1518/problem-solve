class A {
    void display(){
        System.out.println("Class A");
    }
}
class B extends A{
    void key(){
        System.out.println("Class B");
    }
}
class C extends B{
    void show(){
        System.out.println("Class C");
    }
}
class mutilevel_Inheritance{
    public static void main(String[] args) {
        C obj = new C();
        obj.show();
        obj.key();
        obj.display();
        
    }
}