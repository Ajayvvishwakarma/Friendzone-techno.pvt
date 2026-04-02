// Switch between pages
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
    updateBreadcrumb(pageId);

    // If switching to data viewer, refresh the data
    if (pageId === 'dataViewerPage') {
        setTimeout(() => {
            refreshFrontendData();
        }, 100);
    }
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    field.type = field.type === 'password' ? 'text' : 'password';
}

// Show notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');

    // Map notification types to colors
    let bgColor = '#667eea';
    let textColor = 'white';
    let borderColor = 'rgba(102, 126, 234, 0.3)';

    if (type === 'success') {
        bgColor = '#27ae60';
    } else if (type === 'error') {
        bgColor = '#e74c3c';
    } else if (type === 'warning') {
        bgColor = '#f39c12';
        textColor = 'white';
    } else if (type === 'info') {
        bgColor = '#667eea';
    }

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: 16px 24px;
        border-radius: 10px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        font-weight: 600;
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        max-width: 90%;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3500);
}

// Add animation styles
if (!document.querySelector('style[data-notifications]')) {
    const style = document.createElement('style');
    style.setAttribute('data-notifications', 'true');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Check password strength
function checkPasswordStrength(password) {
    const bar = document.getElementById('strengthBar');
    const text = document.getElementById('strengthText');
    
    if (!bar) return;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    bar.className = 'strength-fill';
    if (strength === 1) {
        bar.classList.add('weak');
        text.textContent = 'Weak password';
    } else if (strength === 2) {
        bar.classList.add('medium');
        text.textContent = 'Medium password';
    } else if (strength >= 3) {
        bar.classList.add('strong');
        text.textContent = 'Strong password';
    }
}

// ===== FRONTEND DATA STORAGE FUNCTIONS =====

// Save registration to a list in localStorage
function saveRegistrationToList(userData) {
    let registrationsList = JSON.parse(localStorage.getItem('allRegistrations') || '[]');
    registrationsList.push(userData);
    localStorage.setItem('allRegistrations', JSON.stringify(registrationsList));
    console.log('?? All Registrations List Updated:', registrationsList);
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    switchPage('loginPage');
    document.getElementById('loginForm').reset();
    showNotification('? You have been logged out successfully', 'success');
}

// Get all registrations from frontend storage
function getAllRegistrations() {
    const registrations = JSON.parse(localStorage.getItem('allRegistrations') || '[]');
    return registrations;
}

// Get specific user from frontend storage
function getFrontendUser(email) {
    return JSON.parse(localStorage.getItem(`user_${email}`) || 'null');
}

// Display all frontend-stored users
function displayFrontendUsers() {
    const allUsers = getAllRegistrations();
    console.log('?? All Users Stored in Frontend:', allUsers);
    console.table(allUsers);
    return allUsers;
}

// Clear all frontend storage
function clearFrontendStorage() {
    localStorage.removeItem('allRegistrations');
    localStorage.clear();
    console.log('??? Frontend storage cleared!');
}

// Export frontend data as JSON
function exportFrontendData() {
    const data = {
        currentUser: JSON.parse(localStorage.getItem('user') || 'null'),
        allRegistrations: JSON.parse(localStorage.getItem('allRegistrations') || '[]'),
        exportedAt: new Date().toLocaleString()
    };
    console.log('?? Frontend Data Export:', data);
    return data;
}

// ===== DATA VIEWER PAGE FUNCTIONS =====

// Refresh and display frontend data
function refreshFrontendData() {
    const allUsers = getAllRegistrations();
    const container = document.getElementById('usersListContainer');
    const totalUsersEl = document.getElementById('totalUsers');
    const lastUpdatedEl = document.getElementById('lastUpdated');

    totalUsersEl.textContent = allUsers.length;
    lastUpdatedEl.textContent = new Date().toLocaleTimeString();

    if (allUsers.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No users registered yet</p>';
        return;
    }

    let html = '<table style="width: 100%; border-collapse: collapse;">';
    html += '<tr style="background: #f5f5f5; border-bottom: 2px solid #ddd;">';
    html += '<th style="padding: 10px; text-align: left;">ID</th>';
    html += '<th style="padding: 10px; text-align: left;">Name</th>';
    html += '<th style="padding: 10px; text-align: left;">Email</th>';
    html += '<th style="padding: 10px; text-align: left;">Registered</th>';
    html += '</tr>';

    allUsers.forEach((user, index) => {
        html += `<tr style="border-bottom: 1px solid #eee;">`;
        html += `<td style="padding: 10px;">${index + 1}</td>`;
        html += `<td style="padding: 10px;">${user.firstName} ${user.lastName}</td>`;
        html += `<td style="padding: 10px;">${user.email}</td>`;
        html += `<td style="padding: 10px;">${user.registeredAt}</td>`;
        html += `</tr>`;
    });

    html += '</table>';
    container.innerHTML = html;

    // Update JSON export
    updateJsonExport();

    // Update current user
    updateCurrentUserDisplay();

    showNotification('? Data refreshed successfully!', 'success');
}

// Update current user display
function updateCurrentUserDisplay() {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    const userDataEl = document.getElementById('currentUserData');

    if (currentUser) {
        userDataEl.textContent = JSON.stringify(currentUser, null, 2);
    } else {
        userDataEl.textContent = 'No user currently logged in';
    }
}

// Update JSON export area
function updateJsonExport() {
    const allData = {
        currentUser: JSON.parse(localStorage.getItem('user') || 'null'),
        allRegistrations: JSON.parse(localStorage.getItem('allRegistrations') || '[]'),
        exportedAt: new Date().toISOString(),
        browserInfo: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform
        }
    };

    document.getElementById('jsonExport').value = JSON.stringify(allData, null, 2);
}

