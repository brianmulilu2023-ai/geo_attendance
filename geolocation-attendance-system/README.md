# GeoAttend - University Student Geolocation-Based Attendance Management System

A complete frontend-only prototype of a geolocation-based attendance management system built with vanilla HTML5, CSS3, and JavaScript. This system is designed for universities to manage student attendance using GPS location verification.

## Features

### 🎯 Core Features

- **Geolocation-Based Attendance**: Students mark attendance only when within a specified radius of the lecture venue
- **Haversine Distance Calculation**: Accurate distance calculation between student location and venue
- **Role-Based Access Control**: Three distinct user roles (Student, Lecturer, Admin)
- **Real-Time Location Verification**: Browser Geolocation API integration with fallback demo mode
- **LocalStorage Persistence**: All data persists within the browser session
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Demo Mode**: Simulate different distances without real GPS (for testing)

### 👨‍🎓 Student Features

- View assigned units and courses
- See available attendance sessions
- Mark attendance with location verification
- View attendance history and statistics
- Track overall attendance rate
- Edit profile information

### 👨‍🏫 Lecturer Features

- Create and manage attendance sessions
- Set venue location and attendance radius
- View session attendance records
- Track student attendance statistics
- Generate attendance reports
- Session lifecycle management (Scheduled → Active → Ended)

### 👨‍💼 Admin Features

- Manage students (Add, Edit, Delete, Search)
- Manage lecturers (Add, Edit, Delete, Search)
- Manage units/courses (Add, Edit, Delete, Search)
- View system-wide attendance records
- Generate system reports and statistics
- Configure system settings
- Full CRUD operations for all entities

## Project Structure

```
geolocation-attendance-system/
├── index.html                 # Redirect page → html/index.html
├── html/                      # All HTML pages
│   ├── index.html             # Landing page
│   ├── login.html             # Authentication page
│   ├── register.html          # Student registration
│   ├── student-dashboard.html # Student interface
│   ├── lecturer-dashboard.html# Lecturer interface
│   ├── admin-dashboard.html   # Admin interface
│   ├── attendance.html        # Attendance marking workflow
│   └── profile.html           # User profile page
├── css/
│   ├── style.css              # Global styles and components
│   ├── auth.css               # Authentication page styles
│   ├── dashboard.css          # Dashboard layout styles
│   ├── attendance.css         # Attendance-specific styles
│   └── responsive.css         # Responsive design rules
├── js/
│   ├── storage.js             # LocalStorage data management
│   ├── dummy-data.js          # Sample data initialization
│   ├── location.js            # Geolocation and distance calculation
│   ├── auth.js                # Authentication and authorization
│   ├── app.js                 # Core UI utilities
│   ├── attendance.js          # Attendance logic and validation
│   ├── student.js             # Student-specific functions
│   ├── lecturer.js            # Lecturer-specific functions
│   └── admin.js               # Admin management functions
├── assets/                    # Static assets (images, icons, etc.)
└── README.md                  # This file
```

### 📁 About the HTML Folder Structure

All HTML files are organized in the `html/` folder to maintain a clean project structure. The root-level `index.html` serves as a redirect entry point that automatically directs to `html/index.html`. This organization keeps all presentation files together while keeping the root directory clean.

## Getting Started

### Prerequisites

- Modern web browser with support for:
  - ES6+ JavaScript
  - HTML5 Geolocation API
  - LocalStorage API
  - CSS Grid & Flexbox

### Installation

1. Download or clone the project files
2. Open `index.html` (from the root directory) in a web browser
   - The root `index.html` will automatically redirect to `html/index.html`
   - Alternatively, you can directly open `html/index.html` in your browser
3. The system will automatically initialize with demo data

### Demo Credentials

Three demo accounts are pre-configured:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Student | student@demo.com | 123456 | Student Dashboard |
| Lecturer | lecturer@demo.com | 123456 | Lecturer Dashboard |
| Admin | admin@demo.com | admin123 | Admin Dashboard |

## Demo Data

The system comes with pre-loaded sample data:

### Students
- 10 sample students with registration numbers, courses, and year of study
- Distributed across Computer Science, General Studies, and Commerce programs

### Lecturers
- 4 sample lecturers from different departments
- Assigned to various courses

### Units/Courses
- 8 sample units across different departments:
  - GCA (General Studies): GCA301, GCA302, GCA303, GCA304
  - CSC (Computer Science): CSC301, CSC302, CSC303
  - COM (Commerce): COM305

