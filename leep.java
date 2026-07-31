import java.util.*;

class leep {
    public static void main(String[] args) {
        char ch = 'b';
        int f = ch;
        if (f >= 65 && f <= 90) {
            f = f + 32; // Convert uppercase to lowercase
        } else if (f >= 97 && f <= 122) {
            f = f - 32; // Convert lowercase to uppercase
        } else {
            System.out.println("Invalid character");
            return; // Exit if the character is not a letter
        }

        System.out.print((char) (f));

    }
}