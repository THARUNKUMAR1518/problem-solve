class stack {
    int arr[]=new int[5];
    int top=-1;
    void push(int data){
        if(top==arr.length-1){
            System.out.print("stack is full");
        }
        else{
            top++;
            arr[top]=data;
        }

    }
    void pop(){
        if(top==1){
            System.out.print("stack is empty");
        }
        else{
            top--;
        }
    }
    void peek(){
        if(top==1){
            System.out.print("Stack is empty");
        }
        else{
            System.out.println(arr[top]);
        }
    }
    void display(){
        for(int i=top;i>=0;i--){
            System.out.print(arr[i]+" ");
        }
        System.out.println();
    }
}
public class sk{
    public static void main(String[]args){
        stack s=new stack();
        s.push(10);
        s.push(20);
        s.push(30);
        s.push(40);
        s.display();
        s.pop();
        s.peek();
        s.display();
    }
}
