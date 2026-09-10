/* ============================================
   KIDZ BOP KIDS - SMART ASSISTANT
   Template-Based Natural Language Assistant
   ============================================ */

// ============================================
// ASSISTANT INITIALIZATION
// ============================================

let assistantActive = true;
let chatHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeAssistant();
});

function initializeAssistant() {
    const assistantInput = document.getElementById('assistantInput');
    const assistantForm = document.getElementById('assistantForm');
    const assistantToggleBtn = document.getElementById('assistantToggleBtn');
    const assistantCloseBtn = document.getElementById('assistantCloseBtn');

    if (assistantForm) {
        assistantForm.addEventListener('submit', handleAssistantSubmit);
    }

    if (assistantToggleBtn) {
        assistantToggleBtn.addEventListener('click', toggleAssistantPanel);
    }

    if (assistantCloseBtn) {
        assistantCloseBtn.addEventListener('click', toggleAssistantPanel);
    }

    if (assistantInput) {
        assistantInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAssistantSubmit(new Event('submit'));
            }
        });
    }
}

// ============================================
// ASSISTANT MESSAGE HANDLING
// ============================================

function handleAssistantSubmit(event) {
    event.preventDefault();

    const input = document.getElementById('assistantInput');
    const message = input.value.trim();

    if (!message) return;

    addMessageToChat('user', message);
    input.value = '';
    input.focus();

    // Process the message
    setTimeout(() => {
        processAssistantMessage(message);
    }, 300);
}

function sendAssistantMessage(message) {
    const input = document.getElementById('assistantInput');
    input.value = message;
    handleAssistantSubmit(new Event('submit'));
}

