import java.util.*;
class Node{
    int data;
    Node left;
    Node right;
    Node(int d){
        data=d;
        left=right=null;
    }
}
public class travasal {
    Node root;
    Node insert(Node node,int data){
        if(node==null){
            return new Node(data);
        }
        if(data<node.data){
            node.left=insert(node.left,data);
        }
        else if(data>node.data){
            node.right=insert(node.right,data);
        }
        return node;
    }
    void inorder(Node node){
        if(node==null){
            return;
        }
        inorder(node.left);
        System.out.print(node.data+" ");
        inorder(node.right);
    }
    void preorder(Node node){
        if(node==null){
            return;
        }
        System.out.print(node.data+" ");
        preorder(node.left);
        preorder(node.right);
    }
    void postorder(Node node){
        if(node==null){
            return;
        }
        postorder(node.left);
        postorder(node.right);
        System.out.print(node.data+" ");
    }
    boolean search(Node node,int key){
        if(node==null){
            return false;
        }
        if(node.data==key){
            return true;
        }
        if(key<node.data){
            return search(node.left,key);
        }
        return search(node.right,key);
    }
    public static void main(String[]args){
        Scanner sc=new java.util.Scanner(System.in);
        int n=sc.nextInt();
        int a[]=new int[n];
        for(int i=0;i<n;i++){
            a[i]=sc.nextInt();
        }
        travasal t=new travasal();
        // t.root=new Node(1);
        // t.root.left=new Node(2);
        // //t.root.left.data=20;
        // t.root.right=new Node(3);
        // t.root.left.left=new Node(4);
        // t.root.left.right=new Node(5);
        for(int i=0;i<n;i++){
            if(i==0){
                t.root=t.insert(t.root,a[i]);
            }
            t.insert(t.root, a[i]);
        }
        System.out.println("Inorder traversal:");
        t.inorder(t.root);
        System.out.println("\nPreorder traversal:");
        t.preorder(t.root);
        System.out.println("\nPostorder traversal:");
        t.postorder(t.root);
        int key=sc.nextInt();
        if(t.search(t.root,key)){
            System.out.println("\nElement found");}
    }

}