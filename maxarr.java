import java.util.*;

public class maxarr {
    public static void main(String[] args) {
        int a[] = { 1, 2, 5, 89, 8, 67 };
        int p = 0;
        int u = 0;
        for (int i = 0; i <= 5; i++) {
            if (p < a[i]) {
                p = a[i];
                u = i;

            }
        }
        System.out.println("Player Score:" + p);
        System.out.print("player no:" + u);

    }
}
