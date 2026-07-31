import java.util.Scanner;

class nonreptative {

    public static void main(String[] args) {
        
        try(Scanner sc = new Scanner(System.in)){

            System.out.println("Enter a word : ");
            String word = sc.next();
            int l = word.length();

            for(int i=0;i<l-1;i++){
                boolean repetitive = false;

                for(int j=0;j<l;j++){
                    if(i!=j && word.charAt(i)==word.charAt(j)){
                        repetitive = true;
                        break;
                    }
                }

                if(!repetitive) {
                    System.out.println(word.charAt(i));
                    return;
                }
            }

            System.out.println("All characters are repetitive.");
        }
    }
}