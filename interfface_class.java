interface a{
    void book();
}
interface b{
    void newspaper();
}
class c implements a,b{
    public void book(){
        System.out.println("book print");
    }
    public void newspaper(){
        System.out.println("newspaper print");
    }
}
public class interfface_class {
    public static void main(String[] args) {
        c obj=new c();
        obj.book();
        obj.newspaper();
    }
    
}
