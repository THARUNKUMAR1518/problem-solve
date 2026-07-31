public class neon {
    public static void main(String[] args) {
        int n=9;
        int f=n*n;
        int t=0;
        int y=0;
        while(f!=0){
            t=f%10;
            y=t+y;
            f=f/10;
        }
        if(n==y){
            System.out.print("Neon Number");
        }
        else{
            System.out.print("not a neon Number");
        }

    }
    
}
