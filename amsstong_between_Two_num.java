public class amsstong_between_Two_num {
    public static void main(String[] args) {
        int num1 = 8208;
        int num2 = 93084;
        for (int i = num1; i <= num2; i++) {
            if (isArmstrong(i)) {
                System.out.println(i);
            }
        }
    }
    
    public static boolean isArmstrong(int num) {
        int original = num;
        int sum = 0;
        int digits = String.valueOf(num).length();
        
        while (num > 0) {
            int digit = num % 10;
            sum += Math.pow(digit, digits);
            num /= 10;
        }
        
        return sum == original;
    }
}
