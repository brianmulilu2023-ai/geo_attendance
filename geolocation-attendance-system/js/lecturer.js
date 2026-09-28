/**
 * Lecturer Module
 * Lecturer-specific dashboard and attendance management
 */

const Lecturer = {
  /**
   * Get lecturer's dashboard data
   */
  getDashboardData(lecturerId) {
    const lecturer = Storage.getById('lecturers', lecturerId);
    const units = Auth.getUserUnits();
    const sessions = this.getActiveSessions(lecturerId);
    const stats = Attendance.getLecturerStats(lecturerId);

    return {
      lecturer: lecturer,
      stats: {
        assignedUnits: units.length,
        activeSessions: stats.activeSessions,
        studentsPresentToday: stats.presentToday,
        totalAttendance: stats.totalRecords
      },
      units: units,
      sessions: sessions,
      recentSessions: this.getRecentSessions(lecturerId, 5)
    };
  },

  /**
   * Get lecturer's units
   */
  getLecturerUnits(lecturerId) {
    const assignments = Storage.getByProperty('assignments', 'lecturerId', lecturerId)
      .filter(a => a.type === 'lecturer_unit');

    return assignments.map(assignment => {
      const unit = Storage.getById('units', assignment.unitId);
      const students = this.getUnitStudents(unit.id);

      return {
        ...unit,
        studentCount: students.length,
        activeSessions: Storage.getByProperty('attendanceSessions', 'unitId', unit.id)
          .filter(s => s.status === 'active').length
      };
    });
  },

  /**
   * Get active attendance sessions for lecturer
   */
  getActiveSessions(lecturerId) {
    return Storage.getByProperty('attendanceSessions', 'lecturerId', lecturerId)
      .filter(session => session.status === 'active' || session.status === 'completed')
      .sort((a, b) => new Date(`${b.date}T${b.startTime}`) - new Date(`${a.date}T${a.startTime}`));
  },

  /**
   * Get all sessions for lecturer
   */
  getAllSessions(lecturerId) {
    return Storage.getByProperty('attendanceSessions', 'lecturerId', lecturerId)
      .sort((a, b) => new Date(`${b.date}T${b.startTime}`) - new Date(`${a.date}T${a.startTime}`));
  },

  /**
   * Get recent sessions
   */
  getRecentSessions(lecturerId, limit = 5) {
    return this.getAllSessions(lecturerId).slice(0, limit).map(session => {
      const unit = Storage.getById('units', session.unitId);
      const presentCount = session.studentsPresent ? session.studentsPresent.length : 0;

      return {
        ...session,
        unitName: unit ? unit.name : 'Unknown',
        presentCount: presentCount
      };
    });
  },

  /**
   * Create attendance session
   */
  createSession(lecturerId, sessionData) {
    // Validate required fields
    if (!sessionData.unitId || !sessionData.date || !sessionData.startTime || 
        !sessionData.endTime || !sessionData.venue || sessionData.latitude === undefined || 
        sessionData.longitude === undefined || !sessionData.radius) {
      return { success: false, message: 'All fields are required' };
    }

    // Validate unit is assigned to lecturer
    const isAssigned = Storage.getByProperty('assignments', 'lecturerId', lecturerId)
      .some(a => a.type === 'lecturer_unit' && a.unitId === sessionData.unitId);

    if (!isAssigned) {
      return { success: false, message: 'You are not assigned to this unit' };
    }

    // Validate times
    if (sessionData.startTime >= sessionData.endTime) {
      return { success: false, message: 'Start time must be before end time' };
    }

    // Validate radius
    if (sessionData.radius <= 0) {
      return { success: false, message: 'Radius must be greater than 0' };
    }

    // Create session
    const session = {
      id: Storage.generateId(),
      unitId: sessionData.unitId,
      lecturerId: lecturerId,
      venue: sessionData.venue,
      latitude: parseFloat(sessionData.latitude),
      longitude: parseFloat(sessionData.longitude),
      radius: parseInt(sessionData.radius),
      date: sessionData.date,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      status: 'scheduled',
      studentsPresent: [],
      createdDate: new Date().toISOString()
    };

    Storage.save('attendanceSessions', session);

    return { success: true, message: 'Session created successfully', session: session };
  },

  /**
   * Start attendance session
   */
  startSession(sessionId) {
    const session = Storage.getById('attendanceSessions', sessionId);
    if (!session) {
      return { success: false, message: 'Session not found' };
    }

    const updatedSession = Storage.update('attendanceSessions', sessionId, { status: 'active' });
    return { success: true, message: 'Attendance session started', session: updatedSession };
  },

  /**
   * End attendance session
   */
  endSession(sessionId) {
    const session = Storage.getById('attendanceSessions', sessionId);
    if (!session) {
      return { success: false, message: 'Session not found' };
    }

    const updatedSession = Storage.update('attendanceSessions', sessionId, { status: 'completed' });
    return { success: true, message: 'Attendance session ended', session: updatedSession };
  },

  /**
   * Get students assigned to a unit
   */
  getUnitStudents(unitId) {
    const assignments = Storage.getByProperty('assignments', 'unitId', unitId)
      .filter(a => a.type === 'student_unit');

    return assignments.map(assignment => {
      const student = Storage.getById('students', assignment.studentId);
      const stats = Attendance.getStudentStats(student.id);

      return {
        ...student,
        attendanceRate: stats.percentage,
        sessionsAttended: stats.present
      };
    });
  },

  /**
   * Get session attendance details
   */
  getSessionAttendance(sessionId) {
    const session = Storage.getById('attendanceSessions', sessionId);
    if (!session) return { session: null, attendance: [], absent: [] };

    const allStudents = this.getUnitStudents(session.unitId);
    const attendance = Attendance.getSessionAttendance(sessionId);

    const presentStudentIds = attendance.map(a => a.studentId);
    const absentStudents = allStudents.filter(s => !presentStudentIds.includes(s.id));

    const attendanceWithDetails = attendance.map(record => {
      const student = Storage.getById('students', record.studentId);
      return {
        ...record,
        studentName: student ? student.name : 'Unknown',
        registrationNumber: student ? student.registrationNumber : '-'
      };
    });

    return {
      session: session,
      attendance: attendanceWithDetails,
      absent: absentStudents,
      totalStudents: allStudents.length,
      presentCount: attendance.length,
      absentCount: absentStudents.length
    };
  },

  /**
   * Get lecturer's attendance records for all sessions
   */
  getAttendanceRecords(lecturerId, filters = {}) {
    let records = Attendance.getLecturerAttendance(lecturerId, filters);

    return records.map(record => {
      const student = Storage.getById('students', record.studentId);
      const unit = Storage.getById('units', record.unitId);
      const session = Storage.getById('attendanceSessions', record.sessionId);

      return {
        ...record,
        studentName: student ? student.name : 'Unknown',
        registrationNumber: student ? student.registrationNumber : '-',
        unitName: unit ? unit.name : 'Unknown',
        unitCode: unit ? unit.code : '-',
        sessionVenue: session ? session.venue : record.venue
      };
    });
  },

  /**
   * Get attendance statistics for lecturer
   */
  getAttendanceStats(lecturerId) {
    const records = Attendance.getLecturerAttendance(lecturerId);
    const sessions = this.getAllSessions(lecturerId);

    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(r => r.date === today);

    return {
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.status === 'completed').length,
      totalRecords: records.length,
      todayPresent: todayRecords.filter(r => r.status === 'present').length,
      averageAttendance: this.calculateAverageAttendance(lecturerId)
    };
  },

  /**
   * Calculate average attendance rate
   */
  calculateAverageAttendance(lecturerId) {
    const units = this.getLecturerUnits(lecturerId);
    if (units.length === 0) return 0;

    let totalPercentage = 0;
    units.forEach(unit => {
      const students = this.getUnitStudents(unit.id);
      if (students.length > 0) {
        const avgRate = students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length;
        totalPercentage += avgRate;
      }
    });

    return totalPercentage / units.length;
  },

  /**
   * Search attendance records
   */
  searchAttendance(lecturerId, query) {
    const records = this.getAttendanceRecords(lecturerId);
    if (!query) return records;

    const lowerQuery = query.toLowerCase();
    return records.filter(record =>
      record.studentName.toLowerCase().includes(lowerQuery) ||
      record.registrationNumber.toLowerCase().includes(lowerQuery) ||
      record.unitName.toLowerCase().includes(lowerQuery) ||
      record.venue.toLowerCase().includes(lowerQuery) ||
      record.date.includes(query)
    );
  },

  /**
   * Filter attendance records
   */
  filterAttendance(lecturerId, filters = {}) {
    return Attendance.getLecturerAttendance(lecturerId, filters);
  },

  /**
   * Get session with full details
   */
  getSessionDetails(sessionId) {
    const session = Storage.getById('attendanceSessions', sessionId);
    if (!session) return null;

    const unit = Storage.getById('units', session.unitId);
    const lecturer = Storage.getById('lecturers', session.lecturerId);
    const attendance = this.getSessionAttendance(sessionId);

    return {
      ...session,
      unit: unit,
      lecturer: lecturer,
      attendance: attendance
    };
  }
};
