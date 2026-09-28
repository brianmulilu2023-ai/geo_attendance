# 📁 Project Structure & File Organization Guide

## Overview

The GeoAttend project has been reorganized to maintain a clean and professional directory structure. All HTML files are now organized in a dedicated `html/` folder, keeping the root directory focused on configuration and documentation.

---

## Directory Structure

```
geolocation-attendance-system/
│
├── 📄 index.html                          ← Entry point (redirect)
├── 📄 README.md                           ← Main documentation
├── 📄 IMPLEMENTATION_SUMMARY.md           ← Technical implementation details
├── 📄 LOCATION_ENHANCEMENT_COMPLETE.md    ← Location feature documentation
├── 📄 LOCATION_SELECTION_GUIDE.md         ← User guide for location selection
├── 📄 QUICK_REFERENCE.md                  ← Quick reference card
│
├── 📁 html/                               ← All HTML pages
│   ├── 📄 index.html                      ← Landing/home page
│   ├── 📄 login.html                      ← Login page
│   ├── 📄 register.html                   ← Registration page
│   ├── 📄 student-dashboard.html          ← Student dashboard
│   ├── 📄 lecturer-dashboard.html         ← Lecturer dashboard
│   ├── 📄 admin-dashboard.html            ← Admin dashboard
│   ├── 📄 attendance.html                 ← Attendance marking page
│   └── 📄 profile.html                    ← User profile page
│
├── 📁 css/                                ← Stylesheets
│   ├── 📄 style.css                       ← Global styles
│   ├── 📄 auth.css                        ← Auth pages styling
│   ├── 📄 dashboard.css                   ← Dashboard layouts
│   ├── 📄 attendance.css                  ← Attendance styling
│   └── 📄 responsive.css                  ← Mobile responsive rules
│
├── 📁 js/                                 ← JavaScript modules
│   ├── 📄 storage.js                      ← LocalStorage management
│   ├── 📄 dummy-data.js                   ← Demo data initialization
│   ├── 📄 location.js                     ← Geolocation & distance calculation
│   ├── 📄 auth.js                         ← Authentication & authorization
│   ├── 📄 app.js                          ← Core utilities & UI helpers
│   ├── 📄 attendance.js                   ← Attendance logic
│   ├── 📄 student.js                      ← Student dashboard functions
│   ├── 📄 lecturer.js                     ← Lecturer dashboard functions
│   └── 📄 admin.js                        ← Admin management functions
│
└── 📁 assets/                             ← Static assets (images, etc.)
    └── (Images, icons, and other media)
```

---

## Why This Structure?

### ✅ Benefits of the HTML Folder Organization

1. **Clean Root Directory**
   - Root contains only essential files: entry point, documentation, and folder pointers
   - Easier to navigate the project
   - Professional appearance

2. **Logical Grouping**
   - All presentation files (HTML) are in one folder
   - Easy to find and manage HTML pages
   - Clear separation of concerns

3. **Maintainability**
   - Future developers know exactly where to look for HTML files
   - Reduces confusion about file locations
   - Follows industry best practices

4. **Scalability**
   - Can easily add more HTML files without cluttering root
   - Room for future expansions
   - Better for team collaboration

---

## Entry Points

### Primary Entry Point
- **File**: `index.html` (in root)
- **Purpose**: Redirect to the actual landing page
- **Behavior**: Auto-redirects to `html/index.html`
- **Why**: Provides a familiar entry point while maintaining clean structure

### Direct Access
- **File**: `html/index.html`
- **Purpose**: The actual landing/home page
- **Behavior**: Contains all navigation and demo credentials

### How It Works

```
User opens: http://localhost/index.html (or simply opens the file)
         ↓
Root index.html detects this and redirects
         ↓
Automatically opens: http://localhost/html/index.html
         ↓
Landing page loads with full interface
```

---

## File Naming Conventions

### HTML Files
- `index.html` - Landing/home page
- `*-dashboard.html` - Dashboard pages (student, lecturer, admin)
- `login.html`, `register.html` - Auth pages
- `attendance.html` - Attendance-specific page
- `profile.html` - User profile page

