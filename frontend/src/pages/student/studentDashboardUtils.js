export const getStudentDashboardOfflineExams = (user) => {
  if (user?.email === 'test@gmail.com' || user?.email?.startsWith('test-')) {
    return [
      {
        id: 1,
        title: 'Data Structures Midterm',
        subject: { name: 'Data Structures and Algorithms' },
        durationMinutes: 90,
        totalMarks: 100,
      },
    ];
  }

  return [];
};