### Attendance Sessions
- 5 sample sessions across different venues
- Located at coordinates: -1.0968, 34.7535 (Nairobi, Kenya)
- Default attendance radius: 10 meters

### Attendance Records
- 8+ sample attendance records with varying distances and statuses
- Demonstrates both "present" and "absent" statuses

## Usage Guide

### For Students

1. **Login**: Use student@demo.com / 123456
2. **Dashboard**: View your units, attendance statistics, and today's classes
3. **Mark Attendance**:
   - Go to "Mark Attendance" tab
   - Select an available session
   - Allow browser location access
   - System verifies your distance from venue
   - If within radius, click "MARK ATTENDANCE"
4. **View History**: Check your attendance records in "Attendance History" tab

#### Demo Mode (Testing Without GPS)

If you don't have GPS enabled or want to test different scenarios:
1. In the attendance marking screen, you'll see demo mode controls
2. Click "📍 5m Away (Inside)" to simulate being within the attendance area
3. Click "📍 10m Away (Edge)" to simulate being at the edge
4. Click "📍 25m Away (Outside)" to simulate being outside the area

### For Lecturers

1. **Login**: Use lecturer@demo.com / 123456
2. **Dashboard**: View assigned units and active sessions
3. **Create Session** - Three location selection methods:
   - **📡 Use GPS**: Get coordinates from device location (most accurate)
   - **🏫 Campus Buildings**: Quick-select pre-configured venues (CSC Building, Lab, Auditorium, Library, Sports Complex, Science Lab)
   - **📌 Manual Entry**: Paste coordinates from Google Maps (right-click location → coordinates)
4. **Location Preview**: Real-time map visualization shows exactly where you're marking
5. **Set Attendance Radius**: Use quick buttons (5m, 10m, 20m) or manual input
6. **Manage Sessions**:
   - Start sessions when ready
   - View attendance for each session
   - End sessions when complete
7. **Reports**: View attendance statistics and trends

> **Quick Tip**: For campus locations, use the "Campus Buildings" quick-select - creates a session in under 30 seconds! See [LOCATION_SELECTION_GUIDE.md](LOCATION_SELECTION_GUIDE.md) for detailed instructions.

### For Administrators

1. **Login**: Use admin@demo.com / admin123
2. **Dashboard**: View system-wide statistics
3. **Students**: Manage student records (Add, Edit, Delete, Search)
4. **Lecturers**: Manage lecturer records
5. **Units**: Create and manage courses/units
6. **Attendance**: View all attendance records, generate reports
7. **Settings**: Configure system parameters and security settings

## Technical Architecture

### JavaScript Modules

#### `storage.js` (Data Layer)
- Centralized LocalStorage management
- CRUD operations for all entities
- Search and filtering capabilities
- Collections: students, lecturers, units, assignments, attendanceSessions, attendanceRecords

#### `dummy-data.js` (Sample Data)
- Initializes demo data on first load
- Realistic sample records
- Pre-configured relationships (students to units, lecturers to units)

#### `location.js` (Geolocation)
- Wrapper around Browser Geolocation API
- Haversine formula implementation for distance calculation
- Demo mode for testing without GPS
- Position watching capabilities
- Error handling and timeout management

```javascript
// Haversine Formula
const R = 6371000; // Earth radius in meters
const dLat = (lat2 - lat1) * Math.PI / 180;
const dLon = (lon2 - lon1) * Math.PI / 180;
const a = Math.sin(dLat/2) ** 2 + 
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) ** 2;
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
const distance = R * c;
```

#### `auth.js` (Authentication)
- User login and registration
- Session management
- Role-based access control
- Device ID generation
- Simulated IP address generation

#### `app.js` (UI Core)
- Toast notifications
- Modal dialogs
- Form validation
- Date/time formatting
- Attendance percentage calculations
- Status badge generation

#### `attendance.js` (Attendance Logic)
- Attendance validation and marking
- Duplicate prevention
- Distance verification
- Record management
- Statistics calculation

#### `student.js`, `lecturer.js`, `admin.js` (Role Modules)
- Role-specific business logic
- Dashboard data aggregation
- CRUD operations for assigned responsibilities
- Report generation

### CSS Architecture

