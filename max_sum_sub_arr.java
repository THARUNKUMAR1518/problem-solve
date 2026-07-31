
import java.util.*;

class max_sum_sub_arr {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n <= 0) {
            System.out.println(0);
            return;
        }
        int arr[] = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int current_sum = arr[0];
        int max_sum = arr[0];

        for (int i = 1; i < n; i++) {
            current_sum = Math.max(arr[i], current_sum + arr[i]);
            max_sum = Math.max(max_sum, current_sum);
        }
        System.out.println(max_sum);
    }
}
