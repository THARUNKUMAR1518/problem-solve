package com.secureassess.service;

import com.secureassess.entity.Course;
import com.secureassess.entity.Subject;
import com.secureassess.repository.CourseRepository;
import com.secureassess.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SubjectService {

    private final SubjectRepository subjectRepository;
    private final CourseRepository courseRepository;

    public SubjectService(SubjectRepository subjectRepository, CourseRepository courseRepository) {
        this.subjectRepository = subjectRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional(readOnly = true)
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Subject> getSubjectsByCourseId(String courseId) {
        return subjectRepository.findByCourseId(courseId);
    }

    @Transactional(readOnly = true)
    public Subject getSubjectById(String id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subject not found with ID: " + id));
    }

    public Subject createSubject(Subject subject, String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + courseId));
        subject.setCourse(course);
        return subjectRepository.save(subject);
    }

    public Subject updateSubject(String id, Subject subjectDetails) {
        Subject subject = getSubjectById(id);
        subject.setName(subjectDetails.getName());
        subject.setCode(subjectDetails.getCode());
        return subjectRepository.save(subject);
    }

    public void deleteSubject(String id) {
        Subject subject = getSubjectById(id);
        subjectRepository.delete(subject); // Trigger @SQLDelete
    }
}
