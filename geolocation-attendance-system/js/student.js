/**
 * Student Module
 * Student-specific dashboard and functionality
 */

const Student = {
  /**
   * Get student's dashboard data
   */
  getDashboardData(studentId) {
    const student = Storage.getById('students', studentId);
    const units = Auth.getUserUnits();
    const stats = Attendance.getStudentStats(studentId);
    const sessions = this.getAvailableSessions(studentId);

    return {
      student: student,
      stats: {
        totalUnits: units.length,
        attendanceSessions: Storage.getAll('attendanceSessions').length,
        present: stats.present,
        attendanceRate: stats.percentage
      },
      units: units,
      sessions: sessions,
      recentAttendance: this.getRecentAttendance(studentId, 5)
    };
  },

  /**
   * Get student's available attendance sessions
   */
  getAvailableSessions(studentId) {
    const student = Storage.getById('students', studentId);
    const sessions = Storage.getAll('attendanceSessions');
    const studentUnits = Storage.getByProperty('assignments', 'studentId', studentId)
      .filter(a => a.type === 'student_unit')
      .map(a => a.unitId);

    return sessions
      .filter(session => studentUnits.includes(session.unitId))
      .sort((a, b) => new Date(`${b.date}T${b.startTime}`) - new Date(`${a.date}T${a.startTime}`));
  },

  /**
   * Get session details for student
   */
  getSessionDetails(studentId, sessionId) {
    const session = Storage.getById('attendanceSessions', sessionId);
    if (!session) return null;

    const lecturer = Storage.getById('lecturers', session.lecturerId);
    const unit = Storage.getById('units', session.unitId);
    const alreadyAttended = Attendance.isAttendanceMarked(studentId, sessionId);

    return {
      session: session,
      lecturer: lecturer,
      unit: unit,
      alreadyAttended: alreadyAttended,
      venue: {
        name: session.venue,
        latitude: session.latitude,
        longitude: session.longitude,
        radius: session.radius
      }
    };
  },

  /**
   * Get student's units
   */
  getStudentUnits(studentId) {
    const assignments = Storage.getByProperty('assignments', 'studentId', studentId)
      .filter(a => a.type === 'student_unit');

    return assignments.map(assignment => {
      const unit = Storage.getById('units', assignment.unitId);
      const lecturer = this.getUnitLecturer(unit.id);
      const stats = this.getUnitAttendanceStats(studentId, unit.id);

      return {
        ...unit,
        lecturer: lecturer,
        attendanceRate: stats.percentage,
        sessionCount: stats.sessionCount
      };
    });
  },

  /**
   * Get unit's lecturer
   */
  getUnitLecturer(unitId) {
    const lecturerAssignment = Storage.getByProperty('assignments', 'unitId', unitId)
      .find(a => a.type === 'lecturer_unit');

    if (lecturerAssignment) {
      return Storage.getById('lecturers', lecturerAssignment.lecturerId);
    }
    return null;
  },

  /**
   * Get unit attendance statistics for student
   */
  getUnitAttendanceStats(studentId, unitId) {
    const records = Storage.getAll('attendanceRecords').filter(
      r => r.studentId === studentId && r.unitId === unitId
    );

    if (records.length === 0) {
      return { present: 0, absent: 0, percentage: 0, sessionCount: 0 };
    }

    const present = records.filter(r => r.status === 'present').length;
    const sessionCount = Storage.getByProperty('attendanceSessions', 'unitId', unitId).length;

    return {
      present: present,
      absent: records.length - present,
      percentage: (present / records.length) * 100,
      sessionCount: sessionCount
    };
  },

  /**
   * Get recent attendance records
   */
  getRecentAttendance(studentId, limit = 5) {
    return Attendance.getStudentAttendance(studentId).slice(0, limit).map(record => {
      const unit = Storage.getById('units', record.unitId);
      return {
        ...record,
        unitName: unit ? unit.name : 'Unknown Unit'
      };
    });
  },

  /**
   * Get today's classes
   */
  getTodaysClasses(studentId) {
    const today = new Date().toISOString().split('T')[0];
    const sessions = this.getAvailableSessions(studentId);

    return sessions
      .filter(session => session.date === today || session.date >= today)
      .map(session => {
        const unit = Storage.getById('units', session.unitId);
        const lecturer = Storage.getById('lecturers', session.lecturerId);
        let status = 'upcoming';

        const now = new Date();
        const sessionStart = new Date(`${session.date}T${session.startTime}`);
        const sessionEnd = new Date(`${session.date}T${session.endTime}`);

        if (session.date === today) {
          if (now >= sessionStart && now <= sessionEnd) {
            status = 'active';
          } else if (now > sessionEnd) {
            status = 'completed';
          }
        }

        return {
          ...session,
          unit: unit,
          lecturer: lecturer,
          status: status
        };
      });
  },

  /**
   * Get attendance history with filters
   */
  getAttendanceHistory(studentId, filters = {}) {
    let records = Attendance.getStudentAttendance(studentId, filters);

    return records.map(record => {
      const unit = Storage.getById('units', record.unitId);
      const session = Storage.getById('attendanceSessions', record.sessionId);

      return {
        ...record,
        unitName: unit ? unit.name : 'Unknown',
        unitCode: unit ? unit.code : '-',
        sessionVenue: session ? session.venue : record.venue
      };
    });
  },

  /**
   * Search in student's units
   */
  searchUnits(studentId, query) {
    const units = this.getStudentUnits(studentId);
    if (!query) return units;

    const lowerQuery = query.toLowerCase();
    return units.filter(unit => 
      unit.name.toLowerCase().includes(lowerQuery) ||
      unit.code.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Search in student's attendance history
   */
  searchAttendanceHistory(studentId, query) {
    const records = this.getAttendanceHistory(studentId);
    if (!query) return records;

    const lowerQuery = query.toLowerCase();
    return records.filter(record =>
      record.unitName.toLowerCase().includes(lowerQuery) ||
      record.venue.toLowerCase().includes(lowerQuery) ||
      record.date.includes(query)
    );
  }
};
