package com.secureassess.service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.secureassess.entity.*;
import com.secureassess.repository.ExamAnswerRepository;
import com.secureassess.repository.ExamSessionRepository;
import com.secureassess.repository.ResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ResultService {

    private final ResultRepository resultRepository;
    private final ExamSessionRepository examSessionRepository;
    private final ExamAnswerRepository examAnswerRepository;

    public ResultService(ResultRepository resultRepository, ExamSessionRepository examSessionRepository,
                         ExamAnswerRepository examAnswerRepository) {
        this.resultRepository = resultRepository;
        this.examSessionRepository = examSessionRepository;
        this.examAnswerRepository = examAnswerRepository;
    }

    @Transactional(readOnly = true)
    public List<Result> getResultsByStudent(String studentId) {
        return resultRepository.findByStudentId(studentId);
    }

    @Transactional(readOnly = true)
    public List<Result> getResultsByAssessment(String assessmentId) {
        return resultRepository.findByAssessmentId(assessmentId);
    }

    @Transactional(readOnly = true)
    public Result getResultById(String id) {
        return resultRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Result not found with ID: " + id));
    }

    public Result generateResultForSession(String sessionId) {
        // Check if result already exists
        Optional<Result> existing = resultRepository.findByExamSessionId(sessionId);
        if (existing.isPresent()) {
            return existing.get();
        }

        ExamSession session = examSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Exam Session not found."));

        if (session.getStatus() != SessionStatus.SUBMITTED && session.getStatus() != SessionStatus.FORCE_SUBMITTED) {
            throw new IllegalArgumentException("Exam session is still in progress.");
        }

        List<ExamAnswer> answers = examAnswerRepository.findByExamSessionId(sessionId);
        
        double scoreObtained = 0.0;
        for (ExamAnswer answer : answers) {
            scoreObtained += answer.getMarksObtained();
        }

        // Adjust score if negative mapping made it drop below 0
        if (scoreObtained < 0) {
            scoreObtained = 0.0;
        }

        Assessment assessment = session.getAssessment();
        double totalScore = assessment.getTotalMarks();
        double percentage = (scoreObtained / totalScore) * 100.0;

        Result result = new Result();
        result.setExamSession(session);
        result.setStudent(session.getStudent());
        result.setAssessment(assessment);
        result.setScoreObtained(scoreObtained);
        result.setTotalScore(totalScore);
        result.setPercentage(percentage);

        int timeTaken = 0;
        if (session.getCompletedAt() != null && session.getStartedAt() != null) {
            timeTaken = (int) ChronoUnit.SECONDS.between(session.getStartedAt(), session.getCompletedAt());
        }
        result.setTimeTakenSeconds(timeTaken);

        result.setStatus(scoreObtained >= assessment.getPassingMarks() ? "PASSED" : "FAILED");
        result = resultRepository.save(result);

        // Update ranks and percentiles for all students of this assessment
        updatePeerRankings(assessment.getId());

        return resultRepository.findById(result.getId()).get();
    }

    private void updatePeerRankings(String assessmentId) {
        List<Result> peers = resultRepository.findByAssessmentId(assessmentId);
        if (peers.isEmpty()) return;

        // Sort peers by score descending, then by time taken ascending
        peers.sort((r1, r2) -> {
            int scoreCompare = Double.compare(r2.getScoreObtained(), r1.getScoreObtained());
            if (scoreCompare != 0) return scoreCompare;
            return Integer.compare(r1.getTimeTakenSeconds(), r2.getTimeTakenSeconds());
        });

        int n = peers.size();
        for (int i = 0; i < n; i++) {
            Result r = peers.get(i);
            int rank = i + 1;
            r.setRank(rank);

            // Percentile formula: ((N - Rank) / N) * 100
            double percentile = ((double) (n - rank) / n) * 100.0;
            r.setPercentile(percentile == 0.0 && n == 1 ? 100.0 : percentile);
            
            resultRepository.save(r);
        }
    }

    public ByteArrayInputStream generateResultPDF(String resultId) {
        Result result = getResultById(resultId);
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font Settings
            Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
            Font sectionFont = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font bodyFont = new Font(Font.HELVETICA, 10, Font.NORMAL);

            // Title
            Paragraph title = new Paragraph("SecureAssess Exam Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Student & Exam Metadata Table
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(20);

            infoTable.addCell(new Paragraph("Student Name:", bodyFont));
            infoTable.addCell(new Paragraph(result.getStudent().getFullName(), bodyFont));
            
            infoTable.addCell(new Paragraph("Exam Paper:", bodyFont));
            infoTable.addCell(new Paragraph(result.getAssessment().getTitle(), bodyFont));

            infoTable.addCell(new Paragraph("Subject Code:", bodyFont));
            infoTable.addCell(new Paragraph(result.getAssessment().getSubject().getCode(), bodyFont));

            infoTable.addCell(new Paragraph("Score Obtained:", bodyFont));
            infoTable.addCell(new Paragraph(result.getScoreObtained() + " / " + result.getTotalScore(), bodyFont));

            infoTable.addCell(new Paragraph("Percentage:", bodyFont));
            infoTable.addCell(new Paragraph(String.format("%.2f%%", result.getPercentage()), bodyFont));

            infoTable.addCell(new Paragraph("Status:", bodyFont));
            infoTable.addCell(new Paragraph(result.getStatus(), bodyFont));

            infoTable.addCell(new Paragraph("Class Rank:", bodyFont));
            infoTable.addCell(new Paragraph("Rank " + result.getRank(), bodyFont));

            infoTable.addCell(new Paragraph("Percentile Rank:", bodyFont));
            infoTable.addCell(new Paragraph(String.format("%.1f Percentile", result.getPercentile()), bodyFont));

            infoTable.addCell(new Paragraph("Time Spent:", bodyFont));
            infoTable.addCell(new Paragraph(result.getTimeTakenSeconds() / 60 + " Min(s) " + result.getTimeTakenSeconds() % 60 + " Sec(s)", bodyFont));

            infoTable.addCell(new Paragraph("Proctor Warning Alerts:", bodyFont));
            infoTable.addCell(new Paragraph(result.getExamSession().getCurrentWarningCount() + " Warnings Recorded", bodyFont));

            document.add(infoTable);

            // Footer disclaimer
            Paragraph footer = new Paragraph("This report was securely generated by the SecureAssess Automated Grading Engine.", new Font(Font.HELVETICA, 8, Font.ITALIC));
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(30);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF document: " + e.getMessage());
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
