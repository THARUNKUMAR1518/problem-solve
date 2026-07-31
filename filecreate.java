import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int s = sc.nextInt();
        if (s <= 3) {
            System.out.println("Invalid Array Size.");
            return;
        }
        int[] arr = new int[s];
        int flag = 0;

        for (int i = 0; i < s; i++) {
            arr[i] = sc.nextInt();

            if (arr[i] <= 1) {
                flag = 1;
            }
        }
        if (flag == 1) {
            System.out.println("Invalid Array Elements");
            return;
        }
        int sum = 0;
        int count = 0;
        for (int i = 0; i < s; i++) {
            int flag1 = 1;
            if (arr[i] < 2) {
                flag1 = 0;
            }
            for (int j = 2; j <= arr[i]/2; j++) {
                if (arr[i] % j == 0) {
                    flag1 = 0;
                    break;
                }
            }
            if (flag1 == 1) {
                sum += arr[i];
                count++;
            }
        }
        if (count == 0) {
            System.out.println("No Prime Numbers!");
        } else {
            double avg = (double) sum / count;
            System.out.printf("Average of Prime Numbers in a Given Array Elements is %.3f.", avg);
        }
    }
}