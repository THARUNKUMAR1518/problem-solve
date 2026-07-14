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
    private final ExamSessionRepository examSessionRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository, CollegeRepository collegeRepository,
            DepartmentRepository departmentRepository, CourseRepository courseRepository,
            SubjectRepository subjectRepository, AssessmentRepository assessmentRepository,
            QuestionRepository questionRepository, ExamSessionRepository examSessionRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.collegeRepository = collegeRepository;
        this.departmentRepository = departmentRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
        this.assessmentRepository = assessmentRepository;
        this.questionRepository = questionRepository;
        this.examSessionRepository = examSessionRepository;
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

            // 2. Seed 10 Departments
            String[] deptNames = {"CSE", "AIML", "AIDS", "ECE", "EEE", "MECH", "CIVIL", "IT", "BIOTECH", "CHEM"};
            List<Department> savedDepartments = new ArrayList<>();
            for (String dname : deptNames) {
                Department d = new Department();
                d.setName(dname);
                d.setCollege(college);
                savedDepartments.add(departmentRepository.save(d));
            }

            // 3. Create a default course and subject for initial reference
            Department firstDept = savedDepartments.get(0); // CSE
            Course course = new Course();
            course.setName("Bachelor of Technology");
            course.setCode("BTECH-");
            course.setDepartment(firstDept);
            course = courseRepository.save(course);

            Subject subject = new Subject();
            subject.setName("Data Structures and Algorithms");
            subject.setCode("CS201");
            subject.setCourse(course);
            subject = subjectRepository.save(subject);

            // Seed Faculty (assigned to CSE)
            User faculty = new User();
            faculty.setEmail("faculty@secureassess.com");
            faculty.setPassword(passwordEncoder.encode("faculty123"));
            faculty.setFullName("Dr. Robert Johnson");
            faculty.setRole(Role.FACULTY);
            faculty.setStatus(UserStatus.ACTIVE);
            faculty.setCollege(college);
            faculty.setDepartment(firstDept);
            faculty = userRepository.save(faculty);

            // Seed Student (assigned to IT)
            Department itDept = savedDepartments.stream().filter(dep -> "IT".equals(dep.getName())).findFirst().orElse(savedDepartments.get(1));
            User student = new User();
            student.setEmail("student@secureassess.com");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setFullName("John Doe");
            student.setRole(Role.STUDENT);
            student.setStatus(UserStatus.ACTIVE);
            student.setCollege(college);
            student.setDepartment(itDept);
            student = userRepository.save(student);

            System.out.println("========== DATABASE SEEDED SUCCESSFULLY ==========");
            System.out.println("Faculty: faculty@secureassess.com / faculty123 (role=FACULTY)");
            System.out.println("Student: student@secureassess.com / student123 (role=STUDENT)");
            System.out.println("Seeded departments: " + String.join(", ", deptNames));
            System.out.println("=================================================");
        }

        // Always ensure demo assessment exists (even if users already exist)
        ensureDemoAssessmentExists();
    }

    @Transactional
    private void ensureDemoAssessmentExists() {
        try {
            // Check if any assessment exists at all
            long assessmentCount = assessmentRepository.count();

            if (assessmentCount > 0) {
                return; // Assessments already exist
            }

            // Get the required data without deep relationships
            List<Subject> subjects = subjectRepository.findAll();
            if (subjects.isEmpty()) {
                System.out.println("⚠ Cannot create demo: No subjects found");
                return;
            }

            Subject subject = subjects.get(0);

            // Create a fresh Assessment without user references first
            Assessment demoAssessment = new Assessment();
            demoAssessment.setTitle("Data Structures: Mid-Semester Exam");
            demoAssessment.setDescription("Demo exam to test basic Data Structures concepts");
            demoAssessment.setSubject(subject);
            demoAssessment.setDurationMinutes(60);
            demoAssessment.setTotalMarks(100);
            demoAssessment.setPassingMarks(40);
            demoAssessment.setMaxWarnings(3);
            demoAssessment.setNegativeMarking(false);
            demoAssessment.setShuffleQuestions(true);
            demoAssessment.setShuffleOptions(true);
            demoAssessment.setStatus(AssessmentStatus.ACTIVE);
            demoAssessment = assessmentRepository.save(demoAssessment);

            // Add 10 demo questions
            String[][] questionsPool = getDSQuestionsPool();
            for (int i = 0; i < 10; i++) {
                Question question = new Question();
                question.setSubject(subject);
                question.setAssessment(demoAssessment);
                question.setQuestionText(questionsPool[i][0]);
                question.setQuestionType(QuestionType.OBJECTIVE);
                question.setDifficulty(DifficultyLevel.valueOf(questionsPool[i][2]));
                question.setMarks(10);
                question.setOptionsJson(questionsPool[i][1]);
                question.setCorrectAnswerJson("[" + questionsPool[i][3] + "]");
                questionRepository.save(question);
            }

            System.out.println("✓ Demo Assessment Created: 'Data Structures: Mid-Semester Exam' (10 questions, 100 marks, 60 mins)");
        } catch (Exception e) {
            System.err.println("⚠ Error creating demo assessment: " + e.getMessage());
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
