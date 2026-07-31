import java.util.*;
public class ajj_maplist {
    static Map<Integer, List<Integer>> a = new HashMap<>();
    public static void main(String[] args) {
        addedge(0,1);
        addedge(0,2);
        addedge(1,3);
        addedge(2,3);
        print();
    }
    static void addedge(int u,int v){
        a.putIfAbsent(u,new ArrayList<>());
        a.get(u).add(v);
        a.putIfAbsent(v,new ArrayList<>());
        a.get(v).add(u);
    }
    static void print(){
        for(int key:a.keySet()){
            System.out.print(key+"->");
            for(int val:a.get(key)){
                System.out.print(val+" ");
            }
            System.out.println();
        }
    }
    
}
