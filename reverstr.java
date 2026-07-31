import java.util.*;

public class reverstr {
    public static void main(String[] args) {
        String d = "tharun hello";
        int n = d.length();
        String a[] = d.split(" ");
        for (int i = a.length- 1; i >= 0; i--) {
            System.out.print(a[i] + " ");
        }
        // for (int i = n - 1; i >= 0; i--) {
        //     System.out.print(d.charAt(i));

        // }
    }
}
