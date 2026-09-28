/**
 * Dummy Data Module
 * Initializes realistic sample data for the attendance system
 * This is DEMO data only - production uses a real database
 */

const DummyData = {
  initialize() {
    this.initStudents();
    this.initLecturers();
    this.initUnits();
    this.initAssignments();
    this.initAttendanceSessions();
    this.initAttendanceRecords();
  },

  // Initialize student dummy data
  initStudents() {
    const students = [
      {
        id: 'STU001',
        name: 'Brian Student',
        registrationNumber: 'EDU/001/2026',
        email: 'student@demo.com',
        password: '123456', // DEMO ONLY - Never store plain text in production
        phoneNumber: '+254712345678',
        course: 'Bachelor of Graphic Design',
        yearOfStudy: 3,
        registrationDate: '2024-01-15',
        ipAddress: '192.168.1.105',
        deviceId: 'DEVICE-8F3A92',
        status: 'active'
      },
      {
        id: 'STU002',
        name: 'Alice Johnson',
        registrationNumber: 'EDU/002/2026',
        email: 'alice.j@demo.com',
        password: '123456',
        phoneNumber: '+254712345679',
        course: 'Bachelor of Computer Science',
        yearOfStudy: 2,
        registrationDate: '2024-01-16',
        ipAddress: '192.168.1.106',
        deviceId: 'DEVICE-7G4B81',
        status: 'active'
      },
      {
        id: 'STU003',
        name: 'Michael Chen',
        registrationNumber: 'EDU/003/2026',
        email: 'michael.c@demo.com',
        password: '123456',
        phoneNumber: '+254712345680',
        course: 'Bachelor of Information Technology',
        yearOfStudy: 1,
        registrationDate: '2024-02-10',
        ipAddress: '192.168.1.107',
        deviceId: 'DEVICE-9H5C72',
        status: 'active'
      },
      {
        id: 'STU004',
        name: 'Sophie Williams',
        registrationNumber: 'EDU/004/2026',
        email: 'sophie.w@demo.com',
        password: '123456',
        phoneNumber: '+254712345681',
        course: 'Bachelor of Communication',
        yearOfStudy: 4,
        registrationDate: '2023-09-20',
        ipAddress: '192.168.1.108',
        deviceId: 'DEVICE-1I6D63',
        status: 'active'
      },
      {
        id: 'STU005',
        name: 'David Omondi',
        registrationNumber: 'EDU/005/2026',
        email: 'david.o@demo.com',
        password: '123456',
        phoneNumber: '+254712345682',
        course: 'Bachelor of Graphic Design',
        yearOfStudy: 3,
        registrationDate: '2024-01-18',
        ipAddress: '192.168.1.109',
        deviceId: 'DEVICE-2J7E54',
        status: 'active'
      },
      {
        id: 'STU006',
        name: 'Emma Rodriguez',
        registrationNumber: 'EDU/006/2026',
        email: 'emma.r@demo.com',
        password: '123456',
        phoneNumber: '+254712345683',
        course: 'Bachelor of Computer Science',
        yearOfStudy: 2,
        registrationDate: '2024-01-20',
        ipAddress: '192.168.1.110',
        deviceId: 'DEVICE-3K8F45',
        status: 'active'
      },
      {
        id: 'STU007',
        name: 'James Muturi',
        registrationNumber: 'EDU/007/2026',
        email: 'james.m@demo.com',
        password: '123456',
        phoneNumber: '+254712345684',
        course: 'Bachelor of Information Technology',
        yearOfStudy: 1,
        registrationDate: '2024-02-12',
        ipAddress: '192.168.1.111',
        deviceId: 'DEVICE-4L9G36',
        status: 'active'
      },
      {
        id: 'STU008',
        name: 'Lisa Anderson',
        registrationNumber: 'EDU/008/2026',
        email: 'lisa.a@demo.com',
        password: '123456',
        phoneNumber: '+254712345685',
        course: 'Bachelor of Communication',
        yearOfStudy: 3,
        registrationDate: '2024-01-22',
        ipAddress: '192.168.1.112',
        deviceId: 'DEVICE-5M0H27',
        status: 'active'
      },
      {
        id: 'STU009',
        name: 'Carlos Santos',
        registrationNumber: 'EDU/009/2026',
        email: 'carlos.s@demo.com',
        password: '123456',
        phoneNumber: '+254712345686',
        course: 'Bachelor of Computer Science',
        yearOfStudy: 4,
        registrationDate: '2023-08-15',
        ipAddress: '192.168.1.113',
        deviceId: 'DEVICE-6N1I18',
        status: 'active'
      },
      {
        id: 'STU010',
        name: 'Natalie Kim',
        registrationNumber: 'EDU/010/2026',
        email: 'natalie.k@demo.com',
        password: '123456',
        phoneNumber: '+254712345687',
        course: 'Bachelor of Graphic Design',
        yearOfStudy: 2,
        registrationDate: '2024-01-25',
        ipAddress: '192.168.1.114',
        deviceId: 'DEVICE-7O2J09',
        status: 'active'
      }
    ];

    Storage.clear('students');
    students.forEach(student => Storage.save('students', student));
    console.log('✓ Initialized 10 students');
  },

  // Initialize lecturer dummy data
  initLecturers() {
    const lecturers = [
      {
        id: 'LEC001',
        name: 'Dr. John Lecturer',
        email: 'lecturer@demo.com',
        password: '123456', // DEMO ONLY
        phoneNumber: '+254722123456',
        department: 'School of Design',
        specialization: 'Graphic Design & Web Design',
        employmentDate: '2015-08-10',
        status: 'active'
      },
      {
        id: 'LEC002',
        name: 'Prof. Sarah Johnson',
        email: 'sarah.j@demo.com',
        password: '123456',
        phoneNumber: '+254722123457',
        department: 'School of Computing',
        specialization: 'Database Systems & Web Development',
        employmentDate: '2012-06-15',
        status: 'active'
      },
      {
        id: 'LEC003',
        name: 'Dr. Ahmed Hassan',
        email: 'ahmed.h@demo.com',
        password: '123456',
        phoneNumber: '+254722123458',
        department: 'School of Communication',
        specialization: 'Digital Media & Advertising',
        employmentDate: '2016-09-20',
        status: 'active'
      },
      {
        id: 'LEC004',
        name: 'Dr. Margaret Nyambura',
        email: 'margaret.n@demo.com',
        password: '123456',
        phoneNumber: '+254722123459',
        department: 'School of Computing',
        specialization: 'IT & Network Administration',
        employmentDate: '2014-01-10',
        status: 'active'
      }
    ];

    Storage.clear('lecturers');
    lecturers.forEach(lecturer => Storage.save('lecturers', lecturer));
    console.log('✓ Initialized 4 lecturers');
  },

  // Initialize unit/course dummy data
  initUnits() {
    const units = [
      {
        id: 'UNIT001',
        code: 'GCA301',
        name: 'Graphic Communication',
        department: 'School of Design',
        creditHours: 3,
        description: 'Principles of visual communication and design theory',
        status: 'active'
      },
      {
        id: 'UNIT002',
        code: 'GCA302',
        name: 'Web Design',
        department: 'School of Design',
        creditHours: 4,
        description: 'Modern web design principles and responsive design',
        status: 'active'
      },
      {
        id: 'UNIT003',
        code: 'GCA303',
        name: 'Advertising Principles',
        department: 'School of Communication',
        creditHours: 3,
        description: 'Fundamentals of advertising and marketing communications',
        status: 'active'
      },
      {
        id: 'UNIT004',
        code: 'GCA304',
        name: 'Digital Media',
        department: 'School of Design',
        creditHours: 3,
        description: 'Digital media production and multimedia design',
        status: 'active'
      },
      {
        id: 'UNIT005',
        code: 'CSC301',
        name: 'Database Systems',
        department: 'School of Computing',
        creditHours: 4,
        description: 'Relational databases and database management',
        status: 'active'
      },
      {
        id: 'UNIT006',
        code: 'CSC302',
        name: 'Web Development',
        department: 'School of Computing',
        creditHours: 4,
        description: 'Server-side and client-side web development',
        status: 'active'
      },
      {
        id: 'UNIT007',
        code: 'COM305',
        name: 'Communication Skills',
        department: 'School of Communication',
        creditHours: 2,
        description: 'Professional communication and presentation skills',
        status: 'active'
      },
      {
        id: 'UNIT008',
        code: 'CSC303',
        name: 'Network Administration',
        department: 'School of Computing',
        creditHours: 3,
        description: 'Network management and system administration',
        status: 'active'
      }
    ];

    Storage.clear('units');
    units.forEach(unit => Storage.save('units', unit));
    console.log('✓ Initialized 8 units');
  },

  // Initialize assignments (Student-Unit and Lecturer-Unit)
  initAssignments() {
    const assignments = [
      // Student assignments
      { id: 'ASS001', type: 'student_unit', studentId: 'STU001', unitId: 'UNIT002', assignmentDate: '2024-01-15' },
      { id: 'ASS002', type: 'student_unit', studentId: 'STU001', unitId: 'UNIT001', assignmentDate: '2024-01-15' },
      { id: 'ASS003', type: 'student_unit', studentId: 'STU001', unitId: 'UNIT004', assignmentDate: '2024-01-15' },
      { id: 'ASS004', type: 'student_unit', studentId: 'STU002', unitId: 'UNIT005', assignmentDate: '2024-01-16' },
      { id: 'ASS005', type: 'student_unit', studentId: 'STU002', unitId: 'UNIT006', assignmentDate: '2024-01-16' },
      { id: 'ASS006', type: 'student_unit', studentId: 'STU003', unitId: 'UNIT006', assignmentDate: '2024-02-10' },
      { id: 'ASS007', type: 'student_unit', studentId: 'STU003', unitId: 'UNIT008', assignmentDate: '2024-02-10' },
      { id: 'ASS008', type: 'student_unit', studentId: 'STU004', unitId: 'UNIT003', assignmentDate: '2023-09-20' },
      { id: 'ASS009', type: 'student_unit', studentId: 'STU004', unitId: 'UNIT007', assignmentDate: '2023-09-20' },
      { id: 'ASS010', type: 'student_unit', studentId: 'STU005', unitId: 'UNIT001', assignmentDate: '2024-01-18' },
      { id: 'ASS011', type: 'student_unit', studentId: 'STU005', unitId: 'UNIT002', assignmentDate: '2024-01-18' },
      { id: 'ASS012', type: 'student_unit', studentId: 'STU006', unitId: 'UNIT005', assignmentDate: '2024-01-20' },
      { id: 'ASS013', type: 'student_unit', studentId: 'STU007', unitId: 'UNIT006', assignmentDate: '2024-02-12' },
      { id: 'ASS014', type: 'student_unit', studentId: 'STU008', unitId: 'UNIT002', assignmentDate: '2024-01-22' },
      { id: 'ASS015', type: 'student_unit', studentId: 'STU009', unitId: 'UNIT005', assignmentDate: '2023-08-15' },
      { id: 'ASS016', type: 'student_unit', studentId: 'STU010', unitId: 'UNIT001', assignmentDate: '2024-01-25' },

      // Lecturer assignments
      { id: 'ASS017', type: 'lecturer_unit', lecturerId: 'LEC001', unitId: 'UNIT001', assignmentDate: '2024-01-10' },
      { id: 'ASS018', type: 'lecturer_unit', lecturerId: 'LEC001', unitId: 'UNIT002', assignmentDate: '2024-01-10' },
      { id: 'ASS019', type: 'lecturer_unit', lecturerId: 'LEC002', unitId: 'UNIT005', assignmentDate: '2024-01-10' },
      { id: 'ASS020', type: 'lecturer_unit', lecturerId: 'LEC002', unitId: 'UNIT006', assignmentDate: '2024-01-10' },
      { id: 'ASS021', type: 'lecturer_unit', lecturerId: 'LEC003', unitId: 'UNIT003', assignmentDate: '2024-01-10' },
      { id: 'ASS022', type: 'lecturer_unit', lecturerId: 'LEC003', unitId: 'UNIT004', assignmentDate: '2024-01-10' },
      { id: 'ASS023', type: 'lecturer_unit', lecturerId: 'LEC004', unitId: 'UNIT008', assignmentDate: '2024-01-10' },
      { id: 'ASS024', type: 'lecturer_unit', lecturerId: 'LEC003', unitId: 'UNIT007', assignmentDate: '2024-01-10' }
    ];

    Storage.clear('assignments');
    assignments.forEach(assignment => Storage.save('assignments', assignment));
    console.log('✓ Initialized assignments');
  },

  // Initialize attendance sessions
  initAttendanceSessions() {
    const sessions = [
      {
        id: 'SES001',
        unitId: 'UNIT002',
        lecturerId: 'LEC001',
        venue: 'Computer Lab 1',
        latitude: -1.0968,
        longitude: 34.7535,
        radius: 10,
        date: '2024-09-25',
        startTime: '09:00',
        endTime: '11:00',
        status: 'completed',
        studentsPresent: ['STU001', 'STU005', 'STU008'],
        createdDate: '2024-09-25T08:30:00'
      },
      {
        id: 'SES002',
        unitId: 'UNIT005',
        lecturerId: 'LEC002',
        venue: 'Lecture Hall A',
        latitude: -1.0970,
        longitude: 34.7540,
        radius: 15,
        date: '2024-09-26',
        startTime: '10:00',
        endTime: '12:00',
        status: 'active',
        studentsPresent: ['STU002', 'STU006'],
        createdDate: '2024-09-26T09:30:00'
      },
      {
        id: 'SES003',
        unitId: 'UNIT001',
        lecturerId: 'LEC001',
        venue: 'Design Studio',
        latitude: -1.0965,
        longitude: 34.7530,
        radius: 12,
        date: '2024-09-27',
        startTime: '14:00',
        endTime: '16:00',
        status: 'active',
        studentsPresent: ['STU001', 'STU005', 'STU010'],
        createdDate: '2024-09-26T13:00:00'
      },
      {
        id: 'SES004',
        unitId: 'UNIT006',
        lecturerId: 'LEC002',
        venue: 'Lecture Hall B',
        latitude: -1.0972,
        longitude: 34.7538,
        radius: 10,
        date: '2024-09-27',
        startTime: '11:00',
        endTime: '13:00',
        status: 'scheduled',
        studentsPresent: [],
        createdDate: '2024-09-26T10:00:00'
      },
      {
        id: 'SES005',
        unitId: 'UNIT003',
        lecturerId: 'LEC003',
        venue: 'Communication Lab',
        latitude: -1.0969,
        longitude: 34.7536,
        radius: 10,
        date: '2024-09-28',
        startTime: '09:00',
        endTime: '11:00',
        status: 'scheduled',
        studentsPresent: [],
        createdDate: '2024-09-27T14:00:00'
      }
    ];

    Storage.clear('attendanceSessions');
    sessions.forEach(session => Storage.save('attendanceSessions', session));
    console.log('✓ Initialized 5 attendance sessions');
  },

  // Initialize attendance records
  initAttendanceRecords() {
    const records = [
      {
        id: 'ATT001',
        sessionId: 'SES001',
        studentId: 'STU001',
        unitId: 'UNIT002',
        lecturerId: 'LEC001',
        date: '2024-09-25',
        time: '09:15',
        venue: 'Computer Lab 1',
        studentLatitude: -1.0968,
        studentLongitude: 34.7535,
        venueLatitude: -1.0968,
        venueLongitude: 34.7535,
        distance: 0.5,
        radius: 10,
        ipAddress: '192.168.1.105',
        deviceId: 'DEVICE-8F3A92',
        status: 'present'
      },
      {
        id: 'ATT002',
        sessionId: 'SES001',
        studentId: 'STU005',
        unitId: 'UNIT002',
        lecturerId: 'LEC001',
        date: '2024-09-25',
        time: '09:22',
        venue: 'Computer Lab 1',
        studentLatitude: -1.09680,
        studentLongitude: 34.75352,
        venueLatitude: -1.0968,
        venueLongitude: 34.7535,
        distance: 1.2,
        radius: 10,
        ipAddress: '192.168.1.109',
        deviceId: 'DEVICE-2J7E54',
        status: 'present'
      },
      {
        id: 'ATT003',
        sessionId: 'SES001',
        studentId: 'STU008',
        unitId: 'UNIT002',
        lecturerId: 'LEC001',
        date: '2024-09-25',
        time: '09:45',
        venue: 'Computer Lab 1',
        studentLatitude: -1.09682,
        studentLongitude: 34.75358,
        venueLatitude: -1.0968,
        venueLongitude: 34.7535,
        distance: 2.1,
        radius: 10,
        ipAddress: '192.168.1.112',
        deviceId: 'DEVICE-5M0H27',
        status: 'present'
      },
      {
        id: 'ATT004',
        sessionId: 'SES002',
        studentId: 'STU002',
        unitId: 'UNIT005',
        lecturerId: 'LEC002',
        date: '2024-09-26',
        time: '10:05',
        venue: 'Lecture Hall A',
        studentLatitude: -1.0970,
        studentLongitude: 34.7540,
        venueLatitude: -1.0970,
        venueLongitude: 34.7540,
        distance: 0.3,
        radius: 15,
        ipAddress: '192.168.1.106',
        deviceId: 'DEVICE-7G4B81',
        status: 'present'
      },
      {
        id: 'ATT005',
        sessionId: 'SES002',
        studentId: 'STU006',
        unitId: 'UNIT005',
        lecturerId: 'LEC002',
        date: '2024-09-26',
        time: '10:18',
        venue: 'Lecture Hall A',
        studentLatitude: -1.09702,
        studentLongitude: 34.75402,
        venueLatitude: -1.0970,
        venueLongitude: 34.7540,
        distance: 1.5,
        radius: 15,
        ipAddress: '192.168.1.110',
        deviceId: 'DEVICE-3K8F45',
        status: 'present'
      },
      {
        id: 'ATT006',
        sessionId: 'SES003',
        studentId: 'STU001',
        unitId: 'UNIT001',
        lecturerId: 'LEC001',
        date: '2024-09-27',
        time: '14:10',
        venue: 'Design Studio',
        studentLatitude: -1.0965,
        studentLongitude: 34.7530,
        venueLatitude: -1.0965,
        venueLongitude: 34.7530,
        distance: 0.8,
        radius: 12,
        ipAddress: '192.168.1.105',
        deviceId: 'DEVICE-8F3A92',
        status: 'present'
      },
      {
        id: 'ATT007',
        sessionId: 'SES003',
        studentId: 'STU005',
        unitId: 'UNIT001',
        lecturerId: 'LEC001',
        date: '2024-09-27',
        time: '14:25',
        venue: 'Design Studio',
        studentLatitude: -1.09652,
        studentLongitude: 34.75302,
        venueLatitude: -1.0965,
        venueLongitude: 34.7530,
        distance: 1.1,
        radius: 12,
        ipAddress: '192.168.1.109',
        deviceId: 'DEVICE-2J7E54',
        status: 'present'
      },
      {
        id: 'ATT008',
        sessionId: 'SES003',
        studentId: 'STU010',
        unitId: 'UNIT001',
        lecturerId: 'LEC001',
        date: '2024-09-27',
        time: '14:40',
        venue: 'Design Studio',
        studentLatitude: -1.09648,
        studentLongitude: 34.75298,
        venueLatitude: -1.0965,
        venueLongitude: 34.7530,
        distance: 2.3,
        radius: 12,
        ipAddress: '192.168.1.114',
        deviceId: 'DEVICE-7O2J09',
        status: 'present'
      }
    ];

    Storage.clear('attendanceRecords');
    records.forEach(record => Storage.save('attendanceRecords', record));
    console.log('✓ Initialized 8+ attendance records');
  }
};
