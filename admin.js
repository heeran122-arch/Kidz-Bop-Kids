/* ============================================
   KIDZ BOP KIDS - ADMIN JAVASCRIPT
   Admin Dashboard & Login Management
   ============================================ */

// ============================================
// ADMIN CREDENTIALS & CONFIGURATION
// ============================================

const ADMIN_CREDENTIALS = {
    Kafura: {
        password: 'KBK_Admin_2026!',
        role: 'President'
    },
    Heeran: {
        password: 'KBK_Admin_2026!',
        role: 'Vice President'
    }
};

let currentAdmin = null;

// ============================================
// ADMIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

function initializeAdminPanel() {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleAdminLogout);
    }

    checkExistingSession();
}

// ============================================
// LOGIN HANDLER
// ============================================

function handleAdminLogin(event) {
    event.preventDefault();

    const nameInput = document.getElementById('adminName');
    const passwordInput = document.getElementById('adminPassword');
    const errorDiv = document.getElementById('loginError');

    const name = nameInput.value.trim();
    const password = passwordInput.value;

    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    if (!name || !password) {
        showLoginError('Please enter both name and password.');
        return;
    }

    if (!ADMIN_CREDENTIALS[name]) {
        showLoginError('Name not recognized. Please check and try again.');
        nameInput.focus();
        return;
    }

    if (ADMIN_CREDENTIALS[name].password !== password) {
        showLoginError('Incorrect password. Please try again.');
        passwordInput.value = '';
        passwordInput.focus();
        return;
    }

    // Login successful
    currentAdmin = {
        name: name,
        role: ADMIN_CREDENTIALS[name].role
    };

    // Save session in sessionStorage (not localStorage - more secure, cleared when browser closes)
    sessionStorage.setItem('adminSession', JSON.stringify(currentAdmin));

    showAdminDashboard();
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// ============================================
// SESSION MANAGEMENT
// ============================================

function checkExistingSession() {
    const session = sessionStorage.getItem('adminSession');

    if (session) {
        try {
            currentAdmin = JSON.parse(session);
            showAdminDashboard();
        } catch (e) {
            sessionStorage.removeItem('adminSession');
        }
    }
}

function showAdminDashboard() {
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');

    if (loginScreen) loginScreen.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'block';

    updateAdminWelcome();
    initializeAdminFunctions();
    renderAllAdminData();
}

function updateAdminWelcome() {
    const welcomeEl = document.getElementById('adminWelcome');
    if (welcomeEl && currentAdmin) {
        welcomeEl.textContent = `Welcome, ${currentAdmin.name} (${currentAdmin.role})`;
    }
}

function handleAdminLogout() {
    sessionStorage.removeItem('adminSession');
    currentAdmin = null;

    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');

    if (loginScreen) loginScreen.style.display = 'flex';
    if (adminDashboard) adminDashboard.style.display = 'none';

    // Clear forms
    const nameInput = document.getElementById('adminName');
    const passwordInput = document.getElementById('adminPassword');
    if (nameInput) nameInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (nameInput) nameInput.focus();
}

// ============================================
// ADMIN FUNCTIONS INITIALIZATION
// ============================================

function initializeAdminFunctions() {
    // Announcement buttons
    const createAnnouncementBtn = document.getElementById('createAnnouncementBtn');
    const announcementCancelBtn = document.getElementById('announcementCancelBtn');
    const announcementFormElement = document.getElementById('announcementFormElement');

    if (createAnnouncementBtn) {
        createAnnouncementBtn.addEventListener('click', showCreateAnnouncementForm);
    }
    if (announcementCancelBtn) {
        announcementCancelBtn.addEventListener('click', hideAnnouncementForm);
    }
    if (announcementFormElement) {
        announcementFormElement.addEventListener('submit', handleAnnouncementSubmit);
    }

    // Meeting buttons
    const createMeetingBtn = document.getElementById('createMeetingBtn');
    const meetingCancelBtn = document.getElementById('meetingCancelBtn');
    const meetingFormElement = document.getElementById('meetingFormElement');

    if (createMeetingBtn) {
        createMeetingBtn.addEventListener('click', showCreateMeetingForm);
    }
    if (meetingCancelBtn) {
        meetingCancelBtn.addEventListener('click', hideMeetingForm);
    }
    if (meetingFormElement) {
        meetingFormElement.addEventListener('submit', handleMeetingSubmit);
    }
}

// ============================================
// UPDATE STATS
// ============================================

function renderAllAdminData() {
    updateStats();
    renderAdminAnnouncements();
    renderAdminMeetings();
    renderAdminSuggestions();
}

function updateStats() {
    const totalAnnouncementsEl = document.getElementById('totalAnnouncements');
    const totalMeetingsEl = document.getElementById('totalMeetings');
    const totalSuggestionsEl = document.getElementById('totalSuggestions');

    if (totalAnnouncementsEl) {
        totalAnnouncementsEl.textContent = announcements.length;
    }

    if (totalMeetingsEl) {
        totalMeetingsEl.textContent = meetings.length;
    }

    const suggestions = localStorage.getItem('kidz-bop-suggestions');
    const suggestionCount = suggestions ? JSON.parse(suggestions).length : 0;
    if (totalSuggestionsEl) {
        totalSuggestionsEl.textContent = suggestionCount;
    }
}

// ============================================
// ANNOUNCEMENTS MANAGEMENT
// ============================================

function showCreateAnnouncementForm() {
    clearAnnouncementForm();
    const formTitle = document.getElementById('announcementFormTitle');
    if (formTitle) formTitle.textContent = 'Create Announcement';
    const form = document.getElementById('announcementForm');
    if (form) form.style.display = 'block';
    document.getElementById('announcementTitle').focus();
}

function hideAnnouncementForm() {
    const form = document.getElementById('announcementForm');
    if (form) form.style.display = 'none';
    clearAnnouncementForm();
}

function clearAnnouncementForm() {
    document.getElementById('announcementTitle').value = '';
    document.getElementById('announcementContent').value = '';
    document.getElementById('announcementDate').value = '';
    document.getElementById('announcementPriority').value = 'normal';
    document.getElementById('announcementFormElement').dataset.editId = '';
}

function handleAnnouncementSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('announcementTitle').value.trim();
    const content = document.getElementById('announcementContent').value.trim();
    const date = document.getElementById('announcementDate').value;
    const priority = document.getElementById('announcementPriority').value;
    const editId = document.getElementById('announcementFormElement').dataset.editId;

    if (!title || !content || !date) {
        alert('Please fill in all required fields.');
        return;
    }

    const announcementData = {
        title,
        content,
        date,
        priority
    };

    showConfirmationDialog(
        'announcement',
        editId ? 'edit' : 'create',
        announcementData,
        editId
    );
}

