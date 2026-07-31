import com.sun.source.doctree.SystemPropertyTree;
import java.util.*;
class private_encaps {

    private String word;
    private int sal;

    public void setname(String word) {
        this.word = word;
    }
    public void setsal( int sal) {
        this.sal = sal;
    }

    public String getname() {
        return word;
    }
    public int getsal( ) {
        return sal;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
            String h = sc.next();
            private_encaps pe = new private_encaps();
            pe.setname(h);
            pe.setsal(5000);
            int i=pe.getsal( );
            String g=pe.getname();
            System.out.println(g);
            System.out.println(i);

        }
    }
