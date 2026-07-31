public class hirerical {
    class A {
        void display() {
            System.out.println("Class A");
        }
    }
    class B extends A {
        void key() {
            System.out.println("Class B");
        }
    }
    class C extends A {
        void show() {
            System.out.println("Class C"); 
        }
    }

    public static void main(String[] args) {
        B obj1 = new B();
        obj1.key();
        obj1.display();
        C obj2 = new C();
        obj2.show();
        obj2.display();
    }  }  

