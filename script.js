/* ============================================
   KIDZ BOP KIDS - JAVASCRIPT
   Interactive Features & Data Management
   ============================================ */

// ============================================
// DATA STORAGE
// ============================================

const announcements = [
    {
        id: 1,
        title: "Welcome to Kidz Bop Kids!",
        content: "We're excited to launch our official website. This is your hub for announcements, meetings, and group updates.",
        date: "2024-01-15",
        priority: "high"
    },
    {
        id: 2,
        title: "Next Meeting Scheduled",
        content: "Join us this Sunday at 3 PM for our weekly group meeting. Topics include upcoming events and member discussions.",
        date: "2024-01-12",
        priority: "normal"
    },
    {
        id: 3,
        title: "Group Guidelines Reminder",
        content: "Please review our group rules. They help us maintain a positive and respectful community for everyone.",
        date: "2024-01-10",
        priority: "normal"
    }
];

const meetings = [
    {
        id: 1,
        title: "Weekly Group Meeting",
        date: "2024-01-21",
        time: "3:00 PM",
        details: "Regular weekly meeting to discuss group activities, announcements, and member updates."
    },
    {
        id: 2,
        title: "Leadership Team Meeting",
        date: "2024-01-28",
        time: "2:00 PM",
        details: "Monthly meeting for leadership roles to plan upcoming events and initiatives."
    },
    {
        id: 3,
        title: "Special Event Planning",
        date: "2024-02-04",
        time: "4:00 PM",
        details: "Join us to brainstorm and plan our upcoming special event for the group."
    }
];

// ============================================
// HAMBURGER MENU FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeHamburgerMenu();
    renderAnnouncements();
    renderMeetings();
    loadSuggestions();
    updateLatestAnnouncement();
    updateNextMeeting();
});

function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);

        if (!isClickInsideMenu && !isClickOnHamburger) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Handle keyboard navigation
    hamburger.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        }
    });
}

// ============================================
// ANNOUNCEMENTS RENDERING
// ============================================

function renderAnnouncements() {
    const announcementsList = document.getElementById('announcementsList');
    const announcementsEmpty = document.getElementById('announcementsEmpty');

    if (!announcementsList) return;

    announcementsList.innerHTML = '';

    if (announcements.length === 0) {
        announcementsEmpty.style.display = 'block';
        return;
    }

    announcementsEmpty.style.display = 'none';

    announcements.forEach((announcement, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Announcement: ${announcement.title}`);

        const formattedDate = formatDate(announcement.date);
        const priorityBadge = announcement.priority === 'high' ? '🔴 ' : '';

        card.innerHTML = `
            <h3>${priorityBadge}${escapeHtml(announcement.title)}</h3>
            <div class="card-meta">
                <time datetime="${announcement.date}">${formattedDate}</time>
            </div>
            <p>${escapeHtml(announcement.content)}</p>
        `;

        announcementsList.appendChild(card);
    });
}

// ============================================
// MEETINGS RENDERING
// ============================================

function renderMeetings() {
    const meetingsList = document.getElementById('meetingsList');
    const meetingsEmpty = document.getElementById('meetingsEmpty');

    if (!meetingsList) return;

    meetingsList.innerHTML = '';

    if (meetings.length === 0) {
        meetingsEmpty.style.display = 'block';
        return;
    }

    meetingsEmpty.style.display = 'none';

    meetings.forEach((meeting, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Meeting: ${meeting.title}`);

        const formattedDate = formatDate(meeting.date);

        card.innerHTML = `
            <h3>📅 ${escapeHtml(meeting.title)}</h3>
            <div class="card-meta">
                <time datetime="${meeting.date}">${formattedDate}</time> • <strong>${escapeHtml(meeting.time)}</strong>
            </div>
            <p>${escapeHtml(meeting.details)}</p>
        `;

        meetingsList.appendChild(card);
    });
}

// ============================================
// HOME PAGE UPDATES
// ============================================

function updateLatestAnnouncement() {
    const latestAnnouncementEl = document.getElementById('latestAnnouncement');
    
    if (!latestAnnouncementEl) return;

    if (announcements.length > 0) {
        const latest = announcements[0];
        latestAnnouncementEl.textContent = latest.title;
    }
}

function updateNextMeeting() {
    const nextMeetingEl = document.getElementById('nextMeeting');
    
    if (!nextMeetingEl) return;

    if (meetings.length > 0) {
        const next = meetings[0];
        const formattedDate = formatDate(next.date);
        nextMeetingEl.textContent = `${next.title} - ${formattedDate} at ${next.time}`;
    }
}

// ============================================
// SUGGESTIONS FORM HANDLING
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const suggestionForm = document.getElementById('suggestionForm');
    
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', handleSuggestionSubmit);
    }
});

