class person{
    String name;
    void name(String n){
        name=n;
    }
}
class student extends person{
    int mark;
    void mark(int m){
        mark=m;
    }
}
class display{
    void show(student s){
        System.out.println("Name: "+s.name);
        System.out.println("Mark: "+s.mark);
    }
} 
public class inheritstudent {

    public static void main(String[] args) {
        student s1=new student();
        display d1=new display();
        s1.name("Tharun");
        s1.mark(95);
        d1.show(s1);
    }
}
