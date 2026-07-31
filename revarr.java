import java.util.*;
import java.util.Scanner;

public class revarr {
    public static void main(String[] args) {
        int n = 5;
        int a[] = new int[n];
        int g[] = new int[n];
        Scanner sc = new Scanner(System.in);
        for (int i = 0; i < n - 1; i++) {
            a[i] = sc.nextInt();
        }
        /*
         * for (int o = n - 1; o >= 0; o--) {
         * for (int j = 0; j < n; j++) {
         * g[j] = a[o];
         * o--;
         * }
         * }
         */
        int p = sc.nextInt();
        for (int o = 0; o < n; o++) {
            for (int j = 0; j < n; j++) {
                g[j] = a[o];
                o++;
            }
        }
        for (int k = 0; k <= n; k++) {
            System.out.print(g[k] + " ");
        }

    }

}
