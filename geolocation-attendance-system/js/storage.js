/**
 * Storage Module
 * Handles LocalStorage operations for data persistence
 * This is a frontend demo only - production requires a real database
 */

const Storage = {
  // Initialize localStorage with dummy data if empty
  init() {
    if (!localStorage.getItem('initialized')) {
      this.clearAll();
      DummyData.initialize();
      localStorage.setItem('initialized', 'true');
      console.log('✓ LocalStorage initialized with dummy data');
    }
  },

  // Save data to a collection
  save(collection, data) {
    try {
      const existing = this.getAll(collection) || [];
      
      // If data has an ID, update if exists, otherwise add
      if (data.id) {
        const index = existing.findIndex(item => item.id === data.id);
        if (index >= 0) {
          existing[index] = { ...existing[index], ...data };
        } else {
          existing.push(data);
        }
      } else {
        // Generate ID if not provided
        data.id = this.generateId();
        existing.push(data);
      }
      
      localStorage.setItem(collection, JSON.stringify(existing));
      return data;
    } catch (error) {
      console.error(`Error saving to ${collection}:`, error);
      return null;
    }
  },

  // Get all items from a collection
  getAll(collection) {
    try {
      const data = localStorage.getItem(collection);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error getting ${collection}:`, error);
      return [];
    }
  },

  // Get single item by ID
  getById(collection, id) {
    const items = this.getAll(collection);
    return items.find(item => item.id === id);
  },

  // Get items by property
  getByProperty(collection, property, value) {
    const items = this.getAll(collection);
    return items.filter(item => item[property] === value);
  },

  // Update an item
  update(collection, id, updates) {
    try {
      const items = this.getAll(collection);
      const index = items.findIndex(item => item.id === id);
      
      if (index >= 0) {
        items[index] = { ...items[index], ...updates };
        localStorage.setItem(collection, JSON.stringify(items));
        return items[index];
      }
      return null;
    } catch (error) {
      console.error(`Error updating ${collection}:`, error);
      return null;
    }
  },

  // Delete an item
  delete(collection, id) {
    try {
      let items = this.getAll(collection);
      items = items.filter(item => item.id !== id);
      localStorage.setItem(collection, JSON.stringify(items));
      return true;
    } catch (error) {
      console.error(`Error deleting from ${collection}:`, error);
      return false;
    }
  },

  // Clear entire collection
  clear(collection) {
    try {
      localStorage.removeItem(collection);
      return true;
    } catch (error) {
      console.error(`Error clearing ${collection}:`, error);
      return false;
    }
  },

  // Clear all data
  clearAll() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing all storage:', error);
      return false;
    }
  },

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Get current user
  getCurrentUser() {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Set current user
  setCurrentUser(user) {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error setting current user:', error);
      return false;
    }
  },

  // Clear current user
  clearCurrentUser() {
    try {
      localStorage.removeItem('currentUser');
      return true;
    } catch (error) {
      console.error('Error clearing current user:', error);
      return false;
    }
  },

  // Search items by multiple fields
  search(collection, query, fields = []) {
    const items = this.getAll(collection);
    if (!query || fields.length === 0) return items;

    const lowerQuery = query.toLowerCase();
    return items.filter(item => {
      return fields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(lowerQuery);
      });
    });
  },

  // Get all collections info (for debugging)
  getInfo() {
    const collections = [
      'students',
      'lecturers',
      'units',
      'assignments',
      'attendanceSessions',
      'attendanceRecords',
      'currentUser'
    ];

    const info = {};
    collections.forEach(collection => {
      const data = this.getAll(collection);
      info[collection] = data.length;
    });

    return info;
  }
};

// Initialize storage on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Storage.init());
} else {
  Storage.init();
}
