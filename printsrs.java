import java.util.*;
public class printsrs {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int current = 0;
        int increment = 2;
        for (int i = 1; i <= n; i++) {
            System.out.print(current);
            if (i < n) {
                System.out.print(", ");
            }
            current += increment;
            if (i % 2 == 1) {
                increment += 4;
            }
        }
        System.out.println();
    }
}
