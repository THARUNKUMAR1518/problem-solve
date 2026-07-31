import java.util.*;
public class kaprekarnum {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int d = String.valueOf(n).length();
        int k=1;
        int a = n;
        for(int i=1;i<=d;i++){
            int j=1*10;
            k=k*j;
        }
        int sum = 0;
        int sq = n * n;
        int l=sq%k;
        int r=sq/k;
        sum=l+r;
        if (sum == a) {
            System.out.println("kaprekar");
        } else {
            System.out.println("not kaprekar");
        }
        
    }
    
}
