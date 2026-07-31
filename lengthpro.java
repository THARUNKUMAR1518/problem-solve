import java.util.*;
class lengthpro {public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine(), dob = sc.nextLine();
        int sum = Integer.parseInt(dob.replaceAll("\\D", ""));
        while(sum > 9) sum = String.valueOf(sum).chars().map(c->c-'0').sum();
        String result = "" + (char)('A' + Math.max(0, Math.min(sum-1, 8))) + dob.substring(3,5) +  str.charAt(0) + str.charAt(str.length()-1) + (str.length() < 10 ? "0" : "") + str.length() + (str.length() % 2 == 0 ? '$' : '#');
        System.out.print(result);}}