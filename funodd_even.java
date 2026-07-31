public class funodd_even {
    static String odd_even (int a){
        if(a%2==0){
            return "Even";
        }
        else{
            return "Odd";
        }
        }
    public static void main(String[] args) {
        int a=45;
        String s=odd_even(a);
        System.out.print("The number is "+s);
    }
    
}
