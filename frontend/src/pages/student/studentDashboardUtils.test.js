import test from 'node:test';
import assert from 'node:assert/strict';
import { getStudentDashboardOfflineExams } from './studentDashboardUtils.js';

test('returns the offline exam for seeded test accounts', () => {
  const exams = getStudentDashboardOfflineExams({ email: 'test@gmail.com' });

  assert.equal(exams.length, 1);
  assert.equal(exams[0].title, 'Data Structures Midterm');
  assert.equal(exams[0].subject.name, 'Data Structures and Algorithms');
});

test('returns no offline exams for regular students', () => {
  const exams = getStudentDashboardOfflineExams({ email: 'student@secureassess.com' });

  assert.equal(exams.length, 0);
});