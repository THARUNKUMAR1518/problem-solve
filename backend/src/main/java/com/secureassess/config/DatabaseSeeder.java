package com.secureassess.config;

import com.secureassess.entity.*;
import com.secureassess.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CollegeRepository collegeRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final AssessmentRepository assessmentRepository;
    private final QuestionRepository questionRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, CollegeRepository collegeRepository,
                          DepartmentRepository departmentRepository, CourseRepository courseRepository,
                          SubjectRepository subjectRepository, AssessmentRepository assessmentRepository,
                          QuestionRepository questionRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.collegeRepository = collegeRepository;
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
        this.assessmentRepository = assessmentRepository;
        this.questionRepository = questionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // 1. Create a Default College
            College college = new College();
            college.setName("Apex Engineering College");
            college.setCode("AEC");
            college.setAddress("123 University Drive, Cityville");
            college.setActive(true);
            college = collegeRepository.save(college);

            // 2. Create a Default Department
            Department department = new Department();
            department.setName("Computer Science & Engineering");
            department.setCollege(college);
            department = departmentRepository.save(department);

            // 3. Create a Default Course
            Course course = new Course();
            course.setName("Bachelor of Technology");
            course.setCode("BTECH-CS");
            course.setDepartment(department);
            course = courseRepository.save(course);

            // 4. Create a Default Subject
            Subject subject = new Subject();
            subject.setName("Data Structures and Algorithms");
            subject.setCode("CS201");
            subject.setCourse(course);
            subject = subjectRepository.save(subject);

            // Seed Super Admin
            User superAdmin = new User();
            superAdmin.setEmail("superadmin@secureassess.com");
            superAdmin.setPassword(passwordEncoder.encode("admin123"));
            superAdmin.setFullName("Super Admin User");
            superAdmin.setRole(Role.SUPER_ADMIN);
            superAdmin.setStatus(UserStatus.ACTIVE);
            userRepository.save(superAdmin);

            // Seed College Admin
            User collegeAdmin = new User();
            collegeAdmin.setEmail("collegeadmin@secureassess.com");
            collegeAdmin.setPassword(passwordEncoder.encode("admin123"));
            collegeAdmin.setFullName("College Administrator");
            collegeAdmin.setRole(Role.COLLEGE_ADMIN);
            collegeAdmin.setStatus(UserStatus.ACTIVE);
            collegeAdmin.setCollege(college);
            userRepository.save(collegeAdmin);

            // Seed Faculty
            User faculty = new User();
            faculty.setEmail("faculty@secureassess.com");
            faculty.setPassword(passwordEncoder.encode("faculty123"));
            faculty.setFullName("Dr. Robert Johnson");
            faculty.setRole(Role.FACULTY);
            faculty.setStatus(UserStatus.ACTIVE);
            faculty.setCollege(college);
            faculty.setDepartment(department);
            faculty = userRepository.save(faculty);

            // Seed Student 1
            User student = new User();
            student.setEmail("student@secureassess.com");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setFullName("John Doe");
            student.setRole(Role.STUDENT);
            student.setStatus(UserStatus.ACTIVE);
            student.setCollege(college);
            student.setDepartment(department);
            userRepository.save(student);

            // Seed Student 2 (Jane)
            User student2 = new User();
            student2.setEmail("jane@secureassess.com");
            student2.setPassword(passwordEncoder.encode("student123"));
            student2.setFullName("Jane Smith");
            student2.setRole(Role.STUDENT);
            student2.setStatus(UserStatus.ACTIVE);
            student2.setCollege(college);
            student2.setDepartment(department);
            userRepository.save(student2);

            // 5. Seed active assessment with 5 max warnings limit
            Assessment assessment = new Assessment();
            assessment.setTitle("Data Structures Midterm");
            assessment.setDescription("Midterm examination covering dynamic arrays, stacks, queues, BSTs, and complexities.");
            assessment.setDurationMinutes(90);
            assessment.setPassingMarks(20);
            assessment.setTotalMarks(50); // 50 questions, 1 mark each
            assessment.setSubject(subject);
            assessment.setStatus(AssessmentStatus.ACTIVE);
            assessment.setRandomQuestionsCount(0);
            assessment.setMaxWarnings(5); // Configured to 5 warnings as requested
            assessment.setNegativeMarking(false);
            assessment.setCreatedBy(faculty);
            assessment = assessmentRepository.save(assessment);

            // Seed 50 dynamic DS MCQ questions
            String[][] questionsPool = getDSQuestionsPool();
            for (int i = 0; i < 50; i++) {
                Question q = new Question();
                q.setSubject(subject);
                q.setAssessment(assessment);
                q.setQuestionText(questionsPool[i][0]);
                q.setQuestionType(QuestionType.OBJECTIVE);
                
                String difficultyStr = questionsPool[i][2];
                if ("EASY".equals(difficultyStr)) q.setDifficulty(DifficultyLevel.EASY);
                else if ("HARD".equals(difficultyStr)) q.setDifficulty(DifficultyLevel.HARD);
                else q.setDifficulty(DifficultyLevel.MEDIUM);
                
                q.setMarks(1); // 1 mark question
                q.setOptionsJson(questionsPool[i][1]);
                q.setCorrectAnswerJson(questionsPool[i][3]);
                questionRepository.save(q);
            }

            // Question 51: Dynamic bank question to pull from
            Question qBank1 = new Question();
            qBank1.setSubject(subject);
            qBank1.setAssessment(null);
            qBank1.setQuestionText("What is the worst-case space complexity of a Hash Table?");
            qBank1.setQuestionType(QuestionType.OBJECTIVE);
            qBank1.setDifficulty(DifficultyLevel.MEDIUM);
            qBank1.setMarks(1);
            qBank1.setOptionsJson("[\"O(1)\", \"O(log N)\", \"O(N)\", \"O(N^2)\"]");
            qBank1.setCorrectAnswerJson("2"); // Index 2 = O(N)
            questionRepository.save(qBank1);

            System.out.println("========== DATABASE SEEDED SUCCESSFULLY ==========");
            System.out.println("Super Admin: superadmin@secureassess.com / admin123");
            System.out.println("College Admin: collegeadmin@secureassess.com / admin123");
            System.out.println("Faculty: faculty@secureassess.com / faculty123");
            System.out.println("Student 1: student@secureassess.com / student123");
            System.out.println("Student 2: jane@secureassess.com / student123");
            System.out.println("Seeded 50 Data Structures MCQ Questions.");
            System.out.println("=================================================");
        }
    }

    private String[][] getDSQuestionsPool() {
        String[][] pool = new String[50][4];
        
        // Define 50 questions
        for (int i = 0; i < 50; i++) {
            String questionText;
            String optionsJson;
            String difficulty;
            String correctIndex;

            // Generate DSA topics questions
            int category = i % 5;
            if (category == 0) {
                questionText = "Q" + (i + 1) + ": Which data structure follows the Last-In-First-Out (LIFO) sorting architecture?";
                optionsJson = "[\"Queue\", \"Stack\", \"Array\", \"Graph\"]";
                difficulty = "EASY";
                correctIndex = "1";
            } else if (category == 1) {
                questionText = "Q" + (i + 1) + ": What is the average-case time complexity of retrieving elements from a Hash Table?";
                optionsJson = "[\"O(1)\", \"O(log N)\", \"O(N)\", \"O(N log N)\"]";
                difficulty = "EASY";
                correctIndex = "0";
            } else if (category == 2) {
                questionText = "Q" + (i + 1) + ": What is the maximum number of children nodes that a binary tree node can reference?";
                optionsJson = "[\"1\", \"2\", \"Unlimited\", \"3\"]";
                difficulty = "EASY";
                correctIndex = "1";
            } else if (category == 3) {
                questionText = "Q" + (i + 1) + ": Which sorting algorithm operates with a worst-case time complexity of O(N^2)?";
                optionsJson = "[\"Merge Sort\", \"Heap Sort\", \"Bubble Sort\", \"Quick Sort (average case)\"]";
                difficulty = "MEDIUM";
                correctIndex = "2";
            } else {
                questionText = "Q" + (i + 1) + ": What is the height of a balanced Binary Search Tree containing N nodes?";
                optionsJson = "[\"O(N)\", \"O(log N)\", \"O(N log N)\", \"O(1)\"]";
                difficulty = "MEDIUM";
                correctIndex = "1";
            }

            pool[i][0] = questionText;
            pool[i][1] = optionsJson;
            pool[i][2] = difficulty;
            pool[i][3] = correctIndex;
        }
        return pool;
    }
}
