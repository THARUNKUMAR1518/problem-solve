import java.util.Scanner;

public class evenidisess {
    public static void main(String[] args) {
        int n = 5;
        int sum = 0;
        int a[] = new int[n];
        Scanner sc = new Scanner(System.in);
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
        }
        for (int i = 0; i < n; i++) {
            if (i % 2 == 0) {
                System.out.print(a[i] + " ");
            } else {
                a[i] = 250;
                sum += 250;
            }
        }
        System.out.println();
        for (int i = 0; i < n; i++) {
            System.out.print(a[i] + " ");
        }
        System.out.print("\nall odd indisess Sum:" + sum);
    }

}
