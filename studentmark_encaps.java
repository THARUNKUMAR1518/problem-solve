import java.util.*;
public class studentmark_encaps {
    private String name;
    private int mark;
    
    void setname(String k){
    name = k;
    }
    public void setmark(int y){
    if(y>0 &&y<=100){
         mark = y;}
    }
    String getname(){
        return name;
    }
    public int getmark(){
        return mark;
    }



    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter student name: ");
        String studentName = sc.nextLine();
        System.out.print("Enter student mark: ");
        int studentMark = sc.nextInt();

        studentmark_encaps student = new studentmark_encaps();
        student.setname(studentName);
        student.setmark(studentMark);

        System.out.println("Student Name: " + student.getname());
        System.out.println("Student Mark: " + student.getmark());
    }
    
}
