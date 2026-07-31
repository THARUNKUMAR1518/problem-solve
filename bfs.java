import java.util.*;
public class bfs {
    public static void main(String[] args) {
        Map<Integer, List<Integer>> a = new HashMap<>();
        a.put(0,Arrays.asList(1,2));
        a.put(1,Arrays.asList(0,3));
        a.put(2,Arrays.asList(0,3));
        a.put(3,Arrays.asList(1,2));
        Queue<Integer> q=new LinkedList<>();
        Set<Integer> v=new HashSet<>();
        q.add(0);
        v.add(0);
        while(!q.isEmpty()){
            int node=q.remove();
            System.out.print(node+" -> ");     
            for(int n:a.get(node)){
                if(!v.contains(n)){
                    q.add(n);
                    v.add(n);
                }
            }
        
    }
    
    }
}
