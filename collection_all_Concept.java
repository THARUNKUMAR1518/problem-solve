import java.util.*;
public class collection_all_Concept {
    public static void main(String[] args){
        	int a=10;
		Integer b=Integer.valueOf(a);
		Float e=Float.valueOf(a);
		Double f=Double.valueOf(a);
		System.out.println(b);
		
		int c=b.intValue();
		
		System.out.println(c);
		
		ArrayList<Integer>list=new ArrayList<>();
		
		list.add(10);
		list.add(20);
		list.add(30);     
		list.add(40);
		
		System.out.println(list);
		list.add(0,50);
		list.add(3, 40);
		
		System.out.println(list);
		
		System.out.println(list.size());
		
		System.out.println(list.contains(20));
		
		list.remove(0);
		list.remove(40);
		
		list.remove(20);
		System.out.println(list);
		
		System.out.println(list.indexOf(20));
		
		for(int a:list) {
			System.out.print(a+" ");
		}
		System.out.println();
		
		Iterator<Integer>it=list.iterator();
		
		while(it.hasNext()) {
			System.out.print(it.next()+" ");
		}
		System.out.println();
		LinkedList<Integer> list=new LinkedList<>();
		
		list.add(10);
		list.add(20);
		list.add(30);
		list.add(50);
		list.add(2);
		list.addFirst(1);
		list.addLast(50);
		
		System.out.println(list);
		list.remove(2);
		list.removeFirst();
		list.removeLast();
		list.remove(Integer.valueOf(2));
		System.out.println(list);
		list.set(0, 20);
		System.out.println(list);
		System.out.println(list.get(1));
		System.out.println(list.getFirst());
		System.out.println(list.getLast());
		
		Collections.reverse(list);
		System.out.println(list);
		LinkedList<Integer>rev=new LinkedList<>();
		
		for(int i=list.size()-1;i>=0;i--) {
			rev.add(list.get(i));
		}
		System.out.println(rev);
		ListIterator<Integer>it=list.listIterator(list.size());
		while(it.hasPrevious()) {
			System.out.print(it.previous()+" ");
		}
		System.out.println();
		Collections.sort(rev);
		System.out.print(rev);
		System.out.println();
		
		LinkedList<Integer>list1=new LinkedList<>();
		
		list1.add(40);
		list1.add(2);
		list1.add(10);
		list1.add(30);
		list1.add(25);
		
		System.out.println(list1);
		Collections.sort(list1);
		System.out.println(list1);
		
		System.out.println(list.get(list.size()-2));
		
		Collections.reverse(list1);
		
		System.out.println(list1);
		
		ArrayList<Integer> list2=new ArrayList<>();
		list2.add(1);
		list2.add(1);
		list2.add(2);
		list2.add(2);
		list2.add(2);
		
		ArrayList<Integer> list3=new ArrayList<>();
		
		for(Integer i:list2) {
			if(!list3.contains(i)) {
				list3.add(i);
			}
		}
		System.out.println(list3);
		ArrayList<Integer> list4=new ArrayList<>();
		
		for(int i=0;i<list2.size();i++) {
			if(list4.contains(list2.get(i))) {
				continue;
			}
			int count=0;
			for(int j=0;j<list2.size();j++) {
				if(list2.get(i).equals(list2.get(j))) {
					count++;
				}
			}
			System.out.println(count+" ");
			list4.add(list2.get(i));
		}
		LinkedList<Integer> list=new LinkedList<>();
		
		list.offer(10);
		list.offer(20);
		list.offer(30);
		list.offerFirst(5);
		list.offerLast(40);
		
		System.out.println(list);
		System.out.println(list.peek());
		System.out.println(list.peekFirst());
		System.out.println(list.peekLast());
		System.out.println(list.getFirst());
		System.out.println(list.getLast());   
		
		System.out.println(list.poll());
		System.out.println(list.pollFirst());
		System.out.println(list.pollLast());
		System.out.println(list.removeFirst());
		System.out.println(list.removeLast());
		System.out.println(list);
		
		Vector<Integer> list=new Vector<>();
		list.add(10);
		list.addElement(20);
		list.addElement(40);
		System.out.println(list);
		list.insertElementAt(30, 1);
		list.insertElementAt(5, 0);
		
		System.out.println(list);
		
		list.set(0,60);
		list.setElementAt(50, 1);
		System.out.println(list);
		
		System.out.println(list.firstElement());
		System.out.println(list.lastElement());
		System.out.println(list.removeElement(30));
		System.out.println(list.remove(0));
		System.out.println(list);
		
		Iterator<Integer>it=list.iterator();
		
		while(it.hasNext()) {
			System.out.print(it.next()+" ");
		}
		System.out.println();
		Enumeration<Integer>E=list.elements();
		while(E.hasMoreElements()) {
			System.out.print(E.nextElement()+" ");
		}
		System.out.println();
		System.out.println(list.size());
		System.out.println(list.capacity());
		
		Stack<Integer> stack=new Stack<>();
		
		stack.push(10);
		stack.push(20);
		stack.push(30);
		stack.push(40);
		
		System.out.println(stack);
		System.out.println(stack.peek());
		System.out.println(stack.pop());
		System.out.println(stack);
		
		stack.add(5);
		stack.addElement(25);
		stack.add(35);
		System.out.println(stack);
		stack.setElementAt(40, 0);
		stack.set(1,8);
		System.out.println(stack);
        Iterator<Integer>it=stack.iterator();
		
		while(it.hasNext()) {
			System.out.print(it.next()+" ");
		}
		System.out.println();
		Enumeration<Integer>E=stack.elements();
		while(E.hasMoreElements()) {
			System.out.print(E.nextElement()+" ");
		}
		PriorityQueue<Integer>list=new PriorityQueue<>();
		list.offer(10);
		list.offer(4);
		list.offer(2);
		list.offer(7);
		
		System.out.println(list);
		Iterator<Integer>it=list.iterator();
		while(it.hasNext()) {
			System.out.print(it.next()+" ");
		}
		System.out.println();
		
		for(int a:list) {
			System.out.print(a+" ");
		}
		System.out.println();
		System.out.println(list.peek());
		System.out.println(list.poll());
		System.out.println(list.poll());
		System.out.println(list);
		System.out.println(list.poll());
		System.out.println(list.poll());
		System.out.println(list);
		System.out.println(list.peek());
		//System.out.println(list.element());
		
		Object[] arr=list.toArray();
		System.out.println(Arrays.toString(arr));
		
		int[] a= {10,1,6,55,95};
		int k=3;
		PriorityQueue<Integer>list1=new PriorityQueue<>(Collections.reverseOrder());
		for(int i:a) {
			list1.add(i);
			if(list1.size()>k) {
				list1.poll();
			}
		}
		System.out.print(list1);
		System.out.println();
		
		PriorityQueue<Integer>q=new PriorityQueue<>(Collections.reverseOrder());
		
		q.offer(10);
		q.offer(4);
		q.offer(20);
		q.offer(30);
		
		System.out.println(q);
		
		System.out.println(q.poll());
		System.out.println(q.peek());
		
		PriorityQueue<Integer>Q=new PriorityQueue<>();
		
		for(int i:a) {
			Q.add(i);
		}
		while(!Q.isEmpty()) {
			System.out.print(Q.poll()+" ");
		}
		Deque<Integer>list=new ArrayDeque<>();
		
		list.add(10);
		list.add(20);
		list.addFirst(30);
		list.addLast(40);
		list.offer(15);
		list.offerFirst(25);
		list.offerLast(45);
		
		System.out.println(list);
		Iterator<Integer>it=list.iterator();
		while(it.hasNext()) {
			System.out.print(it.next()+" ");
		}
		System.out.println();
		System.out.println(list.remove());
		System.out.println(list.removeFirst());
		System.out.println(list.poll());
		System.out.println(list.pollFirst());
		System.out.println(list.pollLast());
		System.out.println(list.removeLast());
		System.out.println(list.getFirst());
		System.out.println(list.getLast());
		list.clear();
		System.out.println(list);
		System.out.println(list.isEmpty());
		ArrayDeque<Integer> list1=new ArrayDeque<>();
		list1.add(100);
		list1.add(200);
		list1.add(300);
		list.addAll(list1);
		
		System.out.println(list);
		System.out.println(list1);
		
		HashSet<Integer> set=new HashSet<>();
		set.add(10);
		set.add(20);
		set.add(30);
		set.add(30);
		
		System.out.println(set);
		HashSet<Integer> set1=new HashSet<>();
		set1.add(20);
		set1.add(40);
		set1.add(50);
		set1.add(30);
		System.out.println(set1);
		
		HashSet<Integer> union=new HashSet<>(set);
		System.out.println(union);
		union.addAll(set1);
		System.out.println(union);
		HashSet<Integer> intersection=new HashSet<>(set);
		System.out.println(intersection);
		intersection.retainAll(set1);
		System.out.println(intersection);
		HashSet<Integer> difference=new HashSet<>(set);
		difference.removeAll(set1);
		System.out.println(difference);
		Iterator<Integer>it=set1.iterator();
		while(it.hasNext()) {
			System.out.print(it.next()+" ");
		}
		System.out.println();
		
		Object[] arr=set.toArray();
		System.out.print(Arrays.toString(arr));
		System.out.println();
		System.out.println(set.containsAll(set1));
		System.out.println(set.equals(intersection));
	    System.out.println(set.size());
	    HashSet<Integer> set2=(HashSet<Integer>)set1.clone();
	    System.out.println(set2);
		
		LinkedHashSet<Integer> set=new LinkedHashSet<>();
		set.add(10);
		set.add(30);
		set.add(20);
		set.add(50);
		set.add(30);
		System.out.println(set);
		
		TreeSet<Integer> set=new TreeSet<>();
		
		set.add(20);
		set.add(40);
		set.add(5);
		set.add(45);
		set.add(20);
		set.add(25);
		set.add(35);
		
		System.out.println(set);
		System.out.println(set.first());
		System.out.println(set.last());
		System.out.println(set.contains(20));
		System.out.println(set.higher(20));
		System.out.println(set.lower(20));
		System.out.println(set.ceiling(35));
		System.out.println(set.isEmpty());
		System.out.println(set.floor(10));
		System.out.println(set.size());
		System.out.println(set.descendingSet());
		System.out.println(set.pollFirst());
		System.out.println(set.pollLast());
		System.out.println(set);
		
		Iterator<Integer>it=set.iterator();
		while(it.hasNext()) {
			System.out.print(it.next()+" ");
		}
		System.out.println();
		Iterator<Integer>it1=set.descendingIterator();
		while(it1.hasNext()) {
			System.out.print(it1.next()+" ");
		}
		System.out.println();
		for(int a:set) {
			System.out.print(a+" ");
		}
		System.out.println();
		HashMap<Integer,String>map=new HashMap<>();
		map.put(null,"A");
		map.put(2,null);
		map.put(3,"C");
		
		map.put(1,"D");
		System.out.println(map);
		map.putIfAbsent(2,"D");
		map.putIfAbsent(4,"E");
		System.out.println(map);
		System.out.println(map.containsKey(2));
		System.out.println(map.containsValue("A"));
		System.out.println(map.keySet());
		System.out.println(map.values());
		System.out.println(map.entrySet());
		System.out.println(map.size());
		map.forEach((k,v)->System.out.println(k+"->"+v));
		for(Map.Entry<Integer,String> entry:map.entrySet()) {
			System.out.println(entry.getKey()+"->"+entry.getValue());
		}
		System.out.println(map.getOrDefault(5, "Not"));
		System.out.println(map.get(1));
		
		TreeMap<Integer,String> map=new TreeMap<>();
		map.put(2,"A");
		map.put(3,"C");
		map.put(1,"B");
		
		map.put(2,"D");
		
		System.out.println(map);
		System.out.println(map.firstKey());
		System.out.println(map.lastKey());
		System.out.println(map.ceilingKey(2));
		System.out.println(map.floorKey(2));
		System.out.println(map.higherKey(3));
		System.out.println(map.lowerKey(2));
		System.out.println(map.keySet());
		System.out.println(map.values());
		System.out.println(map.entrySet());
		System.out.println(map.containsKey(1));
		System.out.println(map.containsValue("B"));
		System.out.println(map.size());
		
		Iterator<Map.Entry<Integer,String>>it=map.entrySet().iterator();
		while(it.hasNext()) {
			Map.Entry<Integer, String>entry=it.next();
			System.out.println(entry.getKey()+"->"+entry.getValue());
		}
		for(Map.Entry<Integer, String> entry:map.descendingMap().entrySet()) {
			System.out.println(entry.getKey()+"->"+entry.getValue());
		}
		System.out.println(map);
		System.out.println(map.get(day.Monday));
		System.out.println(map.replace(day.Monday,"Leave"));
		System.out.println(map);
		System.out.println(map.keySet());
		System.out.println(map.values());
		
		LinkedHashMap<Integer,String>map=new LinkedHashMap<>();
		
		map.put(null,"A");
		map.put(1, null);
		map.put(3, null);
		map.put(4, "C");
		System.out.println(map);
    }

}