function editAnnouncement(id) {
    const announcement = announcements.find(a => a.id == id);
    if (!announcement) return;

    document.getElementById('announcementTitle').value = announcement.title;
    document.getElementById('announcementContent').value = announcement.content;
    document.getElementById('announcementDate').value = announcement.date;
    document.getElementById('announcementPriority').value = announcement.priority;
    document.getElementById('announcementFormElement').dataset.editId = id;

    const formTitle = document.getElementById('announcementFormTitle');
    if (formTitle) formTitle.textContent = 'Edit Announcement';

    const form = document.getElementById('announcementForm');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteAnnouncement(id) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        const index = announcements.findIndex(a => a.id == id);
        if (index > -1) {
            announcements.splice(index, 1);
            renderAdminAnnouncements();
            updateStats();
        }
    }
}

function renderAdminAnnouncements() {
    const list = document.getElementById('announcementsList');
    if (!list) return;

    list.innerHTML = '';

    if (announcements.length === 0) {
        list.innerHTML = '<div class="empty-list-message">No announcements yet. Create one to get started!</div>';
        return;
    }

    announcements.forEach(announcement => {
        const item = document.createElement('div');
        item.className = 'admin-item';

        const formattedDate = formatDate(announcement.date);
        const priorityBadge = announcement.priority === 'high' ? '🔴 ' : '';

        item.innerHTML = `
            <div class="admin-item-header">
                <div>
                    <h3 class="admin-item-title">${priorityBadge}${escapeHtml(announcement.title)}</h3>
                    <p class="admin-item-meta">
                        <time datetime="${announcement.date}">${formattedDate}</time> • Priority: ${announcement.priority}
                    </p>
                </div>
            </div>
            <div class="admin-item-content">
                ${escapeHtml(announcement.content)}
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-edit" onclick="editAnnouncement(${announcement.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteAnnouncement(${announcement.id})">Delete</button>
            </div>
        `;

        list.appendChild(item);
    });
}

// ============================================
// MEETINGS MANAGEMENT
// ============================================

