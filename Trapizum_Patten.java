
import java.util.Scanner;
class Trapizum_Patten {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        int d=(n*n)+n;
        int h=1;
        int r=0;
        int s=n-1;
        int k=s;
        int o=k;
         for (int i =0; i < n; i++) {
            for (int j =1; j <= i; j++) {
                System.out.print("--");
            }
            for (int j =n; j > i; j--) {
                System.out.print(h+"*");
                h++;
            }
             for (int j =n; j > i; j--) {
                if(r==n-1){
                    System.out.print(h);
                }
                else{
                    if(j==i+1){
                        System.out.print(d-s);
                        s--;
                    }
                else{System.out.print(d-s +"*");
                s--;}
            }}
             k+=(o-i);
             s=k;
            System.out.println();
            r++;
        }}

            
        }