import java.util.*;
public class dfs {
    static Map<Integer, List<Integer>> a1 = new HashMap<>();
    static Set<Integer> v=new HashSet<>();
    public static void main(String[] args) {
        a1.put(0,Arrays.asList(1,2));
        a1.put(1,Arrays.asList(0,3));
        a1.put(2,Arrays.asList(0,3));
        a1.put(3,Arrays.asList(1,2));
        dfss(0);
    }
        static void dfss(int a){
            System.out.print(a+" -> ");
            v.add(a);
            for(int n:a1.get(a)){
                if(!v.contains(n)){
                    dfss(n);
                }
            }

        }

    }
    

