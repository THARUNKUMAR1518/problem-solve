public class str_polindrome {
    public static void main(String[] args) {
        String g="madam !sis! madam";
        String a=g.replaceAll("[\\s\\W]","");
        char[] m = a.toCharArray();
        int b[]=new int[a.length()];
        int v=0;
        for(int i=a.length()-1;i>=0;i--)
        {
            b[v]=m[i];
            v++;
        }
        boolean ispalindrome=true;
        for(int j=0;j<a.length();j++){
            if(m[j]!=b[j]){
                ispalindrome=false;
                break;

            }
        }
        if(ispalindrome)
            System.out.println("Palindrome");
        else
            System.out.println("Not Palindrome");
        System.out.println(a);
    }

}