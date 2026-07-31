import java.util.*;

public class amstrong {
    public static void main(String[] args) {
        Scanner fg = new Scanner(System.in);
        int n = fg.nextInt();
        double h = 0;
        int a = n;
        int c= String.valueOf(a).length();
        while(n!=0){
            int g=n%10;
            h+=Math.pow(g,c);
            n=n/10;
        }
        
        if (h == a) {
            System.out.println("amstrong");
        } else {
            System.out.println("not amstrong");
        }
    }}