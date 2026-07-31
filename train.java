import java.util.*;

public class train {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter  seat number: ");
        int seat = sc.nextInt();

        if (seat % 8 == 3 || seat % 8 == 6) {
            System.out.print("upper berth");
        } else if (seat % 8 == 2 || seat % 8 == 5) {
            System.out.print("middle berth");
        } else if (seat % 8 == 1 || seat % 8 == 4) {
            System.out.print("lower berth");
        } else if (seat % 8 == 7) {
            System.out.print("side lower berth");
        } else if (seat % 8 == 8) {
            System.out.print("side upper berth");
        }
    }
}