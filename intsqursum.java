import java.util.*;

public class intsqursum {
    public static void main(String[] args) {
        Scanner fg = new Scanner(System.in);
        int n = fg.nextInt();
        // String p = String.valueOf(n);
        // int o = p.length();
        int sum = 0;
        int h = 0;
        int y = 0;
        while ((y <= 10) && (sum != 1)) {
            sum = 0;
            while (n > 0) {
                h = n % 10;
                sum += (h * h);
                n = n / 10;
            }
            y++;
            n = sum;
            // sum = 0;

        }
        System.out.println("cycle Count:" + y);
        if (y <= 10) {
            System.out.print("Happy number");
        } else {
            System.out.print("Unhappy number");
        }
    }
}