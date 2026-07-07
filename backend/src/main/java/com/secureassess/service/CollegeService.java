package com.secureassess.service;

import com.secureassess.entity.College;
import com.secureassess.repository.CollegeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CollegeService {

    private final CollegeRepository collegeRepository;

    public CollegeService(CollegeRepository collegeRepository) {
        this.collegeRepository = collegeRepository;
    }

    @Transactional(readOnly = true)
    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public College getCollegeById(String id) {
        return collegeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("College not found with ID: " + id));
    }

    public College createCollege(College college) {
        if (collegeRepository.existsByCode(college.getCode())) {
            throw new IllegalArgumentException("College with code " + college.getCode() + " already exists.");
        }
        return collegeRepository.save(college);
    }

    public College updateCollege(String id, College collegeDetails) {
        College college = getCollegeById(id);
        
        // Code change check
        if (!college.getCode().equalsIgnoreCase(collegeDetails.getCode()) && 
            collegeRepository.existsByCode(collegeDetails.getCode())) {
            throw new IllegalArgumentException("College with code " + collegeDetails.getCode() + " already exists.");
        }

        college.setName(collegeDetails.getName());
        college.setCode(collegeDetails.getCode());
        college.setAddress(collegeDetails.getAddress());
        college.setActive(collegeDetails.isActive());

        return collegeRepository.save(college);
    }

    public void deleteCollege(String id) {
        College college = getCollegeById(id);
        collegeRepository.delete(college); // Trigger @SQLDelete
    }
}
