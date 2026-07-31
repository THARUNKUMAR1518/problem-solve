import java.util.*;

public class grade {
    public static void main(String[] args) {
        Scanner h=new Scanner(System.in);
        int marks=h.nextInt();
        if(marks>=90) {
            System.out.println("A+ grade");
        }
        else if(marks>=80) {
            System.out.println("A grade");
        }
        else if(marks>=70) {
            System.out.println("B+ grade");
        }
        else if(marks>=60) {
            System.out.println("B grade");
        }
        else if(marks>=50) {
            System.out.println("C grade");
        }
        else {
            System.out.println("U grade");
        }
    }
    
}
