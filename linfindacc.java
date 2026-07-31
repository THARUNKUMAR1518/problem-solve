import java.util.ArrayList;
import java.util.Scanner;

public class linfindacc {

    // Method to find all occurrences of a target value
    public static ArrayList<Integer> linearSearchAllOccurrences(int[] arr, int target) {
        ArrayList<Integer> indices = new ArrayList<>();

        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                indices.add(i);
            }
        }

        return indices;
    }

    // Method to display array
    public static void displayArray(int[] arr) {
        System.out.print("Array: ");
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        // Sample array with duplicate values
        int[] arr = { 5, 3, 8, 3, 7, 3, 2, 8, 1, 3 };

        displayArray(arr);

        System.out.print("Enter the value to search: ");
        int target = sc.nextInt();

        ArrayList<Integer> result = linearSearchAllOccurrences(arr, target);

        if (result.isEmpty()) {
            System.out.println("Value " + target + " not found in the array.");
        } else {
            System.out.println("Value " + target + " found at indices: " + result);
            System.out.println("Total occurrences: " + result.size());
        }

        sc.close();
    }
}
