public class second_lrge {
    
    public static void main(String[] args) {
        int arr[] = { 1, 2, 5, 89, 8, 67 };
        int max = 0;
        int secondmax=0;
        for(int i=0;i<=5;i++){
            if(max<arr[i]){
                max=arr[i];
            }
            else if(max>arr[i]&& secondmax<arr[i]){
                secondmax=arr[i];
            }

        }
        System.out.print("Secondmax:"+secondmax);
    }
}
