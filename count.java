import java.util.Scanner;

public class count {
    public static void main(String[] args) {
        int n = 5;
        int even = 0;
        int odd = 0;
        int u = 0;
        int a[] = new int[n];
        Scanner sc = new Scanner(System.in);
        for (int i = 0; i < n; i++) {
            a[i] = sc.nextInt();
        }
        for (int j = 0; j < n; j++) {
            if ((a[j] != 0 && a[j] % 2 == 0)) {
                even++;
            } else if (a[j] == 0) {
                u++;
            } else {
                odd++;
            }

        }
        System.out.println("Even count:" + even);
        System.out.println("odd count:" + odd);

    }
}
