public class funfibonacci {
    static int fibonacci(int n){
        if(n==0){
            return 0;
        }
        else if(n==1){
            return 1;
        }
        else{
            return n=fibonacci(n-1)+fibonacci(n-2);
        }
    }
    public static void main(String[] args) {
        funfibonacci f=new funfibonacci();
        for(int i=0;i<8;i++){
            System.out.print(f.fibonacci(i)+" ");
        }

        int n=8;
        int s=fibonacci(n);
    }
}
