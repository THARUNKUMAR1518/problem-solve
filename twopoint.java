import java.util.*;
public class twopoint {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n=sc.nextInt();
        int a[] = new int[n];
        for(int i=0;i<n;i++){
            a[i]=sc.nextInt();
    }
    Arrays.sort(a);
    if(n%2==0){
    for(int i=0;i<n/2;i++){
        System.out.print(a[n-1-i] + " ");
        System.out.println(a[i] + " ");
            
    }}
    else{
            for(int i=0;i<n/2;i++){
        System.out.print(a[n-1-i] + " ");
        System.out.println(a[i] + " ");
            
    }}
        int tem=n/2;
        System.out.print(a[tem]+" ");
        System.out.println("0");
        

    
}}
