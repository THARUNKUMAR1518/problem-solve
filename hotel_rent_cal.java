import java.util.*;
public class hotel_rent_cal {
    public static void main(String[] args) {
        Scanner vk = new Scanner(System.in);
        int a = vk.nextInt();
        int b = vk.nextInt();
        int r=vk.nextInt();
        int to=0;
        int hr=20;
        int ir=(r/100)*hr;
        if(a>0|| a<12){
        if(a==4 || a==5 || a==6 || a==11 || a==12){
            to=to+(b*r)+(ir*b);
        }
        else{
            to=to+(b*r);
        }}
        else{
            System.out.print("invalid input");
        }
        System.out.print(to);
    }
}
