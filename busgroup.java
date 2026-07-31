import java.util.*;
public class busgroup
{
	public static void main(String[] args) {
	    Scanner sc = new Scanner(System.in);
	    int n = sc.nextInt();
	    int m=sc.nextInt();
	    int a[]=new int[n];
	    for(int i=0;i<n;i++){
	        a[i]=sc.nextInt();
	    }
	    int b=1;
	    int c=0;
	    for(int i=0;i<n;i++){
	        if(a[i]>c){
	            b++;
                c=m;}
                c-=a[i];
	    }
	    System.out.print(c);
	 
	}
}