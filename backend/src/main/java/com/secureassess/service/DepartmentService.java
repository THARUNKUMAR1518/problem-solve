package com.secureassess.service;

import com.secureassess.entity.College;
import com.secureassess.entity.Department;
import com.secureassess.repository.CollegeRepository;
import com.secureassess.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CollegeRepository collegeRepository;

    public DepartmentService(DepartmentRepository departmentRepository, CollegeRepository collegeRepository) {
        this.departmentRepository = departmentRepository;
        this.collegeRepository = collegeRepository;
    }

    @Transactional(readOnly = true)
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Department> getDepartmentsByCollegeId(String collegeId) {
        return departmentRepository.findByCollegeId(collegeId);
    }

    @Transactional(readOnly = true)
    public Department getDepartmentById(String id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with ID: " + id));
    }

    public Department createDepartment(Department department, String collegeId) {
        College college = collegeRepository.findById(collegeId)
                .orElseThrow(() -> new IllegalArgumentException("College not found with ID: " + collegeId));
        department.setCollege(college);
        return departmentRepository.save(department);
    }

    public Department updateDepartment(String id, Department departmentDetails) {
        Department department = getDepartmentById(id);
        department.setName(departmentDetails.getName());
        return departmentRepository.save(department);
    }

    public void deleteDepartment(String id) {
        Department department = getDepartmentById(id);
        departmentRepository.delete(department); // Trigger @SQLDelete
    }
}
