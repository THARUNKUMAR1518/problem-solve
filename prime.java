import java.util.*;

public class prime {
    public static void main(String[] args) {
        Scanner fg = new Scanner(System.in);
        int n = fg.nextInt();
        if (n == 2 || n == 3) {
            System.out.print("prime num");
            return;
        } else if (n == 1 || n <= 0) {
            System.out.print("not a prime");
            return;
        }
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) {
                System.out.print("not a prime");
                break;
            } else {

                System.out.print("prime num");
                break;
            }
        }

    }
}
