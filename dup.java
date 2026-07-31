import java.util.*;
public class dup {
    public static void main(String[] args) {
        Scanner vk = new Scanner(System.in);
        int n = vk.nextInt();
        int a[] = new int[n];
        int b[] = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = vk.nextInt();
        }
        Arrays.sort(a);
        for (int i = 0; i <= n; i++) {
            if (i == n) {
                b[i - 1] = a[i - 1];
                break;
            }
        }
        for (int i = 1; i < n; i++) {

            if (a[i - 1] < a[i]) {
                b[i - 1] = a[i - 1];
            }

        }

        for (int i = 0; i < n; i++) {
            if (b[i] != 0) {
                System.out.print(b[i] + " ");
            }
        }

    }
}
