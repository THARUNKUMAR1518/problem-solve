public class encasulation {
    public static void main(String[] args) {
        // Create an instance of the Student class
        Student s1 = new Student();

        // Set the name and age of the student
        s1.setName("Rahul");
        s1.setAge(20);

        // Print the name and age of the student
        System.out.println(s1.getName());
        System.out.println(s1.getAge());
    }
}    
class Student {
    // Private fields
    private String name;
    private int age;

    // Public getter for name
    public String getName() {
        return name;
    }

    // Public setter for name
    public void setName(String name) {
        this.name = name;
    }

    // Public getter for age
    public int getAge() {
        return age;
    }

    // Public setter for age
    public void setAge(int age) {
        if (age > 0) { // Basic validation
            this.age = age;
        } else {
            System.out.println("Please enter a valid age.");
        }
    }
}
