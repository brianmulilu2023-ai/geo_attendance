/**
 * Authentication Module
 * Handles user login, registration, and session management
 * DEMO ONLY - Production requires secure backend authentication
 */

const Auth = {
  /**
   * Login user with email and password
   * Returns user object if successful, null if failed
   */
  login(email, password) {
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    email = email.toLowerCase().trim();

    // Check students
    let user = Storage.getByProperty('students', 'email', email).find(
      s => s.password === password
    );

    if (user) {
      const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'student',
        registrationNumber: user.registrationNumber,
        loginTime: new Date().toISOString(),
        ipAddress: this.generateDemoIP(), // DEMO ONLY
        deviceId: user.deviceId
      };
      Storage.setCurrentUser(userSession);
      return { success: true, user: userSession };
    }

    // Check lecturers
    user = Storage.getByProperty('lecturers', 'email', email).find(
      l => l.password === password
    );

    if (user) {
      const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'lecturer',
        department: user.department,
        loginTime: new Date().toISOString(),
        ipAddress: this.generateDemoIP()
      };
      Storage.setCurrentUser(userSession);
      return { success: true, user: userSession };
    }

    // Check admin
    // Demo admin: admin@demo.com / admin123
    if (email === 'admin@demo.com' && password === 'admin123') {
      const userSession = {
        id: 'ADMIN001',
        name: 'System Administrator',
        email: 'admin@demo.com',
        role: 'admin',
        loginTime: new Date().toISOString(),
        ipAddress: this.generateDemoIP()
      };
      Storage.setCurrentUser(userSession);
      return { success: true, user: userSession };
    }

    return { success: false, message: 'Invalid email or password' };
  },

  /**
   * Register new student
   */
  register(userData) {
    // Validate required fields
    const required = ['fullName', 'registrationNumber', 'email', 'phoneNumber', 
                      'password', 'confirmPassword', 'course', 'yearOfStudy'];
    
    for (let field of required) {
      if (!userData[field] || userData[field].trim() === '') {
        return { 
          success: false, 
          message: `${field.replace(/([A-Z])/g, ' $1')} is required` 
        };
      }
    }

    // Validate email format
    if (!this.isValidEmail(userData.email)) {
      return { success: false, message: 'Invalid email format' };
    }

    // Check if email already exists
    const emailExists = Storage.getAll('students').some(s => s.email === userData.email.toLowerCase());
    if (emailExists) {
      return { success: false, message: 'Email already registered' };
    }

    // Check if registration number already exists
    const regExists = Storage.getAll('students').some(s => s.registrationNumber === userData.registrationNumber);
    if (regExists) {
      return { success: false, message: 'Registration number already exists' };
    }

    // Validate password
    if (userData.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    if (userData.password !== userData.confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    // Validate phone number (at least 10 digits)
    if (!/\d{10,}/.test(userData.phoneNumber.replace(/\D/g, ''))) {
      return { success: false, message: 'Invalid phone number' };
    }

    // Create student record
    const student = {
      id: this.generateStudentId(),
      name: userData.fullName,
      registrationNumber: userData.registrationNumber,
      email: userData.email.toLowerCase(),
      password: userData.password, // DEMO ONLY - NEVER do this in production
      phoneNumber: userData.phoneNumber,
      course: userData.course,
      yearOfStudy: parseInt(userData.yearOfStudy),
      registrationDate: new Date().toISOString().split('T')[0],
      ipAddress: this.generateDemoIP(), // DEMO ONLY
      deviceId: this.generateDeviceId(),
      status: 'active'
    };

    Storage.save('students', student);

    return { 
      success: true, 
      message: 'Registration successful! Please login.',
      student: student 
    };
  },

  /**
   * Logout current user
   */
  logout() {
    Storage.clearCurrentUser();
    return true;
  },

  /**
   * Get current logged-in user
   */
  getCurrentUser() {
    return Storage.getCurrentUser();
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return Storage.getCurrentUser() !== null;
  },

  /**
   * Check if current user has specific role
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Generate student ID
   */
  generateStudentId() {
    const prefix = 'STU';
    const students = Storage.getAll('students');
    const maxId = students.reduce((max, s) => {
      const num = parseInt(s.id.replace(prefix, ''));
      return num > max ? num : max;
    }, 0);
    return `${prefix}${String(maxId + 1).padStart(3, '0')}`;
  },

  /**
   * Generate device ID (DEMO ONLY)
   * In production, this would require secure device fingerprinting on backend
   */
  generateDeviceId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'DEVICE-';
    for (let i = 0; i < 6; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  },

  /**
   * Generate demo IP address
   * DEMO ONLY - Browser JavaScript cannot reliably get public IP
   * Production requires server-side IP verification
   */
  generateDemoIP() {
    return `192.168.1.${Math.floor(Math.random() * 155) + 100}`;
  },

  /**
   * Verify device (DEMO ONLY)
   * In production, this verification must happen on backend
   */
  verifyDevice(student) {
    if (!student || !student.deviceId) return false;
    
    // Check if logged-in user's device ID matches student's device ID
    const currentUser = this.getCurrentUser();
    return currentUser && currentUser.deviceId === student.deviceId;
  },

  /**
   * Get user's unit assignments
   */
  getUserUnits() {
    const user = this.getCurrentUser();
    if (!user) return [];

    if (user.role === 'student') {
      const assignments = Storage.getByProperty('assignments', 'studentId', user.id)
        .filter(a => a.type === 'student_unit');
      
      return assignments.map(a => {
        const unit = Storage.getById('units', a.unitId);
        return { ...unit, assignmentId: a.id };
      });
    }

    if (user.role === 'lecturer') {
      const assignments = Storage.getByProperty('assignments', 'lecturerId', user.id)
        .filter(a => a.type === 'lecturer_unit');
      
      return assignments.map(a => {
        const unit = Storage.getById('units', a.unitId);
        return { ...unit, assignmentId: a.id };
      });
    }

    return [];
  }
};

// IMPORTANT SECURITY NOTES:
// ================================
// FRONTEND AUTHENTICATION LIMITATIONS
// ================================
//
// This code demonstrates a complete frontend authentication workflow.
// However, there are CRITICAL security limitations:
//
// 1. Plain Text Passwords: Stored in LocalStorage (INSECURE)
// 2. No Encryption: Credentials transmitted in clear
// 3. Frontend Bypass: Browser dev tools can modify any data
// 4. No Session Security: Session tokens not secure
// 5. No Rate Limiting: Brute force attacks possible
// 6. Device ID Spoofing: Easy to fake in browser
// 7. IP Spoofing: Browser cannot reliably determine IP
//
// PRODUCTION REQUIREMENTS:
//
// - Use secure backend authentication (OAuth, JWT, etc.)
// - Hash passwords with bcrypt/Argon2 (server-side)
// - Use HTTPS/TLS for all connections
// - Implement session tokens with expiration
// - Rate limit login attempts
// - Use secure cookies (HttpOnly, Secure flags)
// - Implement multi-factor authentication
// - Log all authentication attempts
// - Use secure password reset mechanism
// - Never expose user IDs or roles to frontend
//
// This frontend can collect credentials, but authentication
// and authorization MUST be verified on a secure backend.
