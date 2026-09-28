/**
 * Attendance Module
 * Handles attendance marking, validation, and record management
 */

const Attendance = {
  /**
   * Mark student attendance
   * Performs all validations before recording
   */
  markAttendance(studentId, sessionId) {
    const student = Storage.getById('students', studentId);
    const session = Storage.getById('attendanceSessions', sessionId);

    if (!student || !session) {
      return { success: false, message: 'Invalid student or session' };
    }

    // Check if session is active
    if (session.status !== 'active' && session.status !== 'completed') {
      return { success: false, message: 'Attendance session is not active' };
    }

    // Check if student is assigned to this unit
    const isAssigned = Storage.getByProperty('assignments', 'studentId', studentId)
      .filter(a => a.type === 'student_unit')
      .some(a => a.unitId === session.unitId);

    if (!isAssigned) {
      return { success: false, message: 'You are not assigned to this unit' };
    }

    // Check for duplicate attendance
    const existing = Storage.getAll('attendanceRecords').find(
      record => record.studentId === studentId && record.sessionId === sessionId
    );

    if (existing) {
      return { success: false, message: 'Attendance already recorded for this session' };
    }

    // Check geolocation and distance
    if (!session.latitude || !session.longitude) {
      return { success: false, message: 'Session venue location not set' };
    }

    // Get current location
    return {
      success: true,
      message: 'All validations passed',
      student: student,
      session: session
    };
  },

  /**
   * Record attendance after location verification
   */
  recordAttendance(studentId, sessionId, studentLat, studentLon, distance) {
    const student = Storage.getById('students', studentId);
    const session = Storage.getById('attendanceSessions', sessionId);

    if (!student || !session) {
      return { success: false, message: 'Invalid student or session' };
    }

    // Final distance check
    if (distance > session.radius) {
      return { 
        success: false, 
        message: `You are ${distance}m away. Required radius: ${session.radius}m` 
      };
    }

    // Create attendance record
    const record = {
      id: Storage.generateId(),
      sessionId: sessionId,
      studentId: studentId,
      unitId: session.unitId,
      lecturerId: session.lecturerId,
      date: session.date,
      time: this.getCurrentTime(),
      venue: session.venue,
      studentLatitude: studentLat,
      studentLongitude: studentLon,
      venueLatitude: session.latitude,
      venueLongitude: session.longitude,
      distance: distance,
      radius: session.radius,
      ipAddress: student.ipAddress,
      deviceId: student.deviceId,
      status: 'present'
    };

    // Save attendance record
    Storage.save('attendanceRecords', record);

    // Add student to session's present list
    if (!session.studentsPresent) {
      session.studentsPresent = [];
    }
    if (!session.studentsPresent.includes(studentId)) {
      session.studentsPresent.push(studentId);
      Storage.update('attendanceSessions', sessionId, { studentsPresent: session.studentsPresent });
    }

    return { success: true, message: 'Attendance recorded successfully', record: record };
  },

  /**
   * Check if student already marked attendance for a session
   */
  isAttendanceMarked(studentId, sessionId) {
    return Storage.getAll('attendanceRecords').some(
      record => record.studentId === studentId && record.sessionId === sessionId
    );
  },

  /**
   * Get student's attendance records
   */
  getStudentAttendance(studentId, filters = {}) {
    let records = Storage.getByProperty('attendanceRecords', 'studentId', studentId);

    if (filters.unitId) {
      records = records.filter(r => r.unitId === filters.unitId);
    }

    if (filters.status) {
      records = records.filter(r => r.status === filters.status);
    }

    if (filters.dateFrom && filters.dateTo) {
      records = records.filter(r => 
        r.date >= filters.dateFrom && r.date <= filters.dateTo
      );
    }

    return records.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /**
   * Get session's attendance records
   */
  getSessionAttendance(sessionId) {
    return Storage.getByProperty('attendanceRecords', 'sessionId', sessionId)
      .sort((a, b) => new Date(b.time) - new Date(a.time));
  },

  /**
   * Get lecturer's attendance records
   */
  getLecturerAttendance(lecturerId, filters = {}) {
    let records = Storage.getByProperty('attendanceRecords', 'lecturerId', lecturerId);

    if (filters.sessionId) {
      records = records.filter(r => r.sessionId === filters.sessionId);
    }

    if (filters.unitId) {
      records = records.filter(r => r.unitId === filters.unitId);
    }

    if (filters.dateFrom && filters.dateTo) {
      records = records.filter(r => 
        r.date >= filters.dateFrom && r.date <= filters.dateTo
      );
    }

    return records.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /**
   * Get all attendance records (admin)
   */
  getAllAttendanceRecords(filters = {}) {
    let records = Storage.getAll('attendanceRecords');

    if (filters.studentId) {
      records = records.filter(r => r.studentId === filters.studentId);
    }

    if (filters.unitId) {
      records = records.filter(r => r.unitId === filters.unitId);
    }

    if (filters.lecturerId) {
      records = records.filter(r => r.lecturerId === filters.lecturerId);
    }

    if (filters.status) {
      records = records.filter(r => r.status === filters.status);
    }

    if (filters.dateFrom && filters.dateTo) {
      records = records.filter(r => 
        r.date >= filters.dateFrom && r.date <= filters.dateTo
      );
    }

    return records.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /**
   * Get attendance statistics for student
   */
  getStudentStats(studentId) {
    const records = Storage.getByProperty('attendanceRecords', 'studentId', studentId);
    
    if (records.length === 0) {
      return { total: 0, present: 0, absent: 0, percentage: 0 };
    }

    const present = records.filter(r => r.status === 'present').length;
    const absent = records.length - present;

    return {
      total: records.length,
      present: present,
      absent: absent,
      percentage: (present / records.length) * 100
    };
  },

  /**
   * Get attendance statistics for lecturer
   */
  getLecturerStats(lecturerId) {
    const records = Storage.getByProperty('attendanceRecords', 'lecturerId', lecturerId);
    const sessions = Storage.getByProperty('attendanceSessions', 'lecturerId', lecturerId);

    if (records.length === 0) {
      return { 
        totalSessions: sessions.length, 
        totalRecords: 0, 
        presentToday: 0,
        activeSessions: 0
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const presentToday = records.filter(r => r.date === today && r.status === 'present').length;
    const activeSessions = sessions.filter(s => s.status === 'active').length;

    return {
      totalSessions: sessions.length,
      totalRecords: records.length,
      presentToday: presentToday,
      activeSessions: activeSessions
    };
  },

  /**
   * Get current time in HH:MM format
   */
  getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  /**
   * Get attendance record with related data
   */
  getAttendanceDetails(recordId) {
    const record = Storage.getById('attendanceRecords', recordId);
    if (!record) return null;

    const student = Storage.getById('students', record.studentId);
    const lecturer = Storage.getById('lecturers', record.lecturerId);
    const unit = Storage.getById('units', record.unitId);
    const session = Storage.getById('attendanceSessions', record.sessionId);

    return {
      record: record,
      student: student,
      lecturer: lecturer,
      unit: unit,
      session: session
    };
  },

  /**
   * Delete attendance record (admin only)
   */
  deleteAttendance(recordId) {
    const record = Storage.getById('attendanceRecords', recordId);
    if (!record) {
      return { success: false, message: 'Record not found' };
    }

    // Remove from session's present list
    const session = Storage.getById('attendanceSessions', record.sessionId);
    if (session && session.studentsPresent) {
      session.studentsPresent = session.studentsPresent.filter(id => id !== record.studentId);
      Storage.update('attendanceSessions', record.sessionId, { studentsPresent: session.studentsPresent });
    }

    // Delete record
    Storage.delete('attendanceRecords', recordId);

    return { success: true, message: 'Attendance record deleted' };
  },

  /**
   * Search attendance records
   */
  searchAttendance(query, fields = ['studentId', 'venue', 'unitId']) {
    return Storage.search('attendanceRecords', query, fields);
  },

  /**
   * Get attendance by date range
   */
  getAttendanceByDateRange(startDate, endDate) {
    return Storage.getAll('attendanceRecords').filter(record => {
      return record.date >= startDate && record.date <= endDate;
    });
  }
};
