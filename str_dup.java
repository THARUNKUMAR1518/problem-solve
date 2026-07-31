import java.util.*;
public class str_dup {
    public static void main(String[] args) {
        Scanner vk = new Scanner(System.in);
        String s = vk.nextLine();
        String a="";
        for (int i = 0; i < s.length(); i++) {+
            char c = s.charAt(i);
            if (a.contains(c+"")){
                continue;
            } else {
                a = a + c;
            }

    }
        System.out.println(a);
}}
