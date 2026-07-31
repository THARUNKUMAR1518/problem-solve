import java.util.*;
public class vote {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int age=sc.nextInt();  
        if (age >= 18) {
            System.out.println("Eligible to vote"); 
            if(age>=19&&age<=24) {
                System.out.println("Adult voter");
            }
            else if(age>=25&&age<=59) {
                System.out.println("senior voter");
            }
            else if (age>=60) {
                System.out.println("Senior citizen voter");
            }
        } 
        else {
            System.out.println("Not eligible to vote");
        }
    }
    
}
