import java.lang.reflect.Array;
import java.util.*;
public class arrstringswap {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String n=sc.nextLine();
        char a[] = n.toCharArray();
        int len=a.length;
        for(int i=0;i<len-1;i+=2){
            char temp=a[i];
            a[i]=a[i+1];
            a[i+1]=temp;
    }
        System.out.print(Arrays.toString(a).replaceAll("[\\[\\], ]",""));
    
}}