#### CSS Variables (Color System)
```css
--primary: #0F3D56      /* Navy Blue */
--secondary: #2563EB    /* Bright Blue */
--accent: #F59E0B       /* Amber */
--success: #16A34A      /* Green */
--danger: #DC2626       /* Red */
--warning: #EAB308      /* Yellow */
--info: #0369A1         /* Cyan */
```

#### Layout System
- **Sidebar**: 280px fixed width (collapsible on mobile)
- **Main Content**: Flexible grid layout
- **Responsive Breakpoints**: 480px, 640px, 1024px, 1280px
- **Grid System**: CSS Grid with `repeat(auto-fit, minmax(...))`

#### Components
- Cards with hover effects
- Badges (6 color variants)
- Buttons (primary, secondary, success, danger, warning, info, outline)
- Badges with role-based status indicators
- Tables with striped rows
- Form elements with focus states
- Modals with overlay
- Toast notifications
- Spinners for loading states

### Data Model

```
Students
├── id
├── name
├── registrationNumber
├── email
├── phoneNumber
├── course
├── yearOfStudy
├── status
├── deviceId
├── ipAddress
└── password (hashed in demo)

Lecturers
├── id
├── name
├── email
├── department
├── phoneNumber
├── status
├── deviceId
└── ipAddress

Units
├── id
├── code
├── name
├── department
├── creditHours
└── status

AttendanceSessions
├── id
├── unitId
├── lecturerId
├── date
├── startTime
├── endTime
├── venue
├── latitude
├── longitude
├── radius
└── status (scheduled, active, ended)

AttendanceRecords
├── id
├── sessionId
├── studentId
├── unitId
├── lecturerId
├── date
├── time
├── studentLat
├── studentLon
├── sessionVenue
├── venueLat
├── venueLon
├── distance
├── radius
├── ipAddress
├── deviceId
└── status (present, absent, late)
```

## Geolocation Accuracy

### Distance Calculation Method

The system uses the **Haversine formula** to calculate the great-circle distance between two points on Earth:

- **Accuracy**: ±5m typical (browser dependent)
- **Formula**: d = R × c where c = 2 × atan2(√a, √(1−a))
- **Earth Radius Used**: 6,371,000 meters

### Demo Mode

For testing without GPS hardware:
- Simulates different distances from venue
- Useful for testing attendance logic
- Can be toggled on/off at any time
- Displays "Demo Mode (Simulated)" indicator

## Security Considerations

### ⚠️ Important: Frontend-Only Prototype

This is a **demonstration system** built entirely on the client-side. The following security measures are **NOT present** in this prototype:

1. **Server-Side Validation**: All attendance logic runs in the browser
2. **Database Persistence**: Data is stored in LocalStorage (not persistent)
3. **User Authentication**: No cryptographic verification
4. **IP Address Verification**: Simulated, not verified
5. **Device Binding**: Demo purposes only
6. **Geolocation Spoofing**: Client can manipulate location data

### Production Requirements

For a production deployment, the following are **essential**:

- **Backend Server**: Implement all business logic server-side
- **Database**: Persistent data storage with proper backups
- **SSL/TLS**: Encrypted communications over HTTPS
- **Server-Side Geolocation Validation**: Verify coordinates against known venues
- **Authentication**: OAuth 2.0 or similar secure authentication
- **Device Verification**: Cryptographic binding with hardware identifiers
- **Audit Logging**: Comprehensive logging of all attendance events
- **Rate Limiting**: Prevent brute-force and replay attacks
- **Authorization Checks**: Role-based access control at API level
- **Data Encryption**: Database-level encryption for sensitive data

### What This Prototype Demonstrates

✓ User interface design and workflow  
✓ Geolocation functionality and distance calculation  
✓ Role-based access control (UI-level)  
✓ Data model and relationships  
✓ Responsive design for all devices  
✓ Attendance verification logic  
✓ Dashboard analytics and reporting  

### What Production Implementation Requires

→ Move all validation to secure backend  
→ Replace LocalStorage with persistent database  
→ Implement proper user authentication  
→ Add server-side location verification  
→ Implement device registration and binding  
→ Add comprehensive audit trails  
→ Deploy behind load balancer with HTTPS  
→ Regular security audits and penetration testing  

## Browser Compatibility

- **Chrome/Chromium**: Full support (v90+)
- **Firefox**: Full support (v88+)
- **Safari**: Full support (v14+)
- **Edge**: Full support (v90+)
- **Mobile Chrome**: Full support with GPS
- **Mobile Safari**: Full support with GPS

