import java.util.Scanner;

public class hollow_squar {
    public static void main(String[] args) {
        Scanner ms = new Scanner(System.in);
        int n = ms.nextInt();
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                if (i == 1 || i == n || j == 1 || j == n) {
                    System.out.print("*");
                } else {
                    System.out.print(" ");
                }

            }
            System.out.println();

        }

    }
}
