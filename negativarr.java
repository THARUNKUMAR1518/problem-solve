import java.lang.reflect.Array;
import java.util.*;

public class negativarr {
    public static void main(String[] args) {
        int n = 5;
        int h = 0;
        int a[] = new int[n];
        int b[] = new int[n];
        Scanner sc = new Scanner(System.in);
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
        }
        // Arrays.sort(a);
        for (int j = 0; j < n; j++) {
            if (a[j] > 0) {
                b[j] = a[j];
            }

        }
        for (int i = 0; i < n; i++) {
            System.out.print(b[i] + " ");
        }
    }
}