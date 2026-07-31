import java.util.*;

public class instarray {
    public static void main(String[] args) {
        Scanner vk = new Scanner(System.in);
        int a[] = { 15, 6, 7, 6, 3, 77 };
        int b[]= new int[6];
        Arrays.sort(a);
        for(int i=1;i<6;i++) {
            if(a[i-1]<a[i]) {
                b[i-1]=a[i-1];
            } else {
                i++;
            }
        }
        for(int i=0;i<5;i++) {
            System.out.print(b[i] + " ");
        }

        
    }
}
