public class polymor_cal {
    void add(double a, double b){
        System.out.println("Add " + (a + b));
    }
    void sub(double a, double b){
        System.out.println("Sub " + (a - b));
    }
    void mul(double a, double b){
        System.out.println("Mul " + (a * b));
    }
    void div(double a, double b){
        if(b != 0){
            System.out.println("Div " + (a / b));
        } else {
            System.out.println("Error: Division by zero");
        }
    }
    public static void main(String[] args) {
        polymor_cal pc = new polymor_cal();
        pc.add(5.5, 4.5);
        pc.sub(10.0, 3.0);
        pc.mul(2.0, 3.5);
        pc.div(9.0, 3.0);
    }
}
