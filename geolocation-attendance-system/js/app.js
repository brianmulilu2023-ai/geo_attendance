/**
 * Core Application Module
 * Handles common UI functionality, modals, notifications, and utilities
 */

const App = {
  /**
   * Show notification toast
   * type: 'success', 'error', 'warning', 'info'
   */
  notify(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notification-container') || this.createNotificationContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    container.appendChild(toast);
    
    if (duration) {
      setTimeout(() => toast.remove(), duration);
    }
    
    return toast;
  },

  /**
   * Create notification container if it doesn't exist
   */
  createNotificationContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
    return container;
  },

  /**
   * Show modal dialog
   */
  showModal(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    let buttonHTML = '';
    buttons.forEach(btn => {
      buttonHTML += `
        <button class="btn btn-${btn.type || 'secondary'}" onclick="${btn.action}">
          ${btn.label}
        </button>
      `;
    });
    
    modal.innerHTML = `
      <div class="modal-overlay" onclick="this.closest('.modal').remove()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>${title}</h2>
          <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        <div class="modal-footer">
          ${buttonHTML}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
  },

  /**
   * Show confirmation dialog
   */
  showConfirmation(message, onConfirm, onCancel) {
    const content = `<p>${message}</p>`;
    const buttons = [
      { label: 'Cancel', type: 'secondary', action: 'this.closest(".modal").remove()' },
      { label: 'Delete', type: 'danger', action: onConfirm }
    ];
    
    return this.showModal('Confirm Action', content, buttons);
  },

  /**
   * Format date for display
   */
  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  },

  /**
   * Format time for display
   */
  formatTime(timeString) {
    if (!timeString) return '-';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  },

  /**
   * Format datetime for display
   */
  formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Get attendance status badge HTML
   */
  getStatusBadge(status) {
    const badges = {
      'present': '<span class="badge badge-success">Present</span>',
      'absent': '<span class="badge badge-danger">Absent</span>',
      'late': '<span class="badge badge-warning">Late</span>',
      'active': '<span class="badge badge-success">Active</span>',
      'completed': '<span class="badge badge-secondary">Completed</span>',
      'scheduled': '<span class="badge badge-info">Scheduled</span>',
      'cancelled': '<span class="badge badge-danger">Cancelled</span>'
    };
    return badges[status] || `<span class="badge badge-secondary">${status}</span>`;
  },

  /**
   * Validate email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate form fields
   */
  validateForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return { valid: false, errors: [] };

    const errors = [];
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      if (!field.value || field.value.trim() === '') {
        errors.push(`${field.name || field.id} is required`);
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }

      // Validate email fields
      if (field.type === 'email' && field.value && !this.isValidEmail(field.value)) {
        errors.push(`${field.name || field.id} must be a valid email`);
        field.classList.add('error');
      }
    });

    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Get form data as object
   */
  getFormData(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return {};

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    return data;
  },

  /**
   * Format percentage
   */
  formatPercentage(value, decimals = 1) {
    return `${parseFloat(value).toFixed(decimals)}%`;
  },

  /**
   * Get attendance percentage
   */
  calculateAttendancePercentage(studentId) {
    const records = Storage.getByProperty('attendanceRecords', 'studentId', studentId);
    if (records.length === 0) return 0;

    const present = records.filter(r => r.status === 'present').length;
    return (present / records.length) * 100;
  },

  /**
   * Check role-based access
   */
  checkAccess(requiredRole) {
    const user = Auth.getCurrentUser();
    
    if (!user) {
      window.location.href = 'login.html';
      return false;
    }

    if (user.role !== requiredRole) {
      // Redirect to user's appropriate dashboard
      const dashboards = {
        'student': 'student-dashboard.html',
        'lecturer': 'lecturer-dashboard.html',
        'admin': 'admin-dashboard.html'
      };
      window.location.href = dashboards[user.role] || 'login.html';
      return false;
    }

    return true;
  },

  /**
   * Redirect to login if not authenticated
   */
  requireAuth() {
    if (!Auth.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  /**
   * Handle logout
   */
  logout() {
    Auth.logout();
    window.location.href = 'index.html';
  },

  /**
   * Enable demo location mode
   */
  setDemoLocationMode(distance) {
    Location.enableDemoMode(distance);
    this.notify(`📍 Demo Mode: Simulating ${distance}m distance`, 'info');
  },

  /**
   * Disable demo location mode
   */
  disableDemoLocationMode() {
    Location.disableDemoMode();
    this.notify('📍 Real GPS Mode Enabled', 'info');
  },

  /**
   * Get color for status
   */
  getStatusColor(status) {
    const colors = {
      'present': '#16A34A',
      'absent': '#DC2626',
      'late': '#F59E0B',
      'active': '#16A34A',
      'completed': '#6B7280',
      'scheduled': '#3B82F6',
      'cancelled': '#DC2626'
    };
    return colors[status] || '#6B7280';
  },

  /**
   * Scroll to element smoothly
   */
  scrollTo(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  /**
   * Debounce function for search/filter
   */
  debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * Show loading state
   */
  showLoading(element, show = true) {
    if (show) {
      element.classList.add('loading');
      element.disabled = true;
    } else {
      element.classList.remove('loading');
      element.disabled = false;
    }
  },

  /**
   * Clone element HTML
   */
  cloneElement(selector) {
    const element = document.querySelector(selector);
    if (!element) return null;
    return element.cloneNode(true);
  },

  /**
   * Empty container while preserving it
   */
  emptyContainer(selector) {
    const container = document.querySelector(selector);
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  }
};

// Initialize notification container on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.createNotificationContainer();
  });
} else {
  App.createNotificationContainer();
}