### CSS Files
- `style.css` - Global/shared styles
- `[purpose].css` - Purpose-specific styles (auth, dashboard, attendance, responsive)

### JavaScript Files
- `storage.js` - Data persistence
- `dummy-data.js` - Demo data
- `location.js` - Location features
- `[role].js` - Role-specific functions (student, lecturer, admin)
- `app.js` - Shared utilities
- `auth.js` - Authentication
- `attendance.js` - Attendance logic

---

## Path References

### From HTML Files (in `html/` folder)
```
CSS files:     href="../css/style.css"
JS files:      src="../js/storage.js"
Other HTML:    href="login.html"        (same folder)
Assets:        src="../assets/image.png"
```

### From Root `index.html`
```
CSS files:     href="css/style.css"     (direct)
JS files:      src="js/storage.js"      (direct)
HTML files:    href="html/index.html"   (in html folder)
```

---

## Navigation Flow

### From Landing Page (`html/index.html`)
```
Landing Page
    ├─→ Login Button → html/login.html
    ├─→ Register Button → html/register.html
    └─→ Demo Links → html/login.html

Authentication (login.html)
    ├─→ Student Login → html/student-dashboard.html
    ├─→ Lecturer Login → html/lecturer-dashboard.html
    ├─→ Admin Login → html/admin-dashboard.html
    └─→ Register Link → html/register.html

Dashboards
    ├─→ Mark Attendance → html/attendance.html
    ├─→ View Profile → html/profile.html
    └─→ Logout → html/login.html

Attendance Page
    ├─→ Submit Attendance → html/[dashboard].html
    └─→ Back to Dashboard → html/student-dashboard.html
```

---

## How to Add New Pages

### Step 1: Create HTML File
1. Create new file in `html/` folder: `html/newpage.html`
2. Copy boilerplate from existing page (e.g., `html/login.html`)

### Step 2: Update Paths
In the new file, ensure all paths are correct:
```html
<!-- CSS paths (relative to html/ folder) -->
<link rel="stylesheet" href="../css/style.css">

<!-- JS paths (relative to html/ folder) -->
<script src="../js/app.js"></script>

<!-- Link to other HTML files -->
<a href="login.html">Login</a>
```

### Step 3: Add Navigation
1. Update sidebar/nav in other files to link to new page
2. Update JavaScript to handle new page navigation
3. Test all links work correctly

### Step 4: Document
Add reference to new page in:
- This README
- `FILE_STRUCTURE.md`
- Any relevant guide documents

---

## Deployment Considerations

### Web Server Setup
```
Server Root: /path/to/geolocation-attendance-system/
    ├── index.html (accessible at http://localhost/)
    ├── html/ (pages accessible at http://localhost/html/...)
    ├── css/ (styles accessible at http://localhost/css/...)
    └── js/ (scripts accessible at http://localhost/js/...)
```

### Development Mode
1. Open `index.html` in browser (will auto-redirect)
2. Or directly open `html/index.html`
3. All paths work correctly in both cases

### Production Deployment
1. Deploy entire folder to web server
2. Ensure web server can serve static files
3. All paths will work correctly with proper URL structure

---

## Troubleshooting

### Issue: Pages show as blank or CSS not loading
**Solution**: Ensure you're opening from the root directory or using a web server. File paths depend on correct directory structure.

### Issue: Links not working between pages
**Solution**: Verify all `href` attributes in HTML files use correct relative paths.

### Issue: Images/assets not loading
**Solution**: Ensure `../assets/` paths are correct in all files, and assets folder exists with required files.

### Issue: JavaScript modules not loading
**Solution**: Check that all `<script src="">` tags have correct paths with `../js/` prefix.

---

## Summary

| Aspect | Detail |
|--------|--------|
| **Root Entry** | `index.html` - Redirect page |
| **HTML Pages** | `html/` folder - All 8 pages |
| **CSS Files** | `css/` folder - 5 stylesheets |
| **JS Files** | `js/` folder - 9 modules |
| **Assets** | `assets/` folder - Images, media |
| **Docs** | Root level - README, guides |

This structure provides a professional, organized, and maintainable project layout.

---

**Created**: September 28, 2026  
**Version**: 1.0  
**Status**: ✅ Active
