public class fr_new {
    public static void main(String[] args) {
        // Record start time
        long startTime = System.currentTimeMillis();

        for (int i = 0; i < 500000; i++) {
            System.out.println(i);
        }

        // Record end time
        long endTime = System.currentTimeMillis();

        // Calculate and print execution time
        long executionTime = endTime - startTime;
        System.out.println("\nExecution completed!");
        System.out.println("Total execution time: " + executionTime + " milliseconds");
        System.out.println("Total execution time: " + (executionTime / 1000.0) + " seconds");
    }
}