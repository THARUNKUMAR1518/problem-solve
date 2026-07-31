import java.util.Scanner;

public class avgarr {
    public static void main(String[] args) {
        int n = 5;
        int sum = 0;
        int a[] = new int[n];
        // int g[] = new int[n];
        Scanner sc = new Scanner(System.in);
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
        }
        for (int i = 0; i < n; i++) {
            sum += a[i];
        }
        System.out.println("Average:" + (sum / n));
        for (int i = 0; i < n; i++) {
            if (a[i] > sum / n) {
                System.out.print(a[i] + " ");
            }
        }
    }
}