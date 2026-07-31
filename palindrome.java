// array is palindrome or not
public class palindrome {
    public static void main(String[] args) {
        int a[]={1,2,1};
        int b[]=new int[a.length];
        int v=0;
        for(int i=a.length-1;i>=0;i--)
        {
            b[v]=a[i];
            v++;
        }
        boolean ispalindrome=true;
        for(int j=0;j<a.length;j++){
            if(a[j]!=b[j]){
                ispalindrome=false;
                break;

            }
        }
        if(ispalindrome)
            System.out.println("Palindrome");
        else
            System.out.println("Not Palindrome");
    }

}
