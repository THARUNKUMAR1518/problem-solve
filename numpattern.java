import java.util.Scanner;

public class numpattern {
    public static void main(String[] args) {
        // Scanner ms = new Scanner(System.in);
        // int n = ms.nextInt();
        int n = 6;

        for (int i = 1; i <= n; i++) {
            int y = n;
            int k = i;
            if (i == 1 || i == 2) {
                System.out.print("  ");
            }
            for (int j = 0; j <= n - i; j++) {
                System.out.print(k + " ");
                k += y;
                y--;
            }
            System.out.println();
        }
    }
}
