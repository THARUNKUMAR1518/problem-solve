public class febnosi {
    public static void main(String[] args) {
        int n = 13;
        int a = 0;
        int b = 1;
        // for (int i = 0; i <= n; i++) {
        //     System.out.print(a + " ");
        //     int c = a + b;
        //     a = b;
        //     b = c;

        // }
        //Amibaa mont grow calculate relat febonosi
        int c=0;
        if(n==2){
            System.out.println(1);
            return;
        }
        for (int i =2; i < n; i++) {
            c=a+b;
            a=b;
            b=c;

    }
        System.out.println(c);
    }
}
