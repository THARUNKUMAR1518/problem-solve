// import java.util.*;
// public class target_string_count {
//     public static void main(String[] args) {
//         int c=0;
//         List<String> list = new ArrayList<>(Arrays.asList("R","a","b","b","b","i","t"));
//         list.stream().filter(s -> s.equals("b"));
//         for(String s:list){
//             if(s.equals("b")){
//                 c++;
//             }
//         }
//         System.out.println(c);
//     }
// }
import java.util.*;
public class target_string_count {
    public static void main(String[] args) {
        int c=0;
        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine();
        String a = str;
        int l= str.length();
        String target = sc.nextLine();
for(int i=0;i<l;i++){
    if(a.charAt(i)=='b'){
        a = a.substring(0, i) + a.substring(i + 1);
        i--;
    }
    if(a.equals(target)){
        c++;
        a=str;
    }
}
System.out.println(c);
}}