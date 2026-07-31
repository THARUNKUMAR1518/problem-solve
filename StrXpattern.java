import java.util.Scanner;

public class StrXpattern {
    public static void main(String[] agrs) {
        Scanner sc = new Scanner(System.in);
        String a = sc.nextLine();
        int l = a.length();
        int n = l - 1;
        char w[] = a.toCharArray();
        for (int i = 0; i <= n; i++) {
            for (int j = 0; j <= n; j++) {
                if (i == j || j == (n - i)) {
                    System.out.print(w[j]);
                } else {
                    System.out.print(" ");
                }
            }
            System.out.println();

        }
    }
}