function showCreateMeetingForm() {
    clearMeetingForm();
    const formTitle = document.getElementById('meetingFormTitle');
    if (formTitle) formTitle.textContent = 'Create Meeting';
    const form = document.getElementById('meetingForm');
    if (form) form.style.display = 'block';
    document.getElementById('meetingTitle').focus();
}

function hideMeetingForm() {
    const form = document.getElementById('meetingForm');
    if (form) form.style.display = 'none';
    clearMeetingForm();
}

function clearMeetingForm() {
    document.getElementById('meetingTitle').value = '';
    document.getElementById('meetingDate').value = '';
    document.getElementById('meetingTime').value = '';
    document.getElementById('meetingLocation').value = '';
    document.getElementById('meetingDetails').value = '';
    document.getElementById('meetingFormElement').dataset.editId = '';
}

function handleMeetingSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('meetingTitle').value.trim();
    const date = document.getElementById('meetingDate').value;
    const time = document.getElementById('meetingTime').value;
    const location = document.getElementById('meetingLocation').value.trim();
    const details = document.getElementById('meetingDetails').value.trim();
    const editId = document.getElementById('meetingFormElement').dataset.editId;

    if (!title || !date || !time) {
        alert('Please fill in all required fields.');
        return;
    }

    const meetingData = {
        title,
        date,
        time,
        location,
        details
    };

    showConfirmationDialog(
        'meeting',
        editId ? 'edit' : 'create',
        meetingData,
        editId
    );
}

function editMeeting(id) {
    const meeting = meetings.find(m => m.id == id);
    if (!meeting) return;

    document.getElementById('meetingTitle').value = meeting.title;
    document.getElementById('meetingDate').value = meeting.date;
    document.getElementById('meetingTime').value = meeting.time;
    document.getElementById('meetingLocation').value = meeting.location || '';
    document.getElementById('meetingDetails').value = meeting.details || '';
    document.getElementById('meetingFormElement').dataset.editId = id;

    const formTitle = document.getElementById('meetingFormTitle');
    if (formTitle) formTitle.textContent = 'Edit Meeting';

    const form = document.getElementById('meetingForm');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteMeeting(id) {
    if (confirm('Are you sure you want to delete this meeting?')) {
        const index = meetings.findIndex(m => m.id == id);
        if (index > -1) {
            meetings.splice(index, 1);
            renderAdminMeetings();
            updateStats();
        }
    }
}

function renderAdminMeetings() {
    const list = document.getElementById('meetingsList');
    if (!list) return;

    list.innerHTML = '';

    if (meetings.length === 0) {
        list.innerHTML = '<div class="empty-list-message">No meetings scheduled yet. Create one to get started!</div>';
        return;
    }

    meetings.forEach(meeting => {
        const item = document.createElement('div');
        item.className = 'admin-item';

        const formattedDate = formatDate(meeting.date);

        item.innerHTML = `
            <div class="admin-item-header">
                <div>
                    <h3 class="admin-item-title">📅 ${escapeHtml(meeting.title)}</h3>
                    <p class="admin-item-meta">
                        <time datetime="${meeting.date}">${formattedDate}</time> • ${escapeHtml(meeting.time)}
                        ${meeting.location ? ' • ' + escapeHtml(meeting.location) : ''}
                    </p>
                </div>
            </div>
            ${meeting.details ? '<div class="admin-item-content">' + escapeHtml(meeting.details) + '</div>' : ''}
            <div class="admin-item-actions">
                <button class="btn btn-edit" onclick="editMeeting(${meeting.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteMeeting(${meeting.id})">Delete</button>
            </div>
        `;

        list.appendChild(item);
    });
}

// ============================================
// SUGGESTIONS DISPLAY
// ============================================

function renderAdminSuggestions() {
    const list = document.getElementById('suggestionsList');
    if (!list) return;

    list.innerHTML = '';

    let suggestions = [];
    const stored = localStorage.getItem('kidz-bop-suggestions');

    if (stored) {
        suggestions = JSON.parse(stored);
    }

    if (suggestions.length === 0) {
        list.innerHTML = '<div class="empty-list-message">No suggestions yet. When users submit suggestions, they will appear here.</div>';
        return;
    }

    suggestions.forEach((suggestion) => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';

        const date = new Date(suggestion.timestamp);
        const formattedTime = formatDateTime(date);

        item.innerHTML = `
            <p class="suggestion-text">"${escapeHtml(suggestion.text)}"</p>
            <div class="suggestion-time">${formattedTime}</div>
        `;

        list.appendChild(item);
    });
}

