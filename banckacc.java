import java.util.*;

public class banckacc {
    int accno;
    double accmon;

    banckacc(int accno) {
        accmon = 5000;
        accno = 12345;
    }

    void display() {
        System.out.println("Accbal :" + accmon);
    }

    void deposit(double amt) {
        accmon = accmon + amt;
        System.out.println("After deposit  " + accmon);
    }

    void withdraw(double amt1) {
        if (amt1 > accmon) {
            System.out.println("Insufficient balance");
        } else {
            accmon = accmon - amt1;
            System.out.println("After withdraw  " + accmon);
        }

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        banckacc a = new banckacc(5000);
        int c = 0;
        while (c != 3) {
            System.out.println("Deposit =1 or withdraw =2 or exit =3 or balance =4");
            c = sc.nextInt();

            if (c == 1) {
                System.out.println("Enter the amount to be deposited");
                double amt = sc.nextDouble();
                a.deposit(amt);
            } else if (c == 2) {
                System.out.println("Enter the amount to be withdrawn");
                double amt1 = sc.nextDouble();
                a.withdraw(amt1);
            }
            else if(c==4){
                a.display();
            }
        }
    }
}