## Limitations

1. **Data Persistence**: Data is cleared when browser is closed or cache is cleared
2. **Security**: All logic is client-side (no server validation)
3. **Scalability**: LocalStorage has ~5-10MB limit
4. **Real-Time Updates**: No real-time synchronization between users
5. **Offline Access**: Limited to cached data only
6. **GPS Accuracy**: Depends on device and location services
7. **Multiple Devices**: Each device has separate data store

## Customization

### Changing Colors

Edit `css/style.css` and modify CSS variables:
```css
:root {
  --primary: #YOUR_COLOR;
  --secondary: #YOUR_COLOR;
  --accent: #YOUR_COLOR;
  /* ... etc ... */
}
```

### Adjusting Attendance Radius

Edit `js/lecturer.js` in the `createSession()` function:
```javascript
const defaultRadius = 10; // Change to your desired default (meters)
```

### Modifying Demo Data

Edit `js/dummy-data.js` and modify the sample data initialization:
```javascript
const students = [
  { id: 'STU001', name: 'Your Student', /* ... */ }
  // Add or modify records
];
```

### Changing Venue Coordinates

When creating a session, enter custom coordinates:
- Latitude: -1.0968 to 1.0968
- Longitude: 24.7535 to 34.7535
- Use "Use My Current Location" button for GPS coordinates

## API Reference

### Storage Module

```javascript
Storage.save(collection, data)              // Add/update record
Storage.getAll(collection)                  // Get all records
Storage.getById(collection, id)             // Get by ID
Storage.getByProperty(collection, key, val) // Get by property
Storage.update(collection, id, data)        // Update record
Storage.delete(collection, id)              // Delete record
Storage.search(collection, query)           // Search records
```

### Location Module

```javascript
Location.getCurrentLocation()               // Get current position
Location.calculateDistance(lat1, lon1, ...)  // Haversine calculation
Location.isWithinAttendanceRadius(...)      // Check if within radius
Location.enableDemoMode(distance)           // Enable demo simulation
Location.disableDemoMode()                  // Disable demo mode
Location.watchPosition(callback)            // Watch position changes
```

### Auth Module

```javascript
Auth.login(email, password, role)           // Authenticate user
Auth.register(studentData)                  // Register new student
Auth.logout()                               // Clear session
Auth.getCurrentUser()                       // Get current user
Auth.isLoggedIn()                           // Check if authenticated
Auth.checkRole(requiredRole)                // Verify user role
```

### Attendance Module

```javascript
Attendance.markAttendance(studentId, sessionId)     // Validate & mark
Attendance.recordAttendance(studentId, sessionId, ...) // Store record
Attendance.isAttendanceMarked(studentId, sessionId) // Check if marked
Attendance.deleteAttendance(recordId)               // Delete record
```

## Performance Optimization

- **CSS**: Minimized with essential features only
- **JavaScript**: Modular architecture prevents unused code loading
- **LocalStorage**: Efficient JSON serialization/deserialization
- **DOM**: Minimal manipulation with direct innerHTML
- **Geolocation**: Position watching uses throttling

## Known Issues

1. GPS accuracy varies by device and environment
2. LocalStorage limits data to ~5-10MB total
3. No real-time collaboration between concurrent users
4. Mobile browsers may require location permission
5. Some older browsers lack Geolocation API support

## Future Enhancement Ideas

- [ ] Backend API integration
- [ ] Real-time WebSocket updates
- [ ] QR code check-in alternative
- [ ] Biometric verification integration
- [ ] Advanced reporting and analytics
- [ ] Email/SMS notifications
- [ ] Parent/Guardian portal
- [ ] Mobile app (React Native/Flutter)
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Two-factor authentication
- [ ] Attendance appeals workflow

## License

This project is provided as-is for educational demonstration purposes.

## Support

For questions or issues:
1. Check the [Technical Architecture](#technical-architecture) section
2. Review the [Security Considerations](#security-considerations) section
3. Examine the JavaScript modules for inline documentation
4. Test with demo credentials and sample data

## Credits

**GeoAttend** - A geolocation-based attendance management system prototype built with vanilla technologies (HTML5, CSS3, JavaScript ES6+).

---

**⚠️ IMPORTANT**: This is a frontend prototype demonstrating system design and workflows. DO NOT deploy in production without proper backend implementation, security hardening, and database persistence. See [Production Requirements](#production-requirements) for details.
