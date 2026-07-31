import java.util.*;
public class bank {
    String name;
    int acc;
    float bal;
    String type;
    String transactions = "";
    bank(String n, int a, float b, String t) {
        name = n;
        acc = a;
        bal = b;
        type = t;
    }
    void deposit(float amt) {
        bal += amt;
        transactions += "Deposited: " + amt + "\n";
        System.out.println("Amount deposited: " + amt);
        System.out.println("New balance: " + bal);
    }
    void withdraw(float amt) {
        if (amt > bal) {
            System.out.println("Insufficient balance");
        } else {
            bal -= amt;
            transactions += "Withdrawn: " + amt + "\n";
            System.out.println("Amount withdrawn: " + amt);
            System.out.println("New balance: " + bal);
        }
    }
    void display() {
        System.out.println("Account Holder: " + name);
        System.out.println("Account Number: " + acc);
        System.out.println("Account Type: " + type);
        System.out.println("Account Balance: " + bal);
    }
    void balance() {
        System.out.println("Current Balance: " + bal);
    }
    void transaction() {
        System.out.println("Transaction History:");
        System.out.println("Initial Balance: " + bal);
        System.out.println(transactions);

    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter account holder name: ");
        String name = sc.nextLine();
        System.out.print("Enter account number: ");
        int acc = sc.nextInt();
        System.out.print("Enter initial balance: ");
        float bal = sc.nextFloat();
        System.out.print("Enter account type (savings/current): ");
        String type = sc.next();
        bank b = new bank(name, acc, bal, type);
        int a=0;
        while(a!=4){
            System.out.println("---------------------");
            System.out.println("Deposit -1: ");
            System.out.println("withdraw -2: ");
            System.out.println("check balance -3: ");
            System.out.println("exit -4: ");
            System.out.println("transaction history -5: ");
            System.out.println("Enter your choice: ");
            a = sc.nextInt();
            System.out.println("--------------------------");
        
        if(a==1){
            System.out.print("Enter amount to deposit: ");
            float amt = sc.nextFloat();
            b.deposit(amt);
        }
        else if(a==2){
            System.out.print("Enter amount to withdraw: ");
            float amt = sc.nextFloat();
            b.withdraw(amt);
        }
        else if(a==3){
            b.balance();
        }
        else if(a==4){
            System.out.println("Thankyou for choosing the bank...");
        }
        else if(a==5){
            b.transaction();
        }
        else{
            System.out.println("Invalid choice");
        }
    }}
}
