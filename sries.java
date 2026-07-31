import java.util.*;
public class sries {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int c=0;
        while(n!=1){
            if(n%2==0){
                n=n/2;
                System.out.println(n);
            }
            else{
                n=n*3+1;
                System.out.println(n);
            }
            c++;
        }
        System.out.println(c);
    }
}