/**
 * Admin Module
 * Administrative dashboard and system management
 */

const Admin = {
  /**
   * Get admin dashboard data
   */
  getDashboardData() {
    const stats = this.getSystemStats();
    const recentAttendance = this.getRecentAttendance(10);
    const attendanceToday = this.getTodayAttendance();

    return {
      stats: stats,
      recentAttendance: recentAttendance,
      attendanceToday: attendanceToday
    };
  },

  /**
   * Get system statistics
   */
  getSystemStats() {
    const students = Storage.getAll('students');
    const lecturers = Storage.getAll('lecturers');
    const units = Storage.getAll('units');
    const records = Storage.getAll('attendanceRecords');
    const today = new Date().toISOString().split('T')[0];

    const todayRecords = records.filter(r => r.date === today);

    return {
      totalStudents: students.length,
      totalLecturers: lecturers.length,
      totalUnits: units.length,
      totalAttendanceRecords: records.length,
      attendanceToday: todayRecords.length,
      presentToday: todayRecords.filter(r => r.status === 'present').length,
      attendanceTodayPercentage: todayRecords.length > 0 
        ? (todayRecords.filter(r => r.status === 'present').length / todayRecords.length * 100)
        : 0
    };
  },

  /**
   * STUDENT MANAGEMENT
   */

  /**
   * Get all students
   */
  getAllStudents() {
    return Storage.getAll('students');
  },

  /**
   * Add new student
   */
  addStudent(studentData) {
    // Validate
    if (!studentData.name || !studentData.registrationNumber || !studentData.email) {
      return { success: false, message: 'Required fields missing' };
    }

    // Check duplicates
    if (Storage.getAll('students').some(s => s.email === studentData.email)) {
      return { success: false, message: 'Email already exists' };
    }

    const student = {
      id: Auth.generateStudentId(),
      name: studentData.name,
      registrationNumber: studentData.registrationNumber,
      email: studentData.email,
      password: studentData.password || '123456',
      phoneNumber: studentData.phoneNumber || '',
      course: studentData.course || '',
      yearOfStudy: studentData.yearOfStudy || 1,
      registrationDate: new Date().toISOString().split('T')[0],
      ipAddress: Auth.generateDemoIP(),
      deviceId: Auth.generateDeviceId(),
      status: 'active'
    };

    Storage.save('students', student);
    return { success: true, message: 'Student added successfully', student: student };
  },

  /**
   * Edit student
   */
  editStudent(studentId, updates) {
    const student = Storage.getById('students', studentId);
    if (!student) {
      return { success: false, message: 'Student not found' };
    }

    const updated = Storage.update('students', studentId, updates);
    return { success: true, message: 'Student updated successfully', student: updated };
  },

  /**
   * Delete student
   */
  deleteStudent(studentId) {
    // Also delete related assignments
    const assignments = Storage.getAll('assignments').filter(a => a.studentId !== studentId);
    Storage.clear('assignments');
    assignments.forEach(a => Storage.save('assignments', a));

    // Delete student
    Storage.delete('students', studentId);
    return { success: true, message: 'Student deleted successfully' };
  },

  /**
   * Search students
   */
  searchStudents(query) {
    return Storage.search('students', query, ['name', 'registrationNumber', 'email']);
  },

  /**
   * LECTURER MANAGEMENT
   */

  /**
   * Get all lecturers
   */
  getAllLecturers() {
    return Storage.getAll('lecturers');
  },

  /**
   * Add new lecturer
   */
  addLecturer(lecturerData) {
    // Validate
    if (!lecturerData.name || !lecturerData.email || !lecturerData.department) {
      return { success: false, message: 'Required fields missing' };
    }

    // Check duplicates
    if (Storage.getAll('lecturers').some(l => l.email === lecturerData.email)) {
      return { success: false, message: 'Email already exists' };
    }

    const lecturer = {
      id: `LEC${String(Storage.getAll('lecturers').length + 1).padStart(3, '0')}`,
      name: lecturerData.name,
      email: lecturerData.email,
      password: lecturerData.password || '123456',
      phoneNumber: lecturerData.phoneNumber || '',
      department: lecturerData.department,
      specialization: lecturerData.specialization || '',
      employmentDate: lecturerData.employmentDate || new Date().toISOString().split('T')[0],
      status: 'active'
    };

    Storage.save('lecturers', lecturer);
    return { success: true, message: 'Lecturer added successfully', lecturer: lecturer };
  },

  /**
   * Edit lecturer
   */
  editLecturer(lecturerId, updates) {
    const lecturer = Storage.getById('lecturers', lecturerId);
    if (!lecturer) {
      return { success: false, message: 'Lecturer not found' };
    }

    const updated = Storage.update('lecturers', lecturerId, updates);
    return { success: true, message: 'Lecturer updated successfully', lecturer: updated };
  },

  /**
   * Delete lecturer
   */
  deleteLecturer(lecturerId) {
    // Delete related assignments
    const assignments = Storage.getAll('assignments').filter(a => a.lecturerId !== lecturerId);
    Storage.clear('assignments');
    assignments.forEach(a => Storage.save('assignments', a));

    // Delete lecturer
    Storage.delete('lecturers', lecturerId);
    return { success: true, message: 'Lecturer deleted successfully' };
  },

  /**
   * Search lecturers
   */
  searchLecturers(query) {
    return Storage.search('lecturers', query, ['name', 'email', 'department']);
  },

  /**
   * UNIT/COURSE MANAGEMENT
   */

  /**
   * Get all units
   */
  getAllUnits() {
    return Storage.getAll('units');
  },

  /**
   * Add new unit
   */
  addUnit(unitData) {
    // Validate
    if (!unitData.code || !unitData.name || !unitData.creditHours) {
      return { success: false, message: 'Required fields missing' };
    }

    // Check duplicate code
    if (Storage.getAll('units').some(u => u.code === unitData.code)) {
      return { success: false, message: 'Unit code already exists' };
    }

    const unit = {
      id: `UNIT${String(Storage.getAll('units').length + 1).padStart(3, '0')}`,
      code: unitData.code,
      name: unitData.name,
      department: unitData.department || '',
      creditHours: parseInt(unitData.creditHours),
      description: unitData.description || '',
      status: 'active'
    };

    Storage.save('units', unit);
    return { success: true, message: 'Unit added successfully', unit: unit };
  },

  /**
   * Edit unit
   */
  editUnit(unitId, updates) {
    const unit = Storage.getById('units', unitId);
    if (!unit) {
      return { success: false, message: 'Unit not found' };
    }

    const updated = Storage.update('units', unitId, updates);
    return { success: true, message: 'Unit updated successfully', unit: updated };
  },

  /**
   * Delete unit
   */
  deleteUnit(unitId) {
    // Delete related assignments
    const assignments = Storage.getAll('assignments').filter(a => a.unitId !== unitId);
    Storage.clear('assignments');
    assignments.forEach(a => Storage.save('assignments', a));

    // Delete unit
    Storage.delete('units', unitId);
    return { success: true, message: 'Unit deleted successfully' };
  },

  /**
   * Search units
   */
  searchUnits(query) {
    return Storage.search('units', query, ['code', 'name', 'department']);
  },

  /**
   * ASSIGNMENT MANAGEMENT
   */

  /**
   * Get all assignments
   */
  getAllAssignments() {
    return Storage.getAll('assignments');
  },

  /**
   * Get student's assigned units
   */
  getStudentUnits(studentId) {
    return Storage.getByProperty('assignments', 'studentId', studentId)
      .filter(a => a.type === 'student_unit');
  },

  /**
   * Get lecturer's assigned units
   */
  getLecturerUnits(lecturerId) {
    return Storage.getByProperty('assignments', 'lecturerId', lecturerId)
      .filter(a => a.type === 'lecturer_unit');
  },

  /**
   * Assign student to unit
   */
  assignStudentToUnit(studentId, unitId) {
    // Check if already assigned
    const existing = Storage.getAll('assignments').find(
      a => a.type === 'student_unit' && a.studentId === studentId && a.unitId === unitId
    );

    if (existing) {
      return { success: false, message: 'Student already assigned to this unit' };
    }

    const assignment = {
      id: Storage.generateId(),
      type: 'student_unit',
      studentId: studentId,
      unitId: unitId,
      assignmentDate: new Date().toISOString().split('T')[0]
    };

    Storage.save('assignments', assignment);
    return { success: true, message: 'Assignment created successfully', assignment: assignment };
  },

  /**
   * Assign lecturer to unit
   */
  assignLecturerToUnit(lecturerId, unitId) {
    // Check if already assigned
    const existing = Storage.getAll('assignments').find(
      a => a.type === 'lecturer_unit' && a.lecturerId === lecturerId && a.unitId === unitId
    );

    if (existing) {
      return { success: false, message: 'Lecturer already assigned to this unit' };
    }

    const assignment = {
      id: Storage.generateId(),
      type: 'lecturer_unit',
      lecturerId: lecturerId,
      unitId: unitId,
      assignmentDate: new Date().toISOString().split('T')[0]
    };

    Storage.save('assignments', assignment);
    return { success: true, message: 'Assignment created successfully', assignment: assignment };
  },

  /**
   * Remove assignment
   */
  removeAssignment(assignmentId) {
    Storage.delete('assignments', assignmentId);
    return { success: true, message: 'Assignment removed successfully' };
  },

  /**
   * ATTENDANCE MANAGEMENT
   */

  /**
   * Get all attendance records
   */
  getAllAttendanceRecords() {
    return Attendance.getAllAttendanceRecords();
  },

  /**
   * Get today's attendance
   */
  getTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];
    return Attendance.getAllAttendanceRecords({ dateFrom: today, dateTo: today });
  },

  /**
   * Get recent attendance
   */
  getRecentAttendance(limit = 10) {
    return Attendance.getAllAttendanceRecords().slice(0, limit).map(record => {
      const student = Storage.getById('students', record.studentId);
      const unit = Storage.getById('units', record.unitId);

      return {
        ...record,
        studentName: student ? student.name : 'Unknown',
        registrationNumber: student ? student.registrationNumber : '-',
        unitName: unit ? unit.name : 'Unknown'
      };
    });
  },

  /**
   * Delete attendance record
   */
  deleteAttendanceRecord(recordId) {
    return Attendance.deleteAttendance(recordId);
  },

  /**
   * Search attendance records
   */
  searchAttendanceRecords(query) {
    return Attendance.searchAttendance(query);
  },

  /**
   * Filter attendance records
   */
  filterAttendanceRecords(filters = {}) {
    return Attendance.getAllAttendanceRecords(filters);
  },

  /**
   * Get attendance by date range
   */
  getAttendanceByDateRange(startDate, endDate) {
    return Attendance.getAttendanceByDateRange(startDate, endDate);
  },

  /**
   * REPORTS
   */

  /**
   * Get system report
   */
  getSystemReport() {
    const stats = this.getSystemStats();
    const students = this.getAllStudents();
    const lecturers = this.getAllLecturers();
    const units = this.getAllUnits();

    return {
      generatedDate: new Date().toISOString(),
      stats: stats,
      studentStatusBreakdown: {
        active: students.filter(s => s.status === 'active').length,
        inactive: students.filter(s => s.status !== 'active').length
      },
      lecturerStatusBreakdown: {
        active: lecturers.filter(l => l.status === 'active').length,
        inactive: lecturers.filter(l => l.status !== 'active').length
      },
      units: units.length
    };
  }
};
