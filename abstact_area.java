abstract class Area{
    abstract void area(int d);   
}
class Circle extends Area{
    void area(int r){
        double a=3.14*r*r;
        System.out.println(a);
    }
}
class Square extends Area{
    void area(int s){
        int a=s*s;
        System.out.println(a);
    }}
public class abstact_area {
    public static void main(String[] args) {
        Area c1=new Circle();
        Area s1=new Square();
        c1.area(5);
        s1.area(4);
    }
    
}
