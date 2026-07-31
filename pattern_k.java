import java.util.Scanner;

public class pattern_k {
    public static void main(String[] args) {
        Scanner ms = new Scanner(System.in);
        int n = ms.nextInt();
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < (n - i); j++) {
                System.out.print("*");
            }
            System.out.println();

        }
        for (int i = 2; i <= n; i++) {
            for (int j = 1; j <= (i); j++) {
                System.out.print("*");
            }
            System.out.println();

        }

    }
}
