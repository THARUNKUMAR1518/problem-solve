public class polymor {
    void display(polymor obj){
        System.out.println("Class polymor");
    }
    void show(){
        display(this);
    }
    public static void main(String[] args) {
        polymor obj=new polymor();
        obj.show();
    } 
}
