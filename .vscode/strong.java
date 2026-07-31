import java.util.*;

public class strong {
    public static void main(String[] args) {
        Scanner fg = new Scanner(System.in);
        int n = fg.nextInt();
        double h = 0;
        int a = n;
        while(n!=0){
            int g=n%10;
            int fact = 1;
            for (int i = 1; i <= g; i++) {
            fact *= i;
            }
            h+=fact;
            n=n/10;
        }
        
        if (h == a) {
            System.out.println("strong");
        } else {
            System.out.println("not strong");
        }
    }}