function addMessageToChat(sender, text) {
    const chatContainer = document.getElementById('assistantChat');
    if (!chatContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `assistant-message ${sender}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;

    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);

    // Hide welcome message
    const welcome = chatContainer.querySelector('.assistant-welcome');
    if (welcome) {
        welcome.style.display = 'none';
    }

    // Hide suggestions on first message
    const suggestions = document.getElementById('assistantSuggestions');
    if (suggestions && chatHistory.length > 0) {
        suggestions.style.display = 'none';
    }

    // Scroll to bottom
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);

    chatHistory.push({ sender, text });
}

function clearAssistantChat() {
    const chatContainer = document.getElementById('assistantChat');
    const suggestions = document.getElementById('assistantSuggestions');
    
    if (chatContainer) {
        chatContainer.innerHTML = `
            <div class="assistant-welcome">
                <p><strong>Hello! 👋</strong></p>
                <p>I'm your Admin Assistant. I can help you manage announcements, meetings, and more.</p>
                <p style="font-size: 0.9rem; color: var(--text-muted);">Try natural language requests!</p>
            </div>
        `;
    }

    if (suggestions) {
        suggestions.style.display = 'block';
    }

    chatHistory = [];
}

// ============================================
// ASSISTANT MESSAGE PROCESSING
// ============================================

function processAssistantMessage(message) {
    const lowerMessage = message.toLowerCase();

    // Detect intent
    if (isCreateAnnouncementIntent(lowerMessage)) {
        handleCreateAnnouncementIntent(message);
    } else if (isEditAnnouncementIntent(lowerMessage)) {
        handleEditAnnouncementIntent(message);
    } else if (isDeleteAnnouncementIntent(lowerMessage)) {
        handleDeleteAnnouncementIntent(message);
    } else if (isCreateMeetingIntent(lowerMessage)) {
        handleCreateMeetingIntent(message);
    } else if (isEditMeetingIntent(lowerMessage)) {
        handleEditMeetingIntent(message);
    } else if (isDeleteMeetingIntent(lowerMessage)) {
        handleDeleteMeetingIntent(message);
    } else if (isViewSuggestionsIntent(lowerMessage)) {
        handleViewSuggestionsIntent();
    } else if (isHelpWriteIntent(lowerMessage)) {
        handleHelpWriteIntent();
    } else {
        addMessageToChat('assistant', '🤔 I\'m not sure what you\'d like to do. Try: "Create an announcement", "Make a meeting", "Show me suggestions", or "Help me write".');
    }
}

// ============================================
// INTENT DETECTION
// ============================================

function isCreateAnnouncementIntent(message) {
    const keywords = ['create', 'make', 'add', 'new', 'announcement', 'post', 'announce'];
    return keywords.some(word => message.includes(word)) && message.includes('announcement');
}

function isEditAnnouncementIntent(message) {
    const keywords = ['edit', 'change', 'update', 'modify'];
    return keywords.some(word => message.includes(word)) && message.includes('announcement');
}

function isDeleteAnnouncementIntent(message) {
    const keywords = ['delete', 'remove', 'remove', 'old'];
    return keywords.some(word => message.includes(word)) && message.includes('announcement');
}

function isCreateMeetingIntent(message) {
    const keywords = ['create', 'make', 'add', 'new', 'schedule', 'plan'];
    const meetingKeywords = ['meeting', 'event', 'gathering', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return (keywords.some(word => message.includes(word)) || meetingKeywords.some(word => message.includes(word))) &&
           (message.includes('meeting') || message.includes('event') || /\d{1,2}:\d{2}|am|pm/.test(message));
}

function isEditMeetingIntent(message) {
    const keywords = ['edit', 'change', 'update', 'modify', 'reschedule'];
    return keywords.some(word => message.includes(word)) && (message.includes('meeting') || message.includes('event'));
}

function isDeleteMeetingIntent(message) {
    const keywords = ['delete', 'remove', 'cancel'];
    return keywords.some(word => message.includes(word)) && (message.includes('meeting') || message.includes('event'));
}

function isViewSuggestionsIntent(message) {
    return (message.includes('show') || message.includes('view') || message.includes('see')) && message.includes('suggestion');
}

function isHelpWriteIntent(message) {
    return (message.includes('help') || message.includes('write') || message.includes('draft')) && 
           (message.includes('announcement') || message.includes('meeting') || message.includes('write'));
}

// ============================================
// INTENT HANDLERS
// ============================================

function handleCreateAnnouncementIntent(message) {
    addMessageToChat('assistant', 'I can help you create an announcement! Let me open the form.');
    
    setTimeout(() => {
        const createBtn = document.getElementById('createAnnouncementBtn');
        if (createBtn) {
            createBtn.click();
            addMessageToChat('assistant', 'The announcement form is now open. Fill in the title, description, date, and priority level. I\'ll help you review it before publishing!');
        }
    }, 500);
}

function handleEditAnnouncementIntent(message) {
    if (announcements.length === 0) {
        addMessageToChat('assistant', 'There are no announcements to edit yet. Would you like to create one instead?');
        return;
    }

    addMessageToChat('assistant', `I found ${announcements.length} announcement(s). Which one would you like to edit? (Click the "Edit" button next to an announcement, or tell me the title.)`);
}

function handleDeleteAnnouncementIntent(message) {
    if (announcements.length === 0) {
        addMessageToChat('assistant', 'There are no announcements to delete.');
        return;
    }

    addMessageToChat('assistant', `I found ${announcements.length} announcement(s). Which one would you like to delete? (Click the "Delete" button next to it.)`);
}

function handleCreateMeetingIntent(message) {
    addMessageToChat('assistant', 'I can help you schedule a meeting! Let me open the meeting form.');
    
    setTimeout(() => {
        const createBtn = document.getElementById('createMeetingBtn');
        if (createBtn) {
            createBtn.click();
            
            // Try to extract date/time from message
            const timeMatch = message.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
            const dayMatch = message.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
            
            let tips = 'Fill in the meeting title, date, time, and location.';
            if (timeMatch || dayMatch) {
                tips += ' (I detected some time/day info in your message - adjust as needed.)';
            }
            
            addMessageToChat('assistant', tips + ' I\'ll help you review it before saving!');
        }
    }, 500);
}

function handleEditMeetingIntent(message) {
    if (meetings.length === 0) {
        addMessageToChat('assistant', 'There are no meetings to edit yet. Would you like to schedule one?');
        return;
    }

    addMessageToChat('assistant', `I found ${meetings.length} meeting(s). Which one would you like to edit? (Click the "Edit" button next to it.)`);
}

function handleDeleteMeetingIntent(message) {
    if (meetings.length === 0) {
        addMessageToChat('assistant', 'There are no meetings to delete.');
        return;
    }

    addMessageToChat('assistant', `I found ${meetings.length} meeting(s). Which one would you like to cancel? (Click the "Delete" button.)`);
}

function handleViewSuggestionsIntent() {
    let suggestions = [];
    const stored = localStorage.getItem('kidz-bop-suggestions');
    
    if (stored) {
        suggestions = JSON.parse(stored);
    }

    if (suggestions.length === 0) {
        addMessageToChat('assistant', 'No suggestions have been submitted yet. The public website hasn\'t received any suggestions from users.');
        return;
    }

    addMessageToChat('assistant', `You have ${suggestions.length} suggestion(s) from community members. Scroll down to the "Suggestions" section to read them all.`);
}

function handleHelpWriteIntent() {
    addMessageToChat('assistant', 'I can help you draft content! 📝\n\nI can suggest:\n• Announcement templates\n• Meeting agendas\n• Event descriptions\n\nWhat would you like help with?');
}

// ============================================
// CONFIRMATION DIALOGS WITH ASSISTANT
// ============================================

function showAssistantConfirmation(type, action, data, editId = null) {
    const existingDialog = document.getElementById('confirmationDialog');
    if (existingDialog) {
        existingDialog.remove();
    }

    const dialog = document.createElement('div');
    dialog.id = 'confirmationDialog';
    dialog.className = 'confirmation-dialog-overlay';

    let preview = '';
    let actionText = action === 'edit' ? 'Edit' : 'Create';

    if (type === 'announcement') {
        preview = `
            <div class="confirmation-preview">
                <h4>📢 ${actionText} Announcement</h4>
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
                <h4>📅 ${actionText} Meeting</h4>
                <div class="preview-item">
                    <strong>${escapeHtml(data.title)}</strong>
                    <p>📆 ${data.date}</p>
                    <p>🕐 ${data.time}</p>
                    ${data.location ? '<p>📍 ' + escapeHtml(data.location) + '</p>' : ''}
                    ${data.details ? '<p>' + escapeHtml(data.details) + '</p>' : ''}
                </div>
            </div>
        `;
    }

    dialog.innerHTML = `
        <div class="confirmation-dialog">
            <div class="confirmation-header">
                <h3>Confirm ${actionText}</h3>
                <button class="confirmation-close" onclick="closeConfirmation()">✕</button>
            </div>
            ${preview}
            <div class="confirmation-actions">
                <button class="btn btn-primary" onclick="confirmAssistantAction('${type}', '${action}', '${editId}')">Confirm</button>
                <button class="btn btn-secondary" onclick="closeConfirmation()">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    window.pendingAction = {
        type,
        action,
        data,
        editId
    };

    // Notify assistant
    addMessageToChat('assistant', `Please review the ${type} preview and confirm if it looks good! 👆`);
}

function confirmAssistantAction(type, action, editId) {
    if (!window.pendingAction) return;

    const data = window.pendingAction.data;
    let successMessage = '';

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
            successMessage = '✅ Announcement published successfully!';
        } else if (action === 'edit' && editId) {
            const announcement = announcements.find(a => a.id == editId);
            if (announcement) {
                announcement.title = data.title;
                announcement.content = data.content;
                announcement.date = data.date;
                announcement.priority = data.priority;
            }
            successMessage = '✅ Announcement updated!';
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
            successMessage = '✅ Meeting scheduled successfully!';
        } else if (action === 'edit' && editId) {
            const meeting = meetings.find(m => m.id == editId);
            if (meeting) {
                meeting.title = data.title;
                meeting.date = data.date;
                meeting.time = data.time;
                meeting.location = data.location;
                meeting.details = data.details;
            }
            successMessage = '✅ Meeting updated!';
        }
        hideMeetingForm();
        renderAdminMeetings();
    }

    updateStats();
    closeConfirmation();

    addMessageToChat('assistant', successMessage);
}

function closeConfirmation() {
    const dialog = document.getElementById('confirmationDialog');
    if (dialog) {
        dialog.remove();
    }
    window.pendingAction = null;
}

// ============================================
// ASSISTANT PANEL TOGGLE
// ============================================

function toggleAssistantPanel() {
    const panel = document.getElementById('assistantPanel');
    const toggleBtn = document.getElementById('assistantToggleBtn');

    if (panel) {
        panel.classList.toggle('hidden');
    }

    if (toggleBtn && window.innerWidth <= 768) {
        toggleBtn.style.display = panel.classList.contains('hidden') ? 'flex' : 'none';
    }
}

// ============================================
// HELPER: Send Assistant Message from anywhere
// ============================================

window.sendAssistantMessage = sendAssistantMessage;
window.handleAssistantSubmit = handleAssistantSubmit;
window.clearAssistantChat = clearAssistantChat;
window.confirmAssistantAction = confirmAssistantAction;
window.closeConfirmation = closeConfirmation;
window.toggleAssistantPanel = toggleAssistantPanel;
