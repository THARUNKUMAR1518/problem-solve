import java.util.*;
public class trendynum {
    public static void main(String[] args) {
        Scanner vk = new Scanner(System.in);
        int n = vk.nextInt();
        if (n > 99 && n <1000) {
            int d1=((n%100)/10);
            if(d1%3==0){
                System.out.print("Terndy Number");
            }
            else{
                System.out.print("Not a Trendy Number");
            }
    }
}}
