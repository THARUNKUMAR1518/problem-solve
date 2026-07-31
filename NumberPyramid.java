import java.util.Scanner;
public class NumberPyramid {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Input number of rows
        int n = sc.nextInt();
        // for(int i=1;i<n+1;i++){
        //     for(int j=i;j<n+1;j++){
        //         System.out.print(" ");
        //     }
        //     for(int k=0;k<i;k++){
        //     System.out.print(i+" ");
        //     }
        //     System.out.println("");
        // }
         for(int i=0;i<=n;i++){
            for(int j=i;j<=n;j++){
                System.out.print(" ");
            }
            for(int k=0;k<i;k++){
            System.out.print("* ");
            }
            System.out.println("");
        }

}}

