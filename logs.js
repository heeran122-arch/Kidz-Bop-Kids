/* ============================================
   KIDZ BOP KIDS - ADMIN LOGGING SYSTEM
   Tracks all admin actions and login history
   ============================================ */

// ============================================
// LOG STORAGE MANAGEMENT
// ============================================

const LOG_STORAGE_KEY = 'kidz-bop-admin-logs';
const LOGIN_HISTORY_KEY = 'kidz-bop-login-history';
const MAX_LOGS = 500;
const MAX_LOGIN_HISTORY = 100;

// ============================================
// LOGGING FUNCTIONS
// ============================================

function logAdminAction(action, details = {}) {
    if (!currentAdmin) return;

    const timestamp = new Date();
    const logEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: timestamp.toISOString(),
        admin: currentAdmin.name,
        role: currentAdmin.role,
        action: action,
        details: details,
        formattedTime: formatDateTime(timestamp)
    };

    // Get existing logs
    let logs = [];
    const stored = localStorage.getItem(LOG_STORAGE_KEY);
    if (stored) {
        try {
            logs = JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing logs:', e);
            logs = [];
        }
    }

    // Add new log
    logs.unshift(logEntry);

    // Keep only the last MAX_LOGS entries
    logs = logs.slice(0, MAX_LOGS);

    // Save back to localStorage
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));

    return logEntry;
}

function logLoginAttempt(name, success, message = '') {
    const timestamp = new Date();
    const loginEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: timestamp.toISOString(),
        name: name,
        success: success,
        message: message,
        formattedTime: formatDateTime(timestamp)
    };

    // Get existing login history
    let loginHistory = [];
    const stored = localStorage.getItem(LOGIN_HISTORY_KEY);
    if (stored) {
        try {
            loginHistory = JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing login history:', e);
            loginHistory = [];
        }
    }

    // Add new login entry
    loginHistory.unshift(loginEntry);

    // Keep only the last MAX_LOGIN_HISTORY entries
    loginHistory = loginHistory.slice(0, MAX_LOGIN_HISTORY);

    // Save back to localStorage
    localStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(loginHistory));

    return loginEntry;
}

function getAllLogs() {
    const stored = localStorage.getItem(LOG_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing logs:', e);
            return [];
        }
    }
    return [];
}

function getLoginHistory() {
    const stored = localStorage.getItem(LOGIN_HISTORY_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing login history:', e);
            return [];
        }
    }
    return [];
}

function clearAllLogs() {
    if (confirm('Are you sure you want to clear all activity logs? This cannot be undone.')) {
        localStorage.removeItem(LOG_STORAGE_KEY);
        renderActivityLog();
        addMessageToChat('assistant', '🗑️ All activity logs have been cleared.');
    }
}

function clearLoginHistory() {
    if (confirm('Are you sure you want to clear all login history? This cannot be undone.')) {
        localStorage.removeItem(LOGIN_HISTORY_KEY);
        renderLoginHistory();
        addMessageToChat('assistant', '🗑️ All login history has been cleared.');
    }
}

function downloadLogs() {
    const logs = getAllLogs();
    const loginHistory = getLoginHistory();
    const exportData = {
        exportDate: new Date().toISOString(),
        activityLogs: logs,
        loginHistory: loginHistory,
        totalLogs: logs.length,
        totalLoginAttempts: loginHistory.length
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kidz-bop-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    addMessageToChat('assistant', '📥 Logs downloaded successfully!');
}

// ============================================
// RENDER ACTIVITY LOG
// ============================================

function renderActivityLog() {
    const logContainer = document.getElementById('activityLogContainer');
    if (!logContainer) return;

    const logs = getAllLogs();
    logContainer.innerHTML = '';

    if (logs.length === 0) {
        logContainer.innerHTML = '<div class="empty-log-message">No activity logged yet.</div>';
        return;
    }

    logs.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.setAttribute('data-log-id', log.id);

        const actionEmoji = getActionEmoji(log.action);
        const detailsText = Object.keys(log.details).length > 0 
            ? `<div class="log-details">${JSON.stringify(log.details).substring(0, 100)}...</div>`
            : '';

        logItem.innerHTML = `
            <div class="log-header">
                <span class="log-emoji">${actionEmoji}</span>
                <span class="log-action">${escapeHtml(log.action)}</span>
                <span class="log-admin">${escapeHtml(log.admin)} (${log.role})</span>
            </div>
            <div class="log-time">${log.formattedTime}</div>
            ${detailsText}
        `;

        logContainer.appendChild(logItem);
    });

    // Update log count
    const logCount = document.getElementById('logCount');
    if (logCount) {
        logCount.textContent = logs.length;
    }
}