function handleSuggestionSubmit(event) {
    event.preventDefault();

    const suggestionText = document.getElementById('suggestionText');
    const suggestion = suggestionText.value.trim();

    if (!suggestion) {
        alert('Please enter a suggestion before submitting.');
        return;
    }

    // Save suggestion to localStorage
    saveSuggestion(suggestion);

    // Show success message
    showSuccessMessage();

    // Clear form
    suggestionText.value = '';

    // Reload suggestions display
    loadSuggestions();

    // Hide success message after 3 seconds
    setTimeout(() => {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.style.display = 'none';
        }
    }, 3000);
}

function saveSuggestion(suggestion) {
    let suggestions = [];

    // Retrieve existing suggestions from localStorage
    const stored = localStorage.getItem('kidz-bop-suggestions');
    if (stored) {
        suggestions = JSON.parse(stored);
    }

    // Add new suggestion
    const newSuggestion = {
        id: Date.now(),
        text: suggestion,
        timestamp: new Date().toISOString()
    };

    suggestions.unshift(newSuggestion); // Add to beginning of array

    // Keep only the last 50 suggestions
    suggestions = suggestions.slice(0, 50);

    // Save back to localStorage
    localStorage.setItem('kidz-bop-suggestions', JSON.stringify(suggestions));
}

function loadSuggestions() {
    const suggestionsList = document.getElementById('suggestionsList');
    
    if (!suggestionsList) return;

    suggestionsList.innerHTML = '';

    let suggestions = [];
    const stored = localStorage.getItem('kidz-bop-suggestions');
    
    if (stored) {
        suggestions = JSON.parse(stored);
    }

    if (suggestions.length === 0) {
        suggestionsList.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 1.5rem;">No suggestions yet. Be the first to share your ideas!</p>';
        return;
    }

    suggestions.forEach((suggestion) => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.setAttribute('role', 'article');
        item.setAttribute('aria-label', 'User suggestion');

        const date = new Date(suggestion.timestamp);
        const formattedTime = formatDateTime(date);

        item.innerHTML = `
            <p>"${escapeHtml(suggestion.text)}"</p>
            <div class="suggestion-time">${formattedTime}</div>
        `;

        suggestionsList.appendChild(item);
    });
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

function formatDateTime(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateToCheck = new Date(date);

    // Check if date is today
    if (dateToCheck.toDateString() === today.toDateString()) {
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        return 'Today at ' + date.toLocaleTimeString('en-US', timeOptions);
    }

    // Check if date is yesterday
    if (dateToCheck.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }

    // Otherwise, show full date
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

    return `${formattedDate} at ${formattedTime}`;
}

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

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', function(event) {
    // Press '/' to focus on navigation
    if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        const firstNavLink = document.querySelector('.nav-link');
        if (firstNavLink) {
            event.preventDefault();
            firstNavLink.focus();
        }
    }

    // Press 'h' to go to home
    if (event.key === 'h' && !event.ctrlKey && !event.metaKey) {
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Press 'Escape' to close mobile menu
    if (event.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const hamburger = document.getElementById('hamburger');
        if (navMenu && hamburger) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// ============================================
// SMOOTH SCROLL FALLBACK
// ============================================

if (!CSS.supports('scroll-behavior', 'smooth')) {
    document.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            const href = event.target.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.slice(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    event.preventDefault();
                    smoothScroll(targetElement, 300);
                }
            }
        }
    });
}

function smoothScroll(target, duration) {
    const start = window.scrollY;
    const end = target.offsetTop - 80; // Account for fixed navbar
    const distance = end - start;
    let currentTime = 0;

    function easeInOutQuad(time, start, distance, duration) {
        time /= duration / 2;
        if (time < 1) return distance / 2 * time * time + start;
        time--;
        return -distance / 2 * (time * (time - 2) - 1) + start;
    }

    function scroll() {
        currentTime += 16; // Roughly 60fps
        window.scrollTo(0, easeInOutQuad(currentTime, start, distance, duration));
        if (currentTime < duration) {
            requestAnimationFrame(scroll);
        }
    }

    scroll();
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images if there are any
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ============================================
// RESPONSIVE VIEWPORT FIX
// ============================================

// Ensure viewport meta tag is set correctly
if (document.querySelector('meta[name="viewport"]')) {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta.getAttribute('content').includes('viewport-fit=cover')) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    }
}

// ============================================
// SERVICE WORKER REGISTRATION (Optional)
// ============================================

// Uncomment to enable service worker for offline support
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js').then(registration => {
//         console.log('Service Worker registered');
//     }).catch(error => {
//         console.log('Service Worker registration failed:', error);
//     });
// }

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c🎵 Kidz Bop Kids Website', 'color: #6366f1; font-size: 16px; font-weight: bold;');
console.log('%cCommunity, Fun, Together!', 'color: #ec4899; font-size: 14px;');
console.log('%cVersion 1.0 | Built with HTML, CSS & JavaScript', 'color: #cbd5e1; font-size: 12px;');
