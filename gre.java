public class gre {
    public static void main(String[] args) {
        int a=1563;
        int b=0;
        int c=0;
        while(a!=0){
          b=a%10;
          if(c<=b){
            c=b;
          }
          b=0;
          a=a/10;
        }
        System.out.print(c);
    }
    
}