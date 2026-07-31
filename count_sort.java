import java.util.*;
public class Count_sort {
	public static void main(String[] args) {
		int[] arr= {3,1,2,4,3,2,1,4,6,3,7};
		int max=0;
		for(int i=0;i<arr.length;i++) {
			if(arr[i]>max) {
				max=arr[i];
			}
		}
		int[] a=new int[max+1];
		for(int num:arr) {
			a[num]++;
		}
		for(int i=1;i<a.length;i++) {
			a[i]=a[i]+a[i-1];
		}
		int[] b=new int[arr.length];
		for(int i=arr.length-1;i>=0;i--) {
			b[a[arr[i]]-1]=arr[i];
			
			a[arr[i]]--;
		}
		for(int c:b) {
			System.out.print(c+" ");
		}
	}
}