// View data in browser console
function viewFrontendDataConsole() {
    console.clear();
    console.log('%c?? FRONTEND DATA STORAGE', 'font-size: 16px; font-weight: bold; color: #667eea;');
    console.log('%c========================================', 'color: #667eea;');

    const allUsers = getAllRegistrations();
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

    console.log('%c?? All Registered Users:', 'font-weight: bold; color: #764ba2;');
    console.table(allUsers);

    console.log('%c?? Current User:', 'font-weight: bold; color: #764ba2;');
    console.log(currentUser);

    console.log('%c?? Raw Storage Data:', 'font-weight: bold; color: #764ba2;');
    console.log(exportFrontendData());

    showNotification('? Data displayed in browser console (F12)', 'success');
}

// Clear all frontend data
function clearAllFrontendData() {
    if (confirm('?? Are you sure? This will delete ALL frontend-stored data!')) {
        clearFrontendStorage();
        refreshFrontendData();
        showNotification('??? All frontend data cleared!', 'success');
    }
}

// Copy JSON to clipboard
function copyJsonToClipboard() {
    const jsonArea = document.getElementById('jsonExport');
    jsonArea.select();
    document.execCommand('copy');
    showNotification('?? JSON copied to clipboard!', 'success');
}

// Download JSON file
function downloadJsonFile() {
    const allData = {
        currentUser: JSON.parse(localStorage.getItem('user') || 'null'),
        allRegistrations: JSON.parse(localStorage.getItem('allRegistrations') || '[]'),
        exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `frontend-data-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showNotification('?? JSON file downloaded!', 'success');
}

// ===== END DATA VIEWER FUNCTIONS =====



// Show section (for future use)
function showSection(section) {
    console.log('Navigating to:', section);
}

// Login form handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data));

            // Populate data BEFORE switching page for instant display
            populateDashboardData(data);
            displayUserAvatar();
            displayLastLogin();
            calculateAccountStrength();

            // Switch to dashboard page immediately
            switchPage('dashboardPage');

            showNotification('? Welcome back! You are now logged in', 'success');
        } else {
            showNotification('? Invalid email or password. Please try again', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('? Connection error. Please try again', 'error');
    }
});

// Register form handler
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('? Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('? Password must be at least 6 characters', 'error');
        return;
    }

    // ?? NEW: Store registration data in localStorage (frontend storage)
    const registrationData = {
        id: Date.now(), // Generate unique ID
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        registeredAt: new Date().toLocaleString(),
        registeredFrom: 'Frontend',
        status: 'Active'
    };

    // Save to localStorage
    localStorage.setItem(`user_${email}`, JSON.stringify(registrationData));
    console.log('? FRONTEND STORAGE: User data saved to browser localStorage', registrationData);

    // Also get all registered users
    saveRegistrationToList(registrationData);

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password })
        });

        if (response.ok) {
            showNotification('? Registration successful! Data saved to browser and server', 'success');
            console.log('? BACKEND STORAGE: Data also saved to SQL database');
            document.getElementById('registerForm').reset();
            setTimeout(() => {
                switchPage('loginPage');
                document.getElementById('loginEmail').value = email;
            }, 1500);
        } else {
            const errorData = await response.json();
            showNotification('? ' + (errorData.message || 'Registration failed. Email might already exist'), 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showNotification('? Registration error. Please try again', 'error');
    }
});

// Forgot password form handler
document.getElementById('forgotForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value.trim();
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        if (response.ok) {
            showNotification('? Check your email for password reset instructions', 'success');
            setTimeout(() => {
                switchPage('loginPage');
                document.getElementById('forgotForm').reset();
            }, 2000);
        } else {
            showNotification('? Email not found in our system', 'error');
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        showNotification('? Error processing request. Please try again', 'error');
    }
});

// Monitor password strength
document.getElementById('registerPassword')?.addEventListener('input', (e) => {
    checkPasswordStrength(e.target.value);
});

// Check if user is already logged in on page load
window.addEventListener('load', () => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            switchPage('dashboardPage');

            // Update dashboard elements after switching page
            setTimeout(() => {
                const userNameEl = document.getElementById('userName');
                const displayNameEl = document.getElementById('displayName');
                const displayEmailEl = document.getElementById('displayEmail');
                const memberSinceEl = document.getElementById('memberSince');
                const welcomeAvatar = document.getElementById('welcomeAvatar');

                if (userNameEl) userNameEl.innerText = userData.firstName;
                if (displayNameEl) displayNameEl.innerText = userData.firstName + ' ' + userData.lastName;
                if (displayEmailEl) displayEmailEl.innerText = userData.email;
                if (memberSinceEl) memberSinceEl.innerText = new Date().toLocaleDateString();
                if (welcomeAvatar) welcomeAvatar.innerText = userData.firstName.charAt(0).toUpperCase();

                displayUserAvatar();
                displayLastLogin();
                calculateAccountStrength();
            }, 0);
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('user');
        }
    }
});

// ===== POPULATE DASHBOARD DATA FUNCTION =====
function populateDashboardData(userData) {
    console.log('?? Populating dashboard with user data:', userData);

    if (!userData) return;

    // Welcome message
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.innerText = userData.firstName || 'User';
    }

    // Welcome avatar
    const welcomeAvatar = document.getElementById('welcomeAvatar');
    if (welcomeAvatar) {
        welcomeAvatar.innerText = (userData.firstName || 'U').charAt(0).toUpperCase();
    }

    // Profile info section
    const displayNameEl = document.getElementById('displayName');
    if (displayNameEl) {
        displayNameEl.innerText = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
    }

    // Email display
    const displayEmailEl = document.getElementById('displayEmail');
    if (displayEmailEl) {
        displayEmailEl.innerText = userData.email || 'Not provided';
    }

    // Member since
    const memberSinceEl = document.getElementById('memberSince');
    if (memberSinceEl) {
        memberSinceEl.innerText = userData.registeredAt || new Date().toLocaleDateString();
    }

    // Status badge
    const statusEl = document.getElementById('statusBadge');
    if (statusEl) {
        statusEl.innerText = userData.status || 'Active';
        statusEl.className = `status-badge ${(userData.status || 'Active').toLowerCase()}`;
    }

    console.log('? Dashboard data populated successfully!');
}

// ===== MODAL FUNCTIONS =====

// Edit Profile Modal
function openEditModal() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    document.getElementById('editFirstName').value = user.firstName || '';
    document.getElementById('editLastName').value = user.lastName || '';
    document.getElementById('editEmail').value = user.email || '';
    document.getElementById('editModal').classList.add('show');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
}

document.getElementById('editProfileForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('? Profile updated successfully!', 'success');
    closeEditModal();
});

// Photo Upload Modal
function openPhotoModal() {
    document.getElementById('photoModal').classList.add('show');
}

function closePhotoModal() {
    document.getElementById('photoModal').classList.remove('show');
}

document.getElementById('photoInput')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            document.getElementById('photoPreview').src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function uploadPhoto() {
    const file = document.getElementById('photoInput').files[0];
    if (file) {
        showNotification('? Photo uploaded successfully!', 'success');
        closePhotoModal();
    } else {
        showNotification('? Please select a photo first', 'error');
    }
}

// Drag and drop
const uploadArea = document.getElementById('uploadArea');
if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#e8ecf2';
        uploadArea.style.borderColor = '#764ba2';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '#f8f9fb';
        uploadArea.style.borderColor = '#667eea';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#f8f9fb';
        uploadArea.style.borderColor = '#667eea';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            document.getElementById('photoInput').files = files;
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                document.getElementById('photoPreview').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Password Change Modal
function openPasswordModal() {
    document.getElementById('passwordModal').classList.add('show');
}

function closePasswordModal() {
    document.getElementById('passwordModal').classList.remove('show');
}

document.getElementById('changePasswordForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmPassword) {
        showNotification('? Passwords do not match', 'error');
        return;
    }
    
    showNotification('? Password changed successfully!', 'success');
    closePasswordModal();
    document.getElementById('changePasswordForm').reset();
});

// Monitor new password strength
document.getElementById('newPassword')?.addEventListener('input', (e) => {
    const password = e.target.value;
    const bar = document.getElementById('newPasswordStrength');
    const text = document.getElementById('newPasswordStrengthText');
    
    if (!bar) return;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    bar.className = 'strength-fill';
    if (strength === 1) {
        bar.classList.add('weak');
        text.textContent = 'Weak';
    } else if (strength === 2) {
        bar.classList.add('medium');
        text.textContent = 'Medium';
    } else if (strength >= 3) {
        bar.classList.add('strong');
        text.textContent = 'Strong';
    }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// ===== HELP PAGE FUNCTIONS =====

// Toggle FAQ items
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// ===== LOADING SPINNER FUNCTIONS =====

function showLoadingSpinner(message = 'Loading...') {
    const spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.className = 'loading-container full-page';
    spinner.innerHTML = `
        <div class="loading-spinner"></div>
        <span>${message}</span>
    `;
    document.body.appendChild(spinner);
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => spinner.remove(), 300);
    }
}

// ===== SEARCH FUNCTIONALITY =====

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length === 0) {
            hideSearchResults();
            return;
        }
        performSearch(query);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-input-wrapper')) {
            hideSearchResults();
        }
    });
}

function performSearch(query) {
    const searchableItems = [
        { title: 'Profile Information', desc: 'View and edit your profile', page: 'dashboardPage' },
        { title: 'Security Settings', desc: 'Manage your security', page: 'dashboardPage' },
        { title: 'Account Settings', desc: 'Change email and password', page: 'settingsPage' },
        { title: 'Privacy & Security', desc: 'Configure privacy options', page: 'settingsPage' },
        { title: 'Display Settings', desc: 'Choose theme and language', page: 'settingsPage' },
        { title: 'FAQs', desc: 'Get answers to common questions', page: 'helpPage' },
        { title: 'Contact Support', desc: 'Reach out to our support team', page: 'helpPage' },
        { title: 'Getting Started', desc: 'Learn how to use the app', page: 'helpPage' }
    ];

    const results = searchableItems.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query)
    );

    displaySearchResults(results);
}

function displaySearchResults(results) {
    let resultsHtml = '';

    if (results.length === 0) {
        resultsHtml = `
            <div class="search-result-item">
                <div class="search-result-title">No results found</div>
                <div class="search-result-desc">Try searching for something else</div>
            </div>
        `;
    } else {
        resultsHtml = results.map(item => `
            <div class="search-result-item" onclick="switchPage('${item.page}'); hideSearchResults();">
                <div class="search-result-title">${item.title}</div>
                <div class="search-result-desc">${item.desc}</div>
            </div>
        `).join('');
    }

    let resultsContainer = document.querySelector('.search-results');
    if (!resultsContainer) {
        const wrapper = document.querySelector('.search-input-wrapper');
        resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        wrapper.appendChild(resultsContainer);
    }

    resultsContainer.innerHTML = resultsHtml;
    resultsContainer.classList.add('show');
}

function hideSearchResults() {
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
        resultsContainer.classList.remove('show');
    }
}

// ===== UPDATE BREADCRUMBS =====

function updateBreadcrumb(page) {
    const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
    if (!breadcrumbCurrent) return;

    const breadcrumbMap = {
        'dashboardPage': 'Home',
        'settingsPage': 'Settings',
        'helpPage': 'Help'
    };

    breadcrumbCurrent.textContent = breadcrumbMap[page] || 'Dashboard';
}

// ===== LOADING STATES FOR API CALLS =====

// Override login handler to show loading
const originalLoginForm = document.getElementById('loginForm');
if (originalLoginForm) {
    const originalListener = originalLoginForm.onsubmit;
    originalLoginForm.addEventListener('submit', async (e) => {
        showLoadingSpinner('Signing in...');
        setTimeout(() => {
            hideLoadingSpinner();
        }, 1500);
    });
}

// Initialize search when page loads
window.addEventListener('load', () => {
    initializeSearch();
    initializeDarkMode();
    startClock();
    calculateAccountStrength();
    displayLastLogin();

    // CHECK IF USER IS ALREADY LOGGED IN
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            switchPage('dashboardPage');

            setTimeout(() => {
                populateDashboardData(userData);
                displayUserAvatar();
                displayLastLogin();
                calculateAccountStrength();
            }, 100);
        } catch (error) {
            console.error('? Error loading user data:', error);
        }
    }
});

// ===== DARK MODE FUNCTIONS =====

function initializeDarkMode() {
    const toggleBtn = document.getElementById('darkModeToggle');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleDarkMode);
    }

    // Load saved preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateDarkModeButton();
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    updateDarkModeButton();

    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

function updateDarkModeButton() {
    const btn = document.querySelector('.dark-mode-toggle');
    if (!btn) return;

    if (document.body.classList.contains('dark-mode')) {
        btn.innerHTML = '<svg class="moon-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 1 1 .12-11.78 1 1 0 0 0 1.07-.27A10 10 0 1 0 21.64 13z"/></svg>';
        btn.title = 'Toggle Light Mode';
    } else {
        btn.innerHTML = '<svg class="moon-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 1 1 .12-11.78 1 1 0 0 0 1.07-.27A10 10 0 1 0 21.64 13z"/></svg>';
        btn.title = 'Toggle Dark Mode';
    }
}

// ===== REAL-TIME CLOCK FUNCTION =====

function startClock() {
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });

        const clockElements = document.querySelectorAll('.clock-display');
        clockElements.forEach(el => {
            el.textContent = `? ${timeString}`;
        });
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// ===== USER AVATAR FUNCTION =====

function getUserAvatarLetter() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.firstName) {
        return user.firstName.charAt(0).toUpperCase();
    }
    return 'U';
}

function displayUserAvatar() {
    const letter = getUserAvatarLetter();
    const avatarElements = document.querySelectorAll('[data-avatar]');
    avatarElements.forEach(el => {
        el.innerHTML = `<div class="user-avatar">${letter}</div>`;
    });
}

// ===== LAST LOGIN FUNCTION =====

function displayLastLogin() {
    const lastLoginInfo = document.querySelector('.last-login-info');
    if (!lastLoginInfo) return;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const now = new Date();

    lastLoginInfo.innerHTML = `
        <div class="last-login-item">
            <span class="last-login-label">Last Login:</span>
            <span class="last-login-value">${now.toLocaleString()}</span>
        </div>
        <div class="last-login-item">
            <span class="last-login-label">Device:</span>
            <span class="last-login-value">Web Browser</span>
        </div>
        <div class="last-login-item">
            <span class="last-login-label">IP Address:</span>
            <span class="last-login-value">192.168.1.100</span>
        </div>
    `;
}

// ===== ACCOUNT STRENGTH SCORE FUNCTION =====

function calculateAccountStrength() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const strengthEl = document.querySelector('.account-strength');
    if (!strengthEl) return;

    let score = 0;
    let totalItems = 0;
    const checks = [];

    // Profile completeness checks
    const hasFirstName = user.firstName ? true : false;
    const hasLastName = user.lastName ? true : false;
    const hasEmail = user.email ? true : false;
    const profileComplete = hasFirstName && hasLastName;

    // Security checks
    const hasStrongPassword = user.password && user.password.length >= 8;

    // Checks array
    const checkItems = [
        { name: 'Profile Name', completed: profileComplete },
        { name: 'Email Verified', completed: hasEmail },
        { name: 'Strong Password', completed: hasStrongPassword },
        { name: 'Profile Photo', completed: false },
        { name: '2FA Enabled', completed: false }
    ];

    score = checkItems.filter(item => item.completed).length;
    const percentage = Math.round((score / checkItems.length) * 100);

    let checksHtml = '';
    checkItems.forEach(item => {
        const status = item.completed ? 'completed' : 'pending';
        const symbol = item.completed ? '?' : '?';
        checksHtml += `
            <div class="strength-item">
                <div class="strength-check ${status}">${symbol}</div>
                <span>${item.name}</span>
            </div>
        `;
    });

    strengthEl.innerHTML = `
        <div class="strength-header">
            <span class="strength-title">Account Strength</span>
            <span class="strength-percentage">${percentage}%</span>
        </div>
        <div class="strength-bar-container">
            <div class="strength-bar-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="strength-items">
            ${checksHtml}
        </div>
    `;
}