// ============================================
// RENDER LOGIN HISTORY
// ============================================

function renderLoginHistory() {
    const historyContainer = document.getElementById('loginHistoryContainer');
    if (!historyContainer) return;

    const loginHistory = getLoginHistory();
    historyContainer.innerHTML = '';

    if (loginHistory.length === 0) {
        historyContainer.innerHTML = '<div class="empty-log-message">No login history yet.</div>';
        return;
    }

    loginHistory.forEach(entry => {
        const historyItem = document.createElement('div');
        historyItem.className = `login-history-item ${entry.success ? 'success' : 'failed'}`;
        historyItem.setAttribute('data-entry-id', entry.id);

        const statusIcon = entry.success ? '✅' : '❌';
        const statusText = entry.success ? 'Successful Login' : 'Failed Login Attempt';

        historyItem.innerHTML = `
            <div class="history-header">
                <span class="status-icon">${statusIcon}</span>
                <span class="status-text">${statusText}</span>
                <span class="login-name">${escapeHtml(entry.name)}</span>
            </div>
            <div class="history-time">${entry.formattedTime}</div>
            ${entry.message ? `<div class="history-message">${escapeHtml(entry.message)}</div>` : ''}
        `;

        historyContainer.appendChild(historyItem);
    });

    // Update login count
    const loginCount = document.getElementById('loginCount');
    if (loginCount) {
        loginCount.textContent = loginHistory.length;
    }
}

// ============================================
// ACTION EMOJI MAPPING
// ============================================

function getActionEmoji(action) {
    const emojiMap = {
        'announcement_created': '📢',
        'announcement_edited': '✏️',
        'announcement_deleted': '🗑️',
        'meeting_created': '📅',
        'meeting_edited': '✏️',
        'meeting_deleted': '🗑️',
        'suggestions_viewed': '👀',
        'logs_viewed': '📊',
        'login_history_viewed': '🔍',
        'logs_cleared': '🧹',
        'login_history_cleared': '🧹',
        'logs_downloaded': '📥',
        'dashboard_accessed': '📊'
    };
    return emojiMap[action] || '📝';
}

// ============================================
// UPDATE LOGGING IN ADMIN.JS FUNCTIONS
// ============================================

// Override the original functions to include logging

const originalConfirmAction = window.confirmAction;

window.confirmAction = function(type, action, editId) {
    if (!window.pendingAction) return;

    const data = window.pendingAction.data;
    let actionDescription = '';

    if (type === 'announcement') {
        if (action === 'create') {
            logAdminAction('announcement_created', {
                title: data.title,
                date: data.date,
                priority: data.priority
            });
            actionDescription = 'Announcement Created';
        } else if (action === 'edit') {
            logAdminAction('announcement_edited', {
                announcementId: editId,
                title: data.title,
                date: data.date
            });
            actionDescription = 'Announcement Edited';
        }
    } else if (type === 'meeting') {
        if (action === 'create') {
            logAdminAction('meeting_created', {
                title: data.title,
                date: data.date,
                time: data.time,
                location: data.location
            });
            actionDescription = 'Meeting Created';
        } else if (action === 'edit') {
            logAdminAction('meeting_edited', {
                meetingId: editId,
                title: data.title,
                date: data.date,
                time: data.time
            });
            actionDescription = 'Meeting Edited';
        }
    }

    // Call the original function
    if (originalConfirmAction) {
        originalConfirmAction(type, action, editId);
    }

    // Refresh logs if visible
    renderActivityLog();
};

// ============================================
// LOG VIEWER INITIALIZATION
// ============================================

function initializeLogViewer() {
    const logsSection = document.getElementById('logsSection');
    if (!logsSection) return;

    renderActivityLog();
    renderLoginHistory();
}

// ============================================
// EXPORT FOR USE IN OTHER SCRIPTS
// ============================================

window.logAdminAction = logAdminAction;
window.logLoginAttempt = logLoginAttempt;
window.getAllLogs = getAllLogs;
window.getLoginHistory = getLoginHistory;
window.clearAllLogs = clearAllLogs;
window.clearLoginHistory = clearLoginHistory;
window.downloadLogs = downloadLogs;
window.renderActivityLog = renderActivityLog;
window.renderLoginHistory = renderLoginHistory;
window.initializeLogViewer = initializeLogViewer;
