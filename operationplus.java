import java.util.Scanner;
public class operationplus {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;
        Scanner sc = new Scanner(System.in);
        char c = sc.next().charAt(0);
        switch (c) {
            case'+':
                System.out.println(a+b);
                break;
            case'-':
                System.out.println(a-b);
                break;
            case'*':
                System.out.println(a*b);
                break;
            case'/':
                System.out.println(a/b);
                break;
            default:
                System.out.println("invalid expresion");
                break;
        }
    }
}