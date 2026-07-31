import java.util.*;
public class asciitric {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.nextLine();
        String sorted = str.chars().filter(Character::isLetter).sorted().collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();
        int totalacii=0;
        for (int i = 0; i < str.length(); i++) {
            int c= str.charAt(i);
            if (Character.isLetter(c)) {
                int sum = (int) c;
                while (sum > 9) sum = String.valueOf(sum).chars().map(ch -> ch - '0').sum();
                totalacii += sum;
                while (totalacii > 9) totalacii = String.valueOf(totalacii).chars().map(ch -> ch - '0').sum();
                }}
        System.out.print((char)('A' + Math.max(1, Math.min(totalacii, 26)-1)));
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i); 
            if (Character.isLetter(c)) {
                int sum = (int) c;
                while (sum > 9) sum = String.valueOf(sum).chars().map(ch -> ch - '0').sum();
                System.out.print(sum); System.out.print(sorted.charAt(i));
            }}System.out.print("$"); }}