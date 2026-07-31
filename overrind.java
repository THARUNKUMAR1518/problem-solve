import java.util.*;
class animal{
    void sound(){
        System.out.println("Animal Sound"); 
    }
}
class dog extends animal{
    void sound(){
        System.out.println("Bark");
    }
}
class cat extends animal{
    void sound(){
        System.out.println("Meow");
    }
}

public class overrind {
    public static void main(String[] args) {
        animal d1=new dog();
        animal d2=new cat();
        d1.sound();
        d2.sound();
    }
}