// ============================================
// CONFIRMATION DIALOG
// ============================================

function showConfirmationDialog(type, action, data, editId = null) {
    const existingDialog = document.getElementById('confirmationDialog');
    if (existingDialog) {
        existingDialog.remove();
    }

    const dialog = document.createElement('div');
    dialog.id = 'confirmationDialog';
    dialog.className = 'confirmation-dialog-overlay';

    let preview = '';

    if (type === 'announcement') {
        preview = `
            <div class="confirmation-preview">
                <h4>${action === 'edit' ? 'Edit' : 'Create'} Announcement</h4>
                <div class="preview-item">
                    <strong>${escapeHtml(data.title)}</strong>
                    <p>${escapeHtml(data.content)}</p>
                    <small>Date: ${data.date} • Priority: ${data.priority}</small>
                </div>
            </div>
        `;
    } else if (type === 'meeting') {
        preview = `
            <div class="confirmation-preview">
                <h4>${action === 'edit' ? 'Edit' : 'Create'} Meeting</h4>
                <div class="preview-item">
                    <strong>📅 ${escapeHtml(data.title)}</strong>
                    <p>Date: ${data.date} • Time: ${data.time}</p>
                    ${data.location ? '<p>Location: ' + escapeHtml(data.location) + '</p>' : ''}
                    ${data.details ? '<p>' + escapeHtml(data.details) + '</p>' : ''}
                </div>
            </div>
        `;
    }

    dialog.innerHTML = `
        <div class="confirmation-dialog">
            <div class="confirmation-header">
                <h3>Confirm ${action === 'edit' ? 'Edit' : 'Create'}</h3>
                <button class="confirmation-close" onclick="closeConfirmation()">✕</button>
            </div>
            ${preview}
            <div class="confirmation-actions">
                <button class="btn btn-primary" onclick="confirmAction('${type}', '${action}', '${editId}')">Confirm</button>
                <button class="btn btn-secondary" onclick="closeConfirmation()">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    // Store data for confirmation
    window.pendingAction = {
        type,
        action,
        data,
        editId
    };
}

function closeConfirmation() {
    const dialog = document.getElementById('confirmationDialog');
    if (dialog) {
        dialog.remove();
    }
    window.pendingAction = null;
}

function confirmAction(type, action, editId) {
    if (!window.pendingAction) return;

    const data = window.pendingAction.data;

    if (type === 'announcement') {
        if (action === 'create') {
            const newAnnouncement = {
                id: Math.max(0, ...announcements.map(a => a.id)) + 1,
                title: data.title,
                content: data.content,
                date: data.date,
                priority: data.priority
            };
            announcements.unshift(newAnnouncement);
        } else if (action === 'edit' && editId) {
            const announcement = announcements.find(a => a.id == editId);
            if (announcement) {
                announcement.title = data.title;
                announcement.content = data.content;
                announcement.date = data.date;
                announcement.priority = data.priority;
            }
        }
        hideAnnouncementForm();
        renderAdminAnnouncements();
    } else if (type === 'meeting') {
        if (action === 'create') {
            const newMeeting = {
                id: Math.max(0, ...meetings.map(m => m.id)) + 1,
                title: data.title,
                date: data.date,
                time: data.time,
                location: data.location,
                details: data.details
            };
            meetings.unshift(newMeeting);
        } else if (action === 'edit' && editId) {
            const meeting = meetings.find(m => m.id == editId);
            if (meeting) {
                meeting.title = data.title;
                meeting.date = data.date;
                meeting.time = data.time;
                meeting.location = data.location;
                meeting.details = data.details;
            }
        }
        hideMeetingForm();
        renderAdminMeetings();
    }

    updateStats();
    closeConfirmation();
}

// ============================================
// UTILITY FUNCTIONS (Already defined in script.js, but kept for reference)
// ============================================

// These are already in script.js but we include backup versions here
if (typeof formatDate === 'undefined') {
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    }
}

if (typeof formatDateTime === 'undefined') {
    function formatDateTime(date) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const dateToCheck = new Date(date);

        if (dateToCheck.toDateString() === today.toDateString()) {
            const timeOptions = { hour: '2-digit', minute: '2-digit' };
            return 'Today at ' + date.toLocaleTimeString('en-US', timeOptions);
        }

        if (dateToCheck.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }

        const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };

        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

        return `${formattedDate} at ${formattedTime}`;
    }
}

if (typeof escapeHtml === 'undefined') {
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}
