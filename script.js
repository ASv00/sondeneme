
// Global variables
let currentUser = {
    email: 'admin@subuasto.edu.tr',
    role: 'başkan',
    language: localStorage.getItem('userLanguage') || 'tr'
};

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const dashboardCards = document.querySelectorAll('.dashboard-card.expandable');

// Language support
const SUPPORTED_LANGUAGES = ['tr', 'en'];
let translations = {};

// Sample data
const sampleData = {
    events: [
        { id: 1, title: 'Geminids Meteor Yağmuru', date: '2024-12-13', location: 'Uludağ Gözlemevi', status: 'active', sponsor: 'ABC Optik', type: 'gozlem', participants: 45 },
        { id: 2, title: 'Mars Karşıtlığı Gözlemi', date: '2024-12-20', location: 'Kampüs', status: 'planning', sponsor: 'TÜBİTAK', type: 'gozlem', participants: 23 },
        { id: 3, title: 'Astronomi Semineri', date: '2024-12-25', location: 'Konferans Salonu', status: 'active', sponsor: '', type: 'seminer', participants: 67 }
    ],
    socialMediaPosts: [
        { id: 1, title: 'Mars Karşıtlığı Paylaşımı', platform: 'Instagram & TikTok', status: 'taslak', author: 'Ahmet Y.', likes: 0, comments: 0, shares: 0 },
        { id: 2, title: 'Geminids Duyurusu', platform: 'Tüm Platformlar', status: 'planlandi', scheduledDate: '2024-12-10', likes: 0, comments: 0, shares: 0 },
        { id: 3, title: 'Satürn Halkaları', platform: 'YouTube Video', status: 'yayinlandi', views: '1.2K', likes: 156, comments: 23, shares: 45 }
    ],
    skyEvents: [
        { id: 1, name: 'Geminids Meteor Yağmuru', date: '2024-12-13', type: 'meteor_yagmuru' }
    ],
    documents: [
        { id: 1, title: '2024 Faaliyet Raporu', category: 'Topluluk', status: 'pending' },
        { id: 2, title: 'Etkinlik Onay Formu', category: 'Etkinlik', status: 'pending' },
        { id: 3, title: 'Bütçe Talebi', category: 'Proje', status: 'pending' }
    ],
    members: [
        { id: 1, name: 'Ahmet Yılmaz', role: 'başkan', status: 'active', joinDate: '2024-01-15' },
        { id: 2, name: 'Zeynep Kaya', role: 'mentor', status: 'active', joinDate: '2024-02-20' },
        { id: 3, name: 'Mehmet Demir', role: 'üye', status: 'active', joinDate: '2024-03-10' },
        { id: 4, name: 'Ayşe Çelik', role: 'üye', status: 'active', joinDate: '2024-04-05' }
    ],
    mediaFiles: [
        { id: 1, title: 'Geminids_2024_Poster.jpg', type: 'image', category: 'etkinlik', size: '2.4 MB', uploadedAt: '2024-12-15', version: 1 },
        { id: 2, title: 'Mars_Observation_Video.mp4', type: 'video', category: 'gozlem', size: '45.6 MB', uploadedAt: '2024-12-10', version: 1 }
    ],
    blogPosts: [
        { id: 1, title: 'Kış Gözlemciliği Rehberi', category: 'Rehber', status: 'yayinlandi', publishedAt: '2024-12-10', views: 245 },
        { id: 2, title: 'Mars Karşıtlığı Nedir?', category: 'Eğitim', status: 'taslak', publishedAt: null, views: 0 }
    ],
    libraryResources: [
        { id: 1, title: 'Astronomi Temelleri', type: 'pdf', ageGroups: ['genc', 'yetiskin'], tags: ['temel', 'gezegenler', 'yıldızlar'], downloads: 89 },
        { id: 2, title: 'Gök Mekaniği', type: 'kitap', ageGroups: ['yetiskin'], tags: ['ileri', 'matematik', 'fizik'], downloads: 34 }
    ],
    tasks: [
        { id: 1, title: 'Geminids Etkinliği Hazırlık', assignedTo: 1, department: 'organizasyon', dueDate: '2024-12-12', priority: 'yuksek', status: 'yapilacak' },
        { id: 2, title: 'Sosyal Medya İçerik Planı', assignedTo: 2, department: 'sosyal', dueDate: '2024-12-15', priority: 'orta', status: 'devam_ediyor' }
    ],
    budgetLogs: [
        { id: 1, amount: 5000, type: 'gider', category: 'Ekipman', date: '2024-01-15' },
        { id: 2, amount: 3000, type: 'gider', category: 'Etkinlik', date: '2024-02-20' },
        { id: 3, amount: 10000, type: 'gelir', category: 'Sponsorluk', date: '2024-03-10' }
    ]
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sample data loaded');
    initializeApp();
    loadDashboardData();
    setupEventListeners();
});

function initializeApp() {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeToggle(savedTheme);
    
    // Show dashboard by default
    showSection('dashboard');
}

function setupEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Event filters
    setupEventFilters();
    setupMediaFilters();
    setupBlogFilters();
    setupLibraryFilters();
    setupTaskForm();
    
    // Calendar export
    const exportBtn = document.getElementById('export-calendar');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCalendar);
    }
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active nav
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Dashboard expandable cards
    dashboardCards.forEach(card => {
        card.addEventListener('click', function() {
            const isExpanded = this.classList.contains('expanded');
            
            // Close all other cards
            dashboardCards.forEach(c => {
                c.classList.remove('expanded');
                const content = c.querySelector('.expanded-content');
                if (content) content.style.display = 'none';
            });
            
            if (!isExpanded) {
                this.classList.add('expanded');
                const expandedContent = this.querySelector('.expanded-content');
                if (expandedContent) {
                    expandedContent.style.display = 'block';
                    loadCardData(this.getAttribute('data-type'));
                }
            }
        });
    });
    
    // Calendar events
    document.querySelectorAll('.calendar-day.has-event').forEach(day => {
        day.addEventListener('click', function() {
            const eventType = this.getAttribute('data-event');
            alert(`${eventType} etkinliği detayları burada görünecek`);
        });
    });
    
    // Form buttons and other interactive elements
    setupFormButtons();
    setupListActions();
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle(newTheme);
}

function updateThemeToggle(theme) {
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

function showSection(sectionId) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        loadSectionData(sectionId);
    }
}

function loadDashboardData() {
    console.log('Loading dashboard data...');
    
    // Update card counts
    updateCardCounts();
    console.log('Card counts updated');
}

function updateCardCounts() {
    const upcomingEventsCard = document.querySelector('[data-type="events"] .card-count');
    const pendingDocsCard = document.querySelector('[data-type="documents"] .card-count');
    const activeMembersCard = document.querySelector('[data-type="members"] .card-count');
    
    if (upcomingEventsCard) upcomingEventsCard.textContent = sampleData.events.length;
    if (pendingDocsCard) pendingDocsCard.textContent = sampleData.documents.filter(d => d.status === 'pending').length;
    if (activeMembersCard) activeMembersCard.textContent = sampleData.members.filter(m => m.status === 'active').length;
}

function loadCardData(type) {
    const list = document.getElementById(`${type === 'events' ? 'upcoming-events' : type === 'documents' ? 'pending-approvals' : 'active-members'}-list`);
    
    if (!list) return;
    
    let items = [];
    
    switch(type) {
        case 'events':
            items = sampleData.events;
            break;
        case 'documents':
            items = sampleData.documents.filter(d => d.status === 'pending');
            break;
        case 'members':
            if (hasPermission('view_members')) {
                items = sampleData.members.filter(m => m.status === 'active');
            } else {
                list.innerHTML = '<p>Bu bilgileri görme yetkiniz bulunmamaktadır.</p>';
                return;
            }
            break;
    }
    
    list.innerHTML = items.map(item => {
        switch(type) {
            case 'events':
                return `<div class="list-item" onclick="openEventDetail(${item.id})">
                    <h4>${item.title}</h4>
                    <p>${item.date} - ${item.location}</p>
                </div>`;
            case 'documents':
                return `<div class="list-item" onclick="openDocumentDetail(${item.id})">
                    <h4>${item.title}</h4>
                    <p>Kategori: ${item.category}</p>
                </div>`;
            case 'members':
                return `<div class="list-item">
                    <h4>${item.name}</h4>
                    <p>Rol: ${item.role}</p>
                </div>`;
            default:
                return '';
        }
    }).join('');
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'social-media':
            loadSocialMediaBoard();
            break;
        case 'events':
            loadEventsData();
            break;
        case 'members':
            loadMembersData();
            loadContactLogs();
            break;
        case 'sky-calendar':
            setupSkyCalendarEvents();
            break;
        case 'media':
            filterMediaFiles();
            break;
        case 'blog':
            filterBlogPosts();
            break;
        case 'library':
            filterLibraryResources();
            break;
        case 'tasks':
            loadTasksKanban();
            break;
        case 'reports':
            loadReportsData();
            break;
    }
}

function setupFormButtons() {
    // New item buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('+ Yeni') || btn.textContent.includes('+ ')) {
            btn.addEventListener('click', function() {
                const section = this.closest('.content-section').id;
                showNewItemForm(section);
            });
        }
    });
    
    // Action buttons
    document.querySelectorAll('.btn').forEach(btn => {
        if (btn.textContent === 'Düzenle') {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.card, .kanban-item, .member-card');
                if (card) {
                    editItem(card);
                }
            });
        }
        
        if (btn.textContent === 'Detay' || btn.textContent === 'İncele') {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.card, .kanban-item');
                if (card) {
                    showItemDetail(card);
                }
            });
        }
    });
}

function setupListActions() {
    // Event listeners for dynamic content
    document.addEventListener('click', function(e) {
        if (e.target.closest('.list-item')) {
            const item = e.target.closest('.list-item');
            const onclick = item.getAttribute('onclick');
            if (onclick) {
                eval(onclick);
            }
        }
    });
}

// Utility functions
function hasPermission(action) {
    const userRole = currentUser.role;
    const highLevelRoles = ['başkan', 'mentor'];
    const adminRoles = ['başkan'];
    
    switch(action) {
        case 'view_members':
            return highLevelRoles.includes(userRole);
        case 'edit_members':
            return highLevelRoles.includes(userRole);
        case 'approve_documents':
            return adminRoles.includes(userRole);
        default:
            return true;
    }
}

function showNewItemForm(section) {
    switch(section) {
        case 'events':
            showNewEventForm();
            break;
        case 'social-media':
            showNewSocialMediaForm();
            break;
        case 'documents':
            showNewDocumentForm();
            break;
        case 'projects':
            showNewProjectForm();
            break;
        case 'members':
            showNewMemberForm();
            break;
        case 'media':
            showNewMediaForm();
            break;
        case 'blog':
            showNewBlogForm();
            break;
        case 'library':
            showNewResourceForm();
            break;
        case 'tasks':
            showNewTaskForm();
            break;
        default:
            alert(`${section} için yeni öğe ekleme formu henüz hazırlanmadı.`);
    }
}

// Form functions
function showNewEventForm() {
    alert('Yeni etkinlik ekleme formu açılacak');
}

function showNewSocialMediaForm() {
    alert('Yeni sosyal medya içeriği ekleme formu açılacak');
}

function showNewDocumentForm() {
    alert('Yeni belge ekleme formu açılacak');
}

function showNewProjectForm() {
    alert('Yeni proje ekleme formu açılacak');
}

function showNewMemberForm() {
    alert('Yeni üye davet formu açılacak');
}

function showNewMediaForm() {
    alert('Medya yükleme formu açılacak');
}

function showNewBlogForm() {
    alert('Yeni blog yazısı ekleme formu açılacak');
}

function showNewResourceForm() {
    alert('Yeni kaynak ekleme formu açılacak');
}

function showNewTaskForm() {
    alert('Yeni görev ekleme formu açılacak');
}

function showNewResourceForm() {
    alert('Yeni kaynak ekleme formu açılacak');
}

// Item action functions
function editItem(card) {
    alert('Düzenleme formu açılacak');
}

function showItemDetail(card) {
    alert('Detay sayfası açılacak');
}

// Modal functions
function createModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Close on overlay click
    document.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function openEventDetail(id) {
    console.log('Edit event:', id);
    const event = sampleData.events.find(e => e.id === id);
    if (!event) return;
    
    const content = `
        <div class="detail-content">
            <h3>${event.title}</h3>
            <p><strong>Tarih:</strong> ${event.date}</p>
            <p><strong>Konum:</strong> ${event.location}</p>
            <p><strong>Durum:</strong> ${event.status}</p>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="editEvent(${id})">Düzenle</button>
                <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
            </div>
        </div>
    `;
    
    createModal('Etkinlik Detayları', content);
}

function openDocumentDetail(id) {
    console.log('Document detail:', id);
    const document = sampleData.documents.find(d => d.id === id);
    if (!document) return;
    
    const content = `
        <div class="detail-content">
            <h3>${document.title}</h3>
            <p><strong>Kategori:</strong> ${document.category}</p>
            <p><strong>Durum:</strong> ${document.status}</p>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="editDocument(${id})">İncele</button>
                <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
            </div>
        </div>
    `;
    
    createModal('Belge Detayları', content);
}

function openProjectDetail(id) {
    console.log('Proje detayı açılıyor:', id);
    const content = `
        <div class="detail-content">
            <h3>Mobil Gözlemevi Projesi</h3>
            <p><strong>Tür:</strong> Donanım</p>
            <p><strong>Bütçe:</strong> ₺25,000 / ₺30,000</p>
            <p><strong>İlerleme:</strong> %83</p>
            <p><strong>Ortaklar:</strong> TÜBİTAK, XYZ Teknoloji</p>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="editProject(${id})">Düzenle</button>
                <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
            </div>
        </div>
    `;
    
    createModal('Proje Detayları', content);
}

// Edit functions
function editEvent(id) {
    closeModal();
    alert(`Etkinlik ${id} düzenleme formu açılacak`);
}

function editDocument(id) {
    closeModal();
    alert(`Belge ${id} düzenleme formu açılacak`);
}

function editProject(id) {
    closeModal();
    alert(`Proje ${id} düzenleme formu açılacak`);
}

// Event filtering functions
function setupEventFilters() {
    const typeFilter = document.getElementById('event-type-filter');
    const monthFilter = document.getElementById('event-month-filter');
    const sponsorFilter = document.getElementById('event-sponsor-filter');
    const searchInput = document.getElementById('event-search');
    
    [typeFilter, monthFilter, sponsorFilter, searchInput].forEach(element => {
        if (element) {
            element.addEventListener('change', filterEvents);
            if (element === searchInput) {
                element.addEventListener('input', filterEvents);
            }
        }
    });
}

function filterEvents() {
    const typeFilter = document.getElementById('event-type-filter')?.value || '';
    const monthFilter = document.getElementById('event-month-filter')?.value || '';
    const sponsorFilter = document.getElementById('event-sponsor-filter')?.value || '';
    const searchTerm = document.getElementById('event-search')?.value.toLowerCase() || '';
    
    let filteredEvents = sampleData.events.filter(event => {
        const matchesType = !typeFilter || event.type === typeFilter;
        const matchesMonth = !monthFilter || new Date(event.date).getMonth() + 1 == monthFilter;
        const matchesSponsor = !sponsorFilter || event.sponsor === sponsorFilter;
        const matchesSearch = !searchTerm || event.title.toLowerCase().includes(searchTerm);
        
        return matchesType && matchesMonth && matchesSponsor && matchesSearch;
    });
    
    displayFilteredEvents(filteredEvents);
}

function displayFilteredEvents(events) {
    const grid = document.querySelector('#events .content-grid');
    if (!grid) return;
    
    grid.innerHTML = events.map(event => `
        <div class="card">
            <h3>${event.title}</h3>
            <p><strong>Tarih:</strong> ${event.date}</p>
            <p><strong>Yer:</strong> ${event.location}</p>
            ${event.sponsor ? `<p><strong>Sponsor:</strong> ${event.sponsor}</p>` : ''}
            <div class="card-actions">
                <button class="btn btn-sm" onclick="editEvent(${event.id})">Düzenle</button>
                <button class="btn btn-sm btn-outline" onclick="openEventDetail(${event.id})">Detay</button>
            </div>
        </div>
    `).join('');
}

// Calendar export function
function exportToCalendar() {
    const events = sampleData.events;
    let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//SUBÜ ASTO//Events//TR'
    ];
    
    events.forEach(event => {
        const startDate = new Date(event.date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        icsContent.push(
            'BEGIN:VEVENT',
            `DTSTART:${startDate}`,
            `DTEND:${startDate}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.title} - ${event.location}`,
            `LOCATION:${event.location}`,
            `UID:${event.id}@subuasto.edu.tr`,
            'END:VEVENT'
        );
    });
    
    icsContent.push('END:VCALENDAR');
    
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subu-asto-etkinlikler.ics';
    a.click();
    URL.revokeObjectURL(url);
}

// Social media board functions
function loadSocialMediaBoard() {
    const statuses = ['taslak', 'planlandi', 'yayinlandi'];
    
    statuses.forEach(status => {
        const container = document.getElementById(`social-${status}`);
        if (!container) return;
        
        const posts = sampleData.socialMediaPosts.filter(post => post.status === status);
        
        container.innerHTML = posts.map(post => `
            <div class="kanban-item" onclick="openSocialPostDetail(${post.id})">
                <h4>${post.title}</h4>
                <p>${post.platform}</p>
                <small>${post.author || post.scheduledDate || post.views || ''}</small>
            </div>
        `).join('');
    });
}

// Sky calendar event handling
function setupSkyCalendarEvents() {
    document.querySelectorAll('.calendar-day.has-event').forEach(day => {
        day.addEventListener('click', function() {
            const eventId = this.getAttribute('data-id');
            if (eventId) {
                openSkyEventDetail(eventId);
            }
        });
    });
}

function openSkyEventDetail(id) {
    const event = sampleData.skyEvents.find(e => e.id == id);
    if (!event) return;
    
    const content = `
        <div class="detail-content">
            <h3>${event.name}</h3>
            <p><strong>Tarih:</strong> ${event.date}</p>
            <p><strong>Tür:</strong> ${event.type}</p>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="editSkyEvent(${id})">Düzenle</button>
                <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
            </div>
        </div>
    `;
    
    createModal('Gök Olayı Detayları', content);
}

// Document approval functions
function approveDocument(id) {
    if (!hasPermission('approve_documents')) {
        alert('Bu işlem için yetkiniz bulunmamaktadır.');
        return;
    }
    
    if (confirm('Bu belgeyi onaylamak istediğinizden emin misiniz?')) {
        // AJAX call to approve document
        console.log(`Document ${id} approved`);
        alert('Belge onaylandı.');
        // Refresh document list
    }
}

function rejectDocument(id) {
    if (!hasPermission('approve_documents')) {
        alert('Bu işlem için yetkiniz bulunmamaktadır.');
        return;
    }
    
    const reason = prompt('Red nedeni:');
    if (reason) {
        console.log(`Document ${id} rejected: ${reason}`);
        alert('Belge reddedildi.');
        // Refresh document list
    }
}

// Member and contact functions
function loadMembersData() {
    // Load members with risk status indicators
    updateRiskIndicators();
}

function loadContactLogs() {
    const container = document.getElementById('contact-logs-list');
    if (!container) return;
    
    const sampleLogs = [
        { id: 1, company: 'ABC Optik', message: 'Sponsorluk talebi', date: '2024-12-01', status: 'pending' },
        { id: 2, company: 'XYZ Teknoloji', message: 'İşbirliği önerisi', date: '2024-11-28', status: 'replied' }
    ];
    
    container.innerHTML = sampleLogs.map(log => `
        <div class="contact-log-item">
            <h4>${log.company}</h4>
            <p>${log.message}</p>
            <small>${log.date} - ${log.status}</small>
        </div>
    `).join('');
}

function updateRiskIndicators() {
    document.querySelectorAll('.risk-indicator').forEach(indicator => {
        const status = indicator.classList.contains('warning') ? 'warning' : 
                      indicator.classList.contains('danger') ? 'danger' : 'normal';
        indicator.style.color = status === 'danger' ? '#ef4444' : 
                               status === 'warning' ? '#f59e0b' : '#10b981';
    });
}

function viewContactHistory(memberId) {
    const content = `
        <div class="detail-content">
            <h3>İletişim Geçmişi</h3>
            <div class="contact-timeline">
                <p>2024-12-01: E-posta gönderildi</p>
                <p>2024-11-28: Telefon görüşmesi</p>
                <p>2024-11-25: WhatsApp mesajı</p>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="addContactEntry(${memberId})">Yeni Kayıt</button>
                <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
            </div>
        </div>
    `;
    
    createModal('İletişim Geçmişi', content);
}

// Quick filter functions for departments
function applyQuickFilter(filterType) {
    const filters = {
        'active-projects': { hasActiveProjects: true },
        'high-activity': { activityLevel: 'high' },
        'needs-attention': { needsAttention: true }
    };
    
    const filter = filters[filterType];
    if (filter) {
        // Save to localStorage
        localStorage.setItem('departmentFilter', JSON.stringify(filter));
        // Apply filter
        filterDepartments(filter);
    }
}

function filterDepartments(filter) {
    console.log('Applying department filter:', filter);
    // Implementation for department filtering
}

// Additional utility functions
function loadEventsData() {
    displayFilteredEvents(sampleData.events);
}

function openSocialPostDetail(id) {
    const post = sampleData.socialMediaPosts.find(p => p.id === id);
    if (!post) return;
    
    const content = `
        <div class="detail-content">
            <h3>${post.title}</h3>
            <p><strong>Platform:</strong> ${post.platform}</p>
            <p><strong>Durum:</strong> ${post.status}</p>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="editSocialPost(${id})">Düzenle</button>
                <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
            </div>
        </div>
    `;
    
    createModal('Sosyal Medya Detayları', content);
}

function editSocialPost(id) {
    closeModal();
    alert(`Sosyal medya içeriği ${id} düzenleme formu açılacak`);
}

function editSkyEvent(id) {
    closeModal();
    alert(`Gök olayı ${id} düzenleme formu açılacak`);
}

function addContactEntry(memberId) {
    closeModal();
    alert(`Üye ${memberId} için yeni iletişim kaydı ekleme formu açılacak`);
}

// Media Archive Functions
function setupMediaFilters() {
    const typeFilter = document.getElementById('media-type-filter');
    const categoryFilter = document.getElementById('media-category-filter');
    const dateFromFilter = document.getElementById('media-date-from');
    const dateToFilter = document.getElementById('media-date-to');
    const searchInput = document.getElementById('media-search');
    
    [typeFilter, categoryFilter, dateFromFilter, dateToFilter, searchInput].forEach(element => {
        if (element) {
            element.addEventListener('change', filterMediaFiles);
            if (element === searchInput) {
                element.addEventListener('input', filterMediaFiles);
            }
        }
    });
}

function filterMediaFiles() {
    const typeFilter = document.getElementById('media-type-filter')?.value || '';
    const categoryFilter = document.getElementById('media-category-filter')?.value || '';
    const dateFrom = document.getElementById('media-date-from')?.value || '';
    const dateTo = document.getElementById('media-date-to')?.value || '';
    const searchTerm = document.getElementById('media-search')?.value.toLowerCase() || '';
    
    let filteredFiles = sampleData.mediaFiles.filter(file => {
        const matchesType = !typeFilter || file.type === typeFilter;
        const matchesCategory = !categoryFilter || file.category === categoryFilter;
        const matchesDateFrom = !dateFrom || file.uploadedAt >= dateFrom;
        const matchesDateTo = !dateTo || file.uploadedAt <= dateTo;
        const matchesSearch = !searchTerm || file.title.toLowerCase().includes(searchTerm);
        
        return matchesType && matchesCategory && matchesDateFrom && matchesDateTo && matchesSearch;
    });
    
    displayMediaFiles(filteredFiles);
}

function displayMediaFiles(files) {
    const grid = document.getElementById('media-grid');
    if (!grid) return;
    
    grid.innerHTML = files.map(file => `
        <div class="media-item" onclick="viewMediaFile(${file.id})">
            <div class="media-thumbnail">${getFileIcon(file.type)}</div>
            <h4>${file.title}</h4>
            <p>${file.size} - ${file.uploadedAt}</p>
            <p><strong>Kategori:</strong> ${file.category}</p>
            <div class="media-actions">
                <button class="btn btn-sm" onclick="event.stopPropagation(); downloadMediaFile(${file.id})">İndir</button>
                <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); showMediaVersions(${file.id})">Sürümler</button>
            </div>
        </div>
    `).join('');
}

function getFileIcon(type) {
    const icons = {
        'image': '🖼️',
        'video': '🎬',
        'audio': '🎵',
        'document': '📄'
    };
    return icons[type] || '📄';
}

function showChunkedUploadModal() {
    const content = `
        <div class="upload-modal">
            <h3>Dosya Yükleme</h3>
            <div class="upload-area" id="upload-area">
                <p>Dosyaları buraya sürükleyin veya tıklayın</p>
                <input type="file" id="file-input" multiple style="display: none;">
            </div>
            <div class="upload-options">
                <select id="upload-category">
                    <option value="genel">Genel</option>
                    <option value="etkinlik">Etkinlik</option>
                    <option value="proje">Proje</option>
                    <option value="afiş">Afiş</option>
                </select>
                <label><input type="checkbox" id="preserve-icc"> ICC Profili Koru</label>
            </div>
            <div class="upload-progress" id="upload-progress" style="display: none;">
                <div class="progress-bar">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
                <p id="progress-text">0%</p>
            </div>
        </div>
    `;
    
    createModal('Dosya Yükleme', content);
    setupChunkedUpload();
}

function setupChunkedUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#f0f0f0';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
        handleFileUpload([...e.dataTransfer.files]);
    });
    
    fileInput.addEventListener('change', (e) => {
        handleFileUpload([...e.target.files]);
    });
}

function handleFileUpload(files) {
    files.forEach(file => {
        uploadFileInChunks(file);
    });
}

async function uploadFileInChunks(file) {
    const chunkSize = 1024 * 1024; // 1MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    const uploadId = generateUploadId();
    
    document.getElementById('upload-progress').style.display = 'block';
    
    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('uploadId', uploadId);
        formData.append('chunkNumber', i);
        formData.append('totalChunks', totalChunks);
        formData.append('fileName', file.name);
        formData.append('category', document.getElementById('upload-category').value);
        formData.append('preserveICC', document.getElementById('preserve-icc').checked);
        
        try {
            await fetch('/api/upload_chunk.php', {
                method: 'POST',
                body: formData
            });
            
            const progress = ((i + 1) / totalChunks) * 100;
            updateUploadProgress(progress);
        } catch (error) {
            console.error('Upload chunk failed:', error);
            break;
        }
    }
}

function generateUploadId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function updateUploadProgress(progress) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) progressFill.style.width = progress + '%';
    if (progressText) progressText.textContent = Math.round(progress) + '%';
    
    if (progress >= 100) {
        setTimeout(() => {
            closeModal();
            filterMediaFiles(); // Refresh list
        }, 1000);
    }
}

function showVersionHistory() {
    const content = `
        <div class="version-history">
            <h3>Dosya Sürüm Geçmişi</h3>
            <div class="version-list">
                <div class="version-item">
                    <h4>Geminids_2024_Poster.jpg</h4>
                    <p>Sürüm 2 - 15 Aralık 2024</p>
                    <button class="btn btn-sm" onclick="restoreVersion(1, 2)">Geri Yükle</button>
                </div>
                <div class="version-item">
                    <h4>Geminids_2024_Poster.jpg</h4>
                    <p>Sürüm 1 - 10 Aralık 2024</p>
                    <button class="btn btn-sm" onclick="restoreVersion(1, 1)">Geri Yükle</button>
                </div>
            </div>
        </div>
    `;
    
    createModal('Sürüm Geçmişi', content);
}

function restoreVersion(fileId, version) {
    if (confirm('Bu sürümü geri yüklemek istediğinizden emin misiniz?')) {
        // AJAX call to restore version
        console.log(`Restoring file ${fileId} to version ${version}`);
        closeModal();
        alert('Dosya sürümü geri yüklendi.');
    }
}

// Blog Functions
function setupBlogFilters() {
    const categoryFilter = document.getElementById('blog-category-filter');
    const statusFilter = document.getElementById('blog-status-filter');
    const dateFromFilter = document.getElementById('blog-date-from');
    const dateToFilter = document.getElementById('blog-date-to');
    const searchInput = document.getElementById('blog-search');
    
    [categoryFilter, statusFilter, dateFromFilter, dateToFilter, searchInput].forEach(element => {
        if (element) {
            element.addEventListener('change', filterBlogPosts);
            if (element === searchInput) {
                element.addEventListener('input', filterBlogPosts);
            }
        }
    });
    
    // İlk yükleme
    filterBlogPosts();
}

async function filterBlogPosts() {
    const categoryFilter = document.getElementById('blog-category-filter')?.value || '';
    const statusFilter = document.getElementById('blog-status-filter')?.value || '';
    const dateFrom = document.getElementById('blog-date-from')?.value || '';
    const dateTo = document.getElementById('blog-date-to')?.value || '';
    const searchTerm = document.getElementById('blog-search')?.value.toLowerCase() || '';
    
    // PHP API'ye filtre parametrelerini gönder
    try {
        const params = new URLSearchParams({
            category: categoryFilter,
            status: statusFilter,
            date_from: dateFrom,
            date_to: dateTo,
            search: searchTerm
        });
        
        const response = await fetch(`/api/blog.php?${params}`);
        const data = await response.json();
        
        if (data.success) {
            displayBlogPosts(data.posts);
        } else {
            console.error('Blog filtreleme hatası:', data.message);
            // Hata durumunda örnek veriyi kullan
            filterBlogPostsLocal();
        }
    } catch (error) {
        console.error('Blog API hatası:', error);
        // API hatası durumunda yerel filtreleme yap
        filterBlogPostsLocal();
    }
}

function filterBlogPostsLocal() {
    const categoryFilter = document.getElementById('blog-category-filter')?.value || '';
    const statusFilter = document.getElementById('blog-status-filter')?.value || '';
    const dateFrom = document.getElementById('blog-date-from')?.value || '';
    const dateTo = document.getElementById('blog-date-to')?.value || '';
    const searchTerm = document.getElementById('blog-search')?.value.toLowerCase() || '';
    
    let filteredPosts = sampleData.blogPosts.filter(post => {
        const matchesCategory = !categoryFilter || post.category === categoryFilter;
        const matchesStatus = !statusFilter || post.status === statusFilter;
        const matchesDateFrom = !dateFrom || (post.publishedAt && post.publishedAt >= dateFrom);
        const matchesDateTo = !dateTo || (post.publishedAt && post.publishedAt <= dateTo);
        const matchesSearch = !searchTerm || post.title.toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo && matchesSearch;
    });
    
    displayBlogPosts(filteredPosts);
}

function clearBlogFilters() {
    document.getElementById('blog-category-filter').value = '';
    document.getElementById('blog-status-filter').value = '';
    document.getElementById('blog-date-from').value = '';
    document.getElementById('blog-date-to').value = '';
    document.getElementById('blog-search').value = '';
    filterBlogPosts();
}

function displayBlogPosts(posts) {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;
    
    if (posts.length === 0) {
        grid.innerHTML = '<div class="empty-state">Seçilen kriterlere uygun blog yazısı bulunamadı.</div>';
        return;
    }
    
    grid.innerHTML = posts.map(post => `
        <div class="card blog-card" data-category="${post.category}" data-status="${post.status}">
            <div class="blog-header">
                <h3>${post.title}</h3>
                <span class="status-badge ${post.status}">${getStatusText(post.status)}</span>
            </div>
            <div class="blog-meta">
                <p><strong>Kategori:</strong> <span class="category-tag">${post.category}</span></p>
                <p><strong>Yayın Tarihi:</strong> ${formatDate(post.publishedAt) || 'Henüz yayınlanmadı'}</p>
                <p><strong>Görüntülenme:</strong> ${post.views || 0}</p>
                ${post.excerpt ? `<p class="blog-excerpt">${post.excerpt}</p>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-sm" onclick="editBlogPost(${post.id})">Düzenle</button>
                <button class="btn btn-sm btn-outline" onclick="viewBlogPost(${post.id})">Görüntüle</button>
                ${post.status !== 'arsivlendi' ? 
                    `<button class="btn btn-sm btn-outline" onclick="archiveBlogPost(${post.id})">Arşivle</button>` :
                    `<button class="btn btn-sm btn-success" onclick="restoreBlogPost(${post.id})">Geri Yükle</button>`
                }
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statusTexts = {
        'taslak': 'Taslak',
        'inceleme': 'İnceleme',
        'yayinlandi': 'Yayınlandı',
        'arsivlendi': 'Arşivlendi'
    };
    return statusTexts[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
}

function manageBlogCategories() {
    const content = `
        <div class="category-management">
            <h3>Blog Kategorileri</h3>
            <div class="category-form">
                <input type="text" id="new-category" placeholder="Yeni kategori adı">
                <button class="btn btn-primary" onclick="addBlogCategory()">Ekle</button>
            </div>
            <div class="category-list">
                <div class="category-item">
                    <span>Rehber</span>
                    <button class="btn btn-sm btn-danger" onclick="deleteBlogCategory(1)">Sil</button>
                </div>
                <div class="category-item">
                    <span>Eğitim</span>
                    <button class="btn btn-sm btn-danger" onclick="deleteBlogCategory(2)">Sil</button>
                </div>
            </div>
        </div>
    `;
    
    createModal('Kategori Yönetimi', content);
}

// Library Functions
function setupLibraryFilters() {
    const typeFilter = document.getElementById('library-type-filter');
    const tagSearch = document.getElementById('library-tag-search');
    const searchInput = document.getElementById('library-search');
    const ageGroupCheckboxes = document.querySelectorAll('#age-group-filters input[type="checkbox"]');
    
    [typeFilter, tagSearch, searchInput].forEach(element => {
        if (element) {
            element.addEventListener('change', filterLibraryResources);
            if (element === tagSearch || element === searchInput) {
                element.addEventListener('input', filterLibraryResources);
            }
        }
    });
    
    ageGroupCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterLibraryResources);
    });
}

function filterLibraryResources() {
    const typeFilter = document.getElementById('library-type-filter')?.value || '';
    const tagSearch = document.getElementById('library-tag-search')?.value.toLowerCase() || '';
    const searchTerm = document.getElementById('library-search')?.value.toLowerCase() || '';
    const selectedAgeGroups = [...document.querySelectorAll('#age-group-filters input:checked')].map(cb => cb.value);
    
    let filteredResources = sampleData.libraryResources.filter(resource => {
        const matchesType = !typeFilter || resource.type === typeFilter;
        const matchesTag = !tagSearch || resource.tags.some(tag => tag.toLowerCase().includes(tagSearch));
        const matchesSearch = !searchTerm || resource.title.toLowerCase().includes(searchTerm);
        const matchesAgeGroup = selectedAgeGroups.length === 0 || selectedAgeGroups.some(age => resource.ageGroups.includes(age));
        
        return matchesType && matchesTag && matchesSearch && matchesAgeGroup;
    });
    
    displayLibraryResources(filteredResources);
}

function displayLibraryResources(resources) {
    const grid = document.getElementById('library-grid');
    if (!grid) return;
    
    grid.innerHTML = resources.map(resource => `
        <div class="card resource-card">
            <div class="resource-icon">📚</div>
            <h3>${resource.title}</h3>
            <p><strong>Tür:</strong> ${resource.type}</p>
            <p><strong>Yaş Grupları:</strong> ${resource.ageGroups.join(', ')}</p>
            <p><strong>Etiketler:</strong> ${resource.tags.map(tag => '#' + tag).join(' ')}</p>
            <p><strong>İndirme:</strong> ${resource.downloads}</p>
            <div class="card-actions">
                <button class="btn btn-sm" onclick="downloadResource(${resource.id})">İndir</button>
                <button class="btn btn-sm btn-outline" onclick="viewResourceDetail(${resource.id})">Detay</button>
                <button class="btn btn-sm btn-outline" onclick="archiveResource(${resource.id})">Arşivle</button>
            </div>
        </div>
    `).join('');
}

function manageLibraryTags() {
    const content = `
        <div class="tag-management">
            <h3>Etiket Yönetimi</h3>
            <div class="tag-form">
                <input type="text" id="new-tag" placeholder="Yeni etiket">
                <button class="btn btn-primary" onclick="addLibraryTag()">Ekle</button>
            </div>
            <div class="tag-cloud">
                <span class="tag-item">#astronomi <button onclick="deleteTag('astronomi')">×</button></span>
                <span class="tag-item">#temel <button onclick="deleteTag('temel')">×</button></span>
                <span class="tag-item">#ileri <button onclick="deleteTag('ileri')">×</button></span>
            </div>
        </div>
    `;
    
    createModal('Etiket Yönetimi', content);
}

// Task Management Functions
function showTaskCreationModal() {
    document.getElementById('task-modal').style.display = 'block';
}

function closeTaskModal() {
    document.getElementById('task-modal').style.display = 'none';
}

function setupTaskForm() {
    const form = document.getElementById('task-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            createTask(new FormData(this));
        });
    }
}

async function createTask(formData) {
    const tagsInput = formData.get('tags');
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    const taskData = {
        title: formData.get('title'),
        description: formData.get('description'),
        assigned_to: formData.get('assigned_to'),
        department_id: formData.get('department_id'),
        due_date: formData.get('due_date'),
        reminder_at: formData.get('reminder_at'),
        priority: formData.get('priority'),
        estimated_hours: formData.get('estimated_hours'),
        tags: JSON.stringify(tags),
        assigned_by: currentUser.id || 1,
        status: 'yapilacak'
    };
    
    // Validation
    if (!taskData.title || !taskData.assigned_to || !taskData.due_date) {
        alert('Lütfen zorunlu alanları doldurun (Başlık, Atanan Kişi, Bitiş Tarihi)');
        return;
    }
    
    // Check if due date is in the future
    const dueDate = new Date(taskData.due_date);
    const now = new Date();
    if (dueDate <= now) {
        alert('Bitiş tarihi gelecekte bir tarih olmalıdır');
        return;
    }
    
    try {
        const response = await fetch('/api/tasks.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Add to local data for immediate UI update
            const newTask = {
                id: result.id,
                ...taskData,
                assignedTo: parseInt(taskData.assigned_to)
            };
            sampleData.tasks.push(newTask);
            
            closeTaskModal();
            loadTasksKanban(); // Refresh kanban board
            
            // Show success message
            showNotification('Görev başarıyla oluşturuldu!', 'success');
            
            // Schedule reminder if set
            if (taskData.reminder_at) {
                scheduleTaskReminder(result.id, taskData.reminder_at);
            }
        } else {
            alert('Görev oluşturulurken hata: ' + result.message);
        }
    } catch (error) {
        console.error('Task creation error:', error);
        
        // Fallback: Add to local data for demo purposes
        const newTask = {
            id: Date.now(),
            ...taskData,
            assignedTo: parseInt(taskData.assigned_to)
        };
        sampleData.tasks.push(newTask);
        
        closeTaskModal();
        loadTasksKanban();
        alert('Görev oluşturuldu (demo modu)');
    }
}

function loadTasksKanban() {
    const kanban = document.getElementById('tasks-kanban');
    if (!kanban) return;
    
    const statuses = [
        { key: 'yapilacak', title: '📋 Yapılacak' },
        { key: 'devam_ediyor', title: '⏳ Devam Ediyor' },
        { key: 'tamamlandi', title: '✅ Tamamlandı' }
    ];
    
    kanban.innerHTML = statuses.map(status => {
        const tasks = sampleData.tasks.filter(task => task.status === status.key);
        return `
            <div class="kanban-column" data-status="${status.key}">
                <h3>${status.title} <span class="task-count">(${tasks.length})</span></h3>
                <div class="kanban-items" ondrop="dropTask(event)" ondragover="allowDrop(event)">
                    ${tasks.map(task => {
                        const assignedUser = sampleData.members.find(m => m.id === (task.assignedTo || task.assigned_to));
                        const departmentName = getDepartmentName(task.department_id);
                        const dueDate = formatTaskDate(task.due_date || task.dueDate);
                        const isOverdue = isTaskOverdue(task.due_date || task.dueDate);
                        
                        return `
                            <div class="kanban-item task-item ${isOverdue ? 'overdue' : ''}" 
                                 onclick="viewTaskDetail(${task.id})" 
                                 draggable="true" 
                                 ondragstart="dragTask(event)" 
                                 data-task-id="${task.id}">
                                <div class="task-header">
                                    <h4>${task.title}</h4>
                                    <span class="priority priority-${task.priority}">${getPriorityText(task.priority)}</span>
                                </div>
                                <div class="task-meta">
                                    <p><strong>👤 Atanan:</strong> ${assignedUser ? assignedUser.name : 'Atanmamış'}</p>
                                    ${departmentName ? `<p><strong>🏢 Birim:</strong> ${departmentName}</p>` : ''}
                                    <p><strong>📅 Bitiş:</strong> ${dueDate}</p>
                                    ${task.estimated_hours ? `<p><strong>⏱️ Tahmini:</strong> ${task.estimated_hours}h</p>` : ''}
                                </div>
                                ${task.tags ? `<div class="task-tags">${JSON.parse(task.tags).map(tag => `<span class="tag">#${tag}</span>`).join('')}</div>` : ''}
                                <div class="task-actions">
                                    <button class="btn-sm" onclick="event.stopPropagation(); editTask(${task.id})">✏️</button>
                                    <button class="btn-sm" onclick="event.stopPropagation(); deleteTask(${task.id})">🗑️</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Reports and Analytics Functions
function loadReportsData() {
    loadEventsChart();
    loadBudgetChart();
    loadSocialChart();
    loadMembershipChart();
}

function loadEventsChart() {
    const canvas = document.getElementById('events-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = sampleData.events.map(event => event.participants);
    const labels = sampleData.events.map(event => event.title.substring(0, 15) + '...');
    
    drawBarChart(ctx, data, labels, '#3b82f6');
    
    const totalParticipants = data.reduce((sum, val) => sum + val, 0);
    const avgParticipation = Math.round(totalParticipants / data.length);
    document.getElementById('events-summary').textContent = 
        `Toplam ${totalParticipants} katılımcı, ortalama ${avgParticipation} kişi/etkinlik`;
}

function loadBudgetChart() {
    const canvas = document.getElementById('budget-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const totalIncome = sampleData.budgetLogs.filter(log => log.type === 'gelir')
        .reduce((sum, log) => sum + log.amount, 0);
    const totalExpense = sampleData.budgetLogs.filter(log => log.type === 'gider')
        .reduce((sum, log) => sum + log.amount, 0);
    
    drawPieChart(ctx, [totalIncome, totalExpense], ['Gelir', 'Gider'], ['#10b981', '#ef4444']);
    
    const remaining = totalIncome - totalExpense;
    document.getElementById('budget-summary').textContent = 
        `₺${remaining.toLocaleString()} kalan bütçe (${Math.round((totalExpense/totalIncome)*100)}% kullanıldı)`;
}

function loadSocialChart() {
    const canvas = document.getElementById('social-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const publishedPosts = sampleData.socialMediaPosts.filter(post => post.status === 'yayinlandi');
    const totalLikes = publishedPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
    const totalComments = publishedPosts.reduce((sum, post) => sum + (post.comments || 0), 0);
    const totalShares = publishedPosts.reduce((sum, post) => sum + (post.shares || 0), 0);
    
    drawBarChart(ctx, [totalLikes, totalComments, totalShares], ['Beğeni', 'Yorum', 'Paylaşım'], '#8b5cf6');
    
    document.getElementById('social-summary').textContent = 
        `${publishedPosts.length} yayınlanan içerik, toplam ${totalLikes + totalComments + totalShares} etkileşim`;
}

function loadMembershipChart() {
    const canvas = document.getElementById('membership-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const monthlyJoins = Array(12).fill(0);
    
    sampleData.members.forEach(member => {
        if (member.joinDate) {
            const month = new Date(member.joinDate).getMonth();
            monthlyJoins[month]++;
        }
    });
    
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    drawLineChart(ctx, monthlyJoins, months, '#f59e0b');
    
    document.getElementById('membership-summary').textContent = 
        `${sampleData.members.length} aktif üye, bu yıl ${monthlyJoins.reduce((sum, val) => sum + val, 0)} yeni katılım`;
}

function drawBarChart(ctx, data, labels, color) {
    const maxValue = Math.max(...data);
    const barWidth = ctx.canvas.width / data.length - 10;
    const barMaxHeight = ctx.canvas.height - 40;
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = color;
    
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * barMaxHeight;
        const x = index * (barWidth + 10) + 5;
        const y = ctx.canvas.height - barHeight - 20;
        
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Labels
        ctx.fillStyle = '#374151';
        ctx.font = '10px Arial';
        ctx.fillText(value.toString(), x + barWidth/2 - 10, y - 5);
        ctx.fillStyle = color;
    });
}

function drawPieChart(ctx, data, labels, colors) {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const total = data.reduce((sum, val) => sum + val, 0);
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    let currentAngle = 0;
    data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = colors[index];
        ctx.fill();
        
        currentAngle += sliceAngle;
    });
}

function drawLineChart(ctx, data, labels, color) {
    const maxValue = Math.max(...data);
    const stepX = ctx.canvas.width / (data.length - 1);
    const stepY = (ctx.canvas.height - 40) / maxValue;
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = index * stepX;
        const y = ctx.canvas.height - (value * stepY) - 20;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
}

function generateCustomReport() {
    const content = `
        <div class="custom-report">
            <h3>Özel Rapor Oluştur</h3>
            <div class="report-options">
                <div class="option-group">
                    <label>Rapor Türü:</label>
                    <select id="report-type">
                        <option value="events">Etkinlik Analizi</option>
                        <option value="budget">Bütçe Raporu</option>
                        <option value="social">Sosyal Medya Raporu</option>
                        <option value="membership">Üyelik Raporu</option>
                    </select>
                </div>
                <div class="option-group">
                    <label>Tarih Aralığı:</label>
                    <input type="date" id="custom-date-from">
                    <input type="date" id="custom-date-to">
                </div>
                <div class="option-group">
                    <label>Format:</label>
                    <select id="report-format">
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                    </select>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="generateReport()">Rapor Oluştur</button>
                <button class="btn btn-secondary" onclick="closeModal()">İptal</button>
            </div>
        </div>
    `;
    
    createModal('Özel Rapor', content);
}

function generateReport() {
    const type = document.getElementById('report-type').value;
    const dateFrom = document.getElementById('custom-date-from').value;
    const dateTo = document.getElementById('custom-date-to').value;
    const format = document.getElementById('report-format').value;
    
    console.log('Generating report:', { type, dateFrom, dateTo, format });
    closeModal();
    alert(`${type} raporu ${format} formatında oluşturuluyor...`);
}

function exportReportData() {
    const reportData = {
        events: sampleData.events,
        budget: sampleData.budgetLogs,
        social: sampleData.socialMediaPosts,
        members: sampleData.members
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `subu-asto-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
}

function updateReports() {
    loadReportsData();
    alert('Raporlar güncellendi!');
}

function viewDocument(id) {
    alert(`Belge ${id} görüntüleniyor`);
}

function downloadDocument(id) {
    alert(`Belge ${id} indiriliyor`);
}

function editMember(id) {
    alert(`Üye ${id} düzenleme formu açılacak`);
}


// Task helper functions
function getDepartmentName(departmentId) {
    const departments = {
        1: 'Yönetim',
        2: 'Sosyal Medya',
        3: 'Organizasyon',
        4: 'Teknik',
        5: 'Eğitim'
    };
    return departments[departmentId] || '';
}

function getPriorityText(priority) {
    const priorities = {
        'dusuk': 'Düşük',
        'orta': 'Orta',
        'yuksek': 'Yüksek',
        'acil': 'Acil'
    };
    return priorities[priority] || priority;
}

function formatTaskDate(dateString) {
    if (!dateString) return 'Belirsiz';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function isTaskOverdue(dateString) {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const now = new Date();
    return dueDate < now;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function scheduleTaskReminder(taskId, reminderDate) {
    const reminderTime = new Date(reminderDate);
    const now = new Date();
    const delay = reminderTime.getTime() - now.getTime();
    
    if (delay > 0) {
        setTimeout(() => {
            showNotification(`Görev hatırlatması: ${sampleData.tasks.find(t => t.id === taskId)?.title}`, 'warning');
        }, delay);
    }
}

// Drag and drop functions for kanban
function allowDrop(event) {
    event.preventDefault();
}

function dragTask(event) {
    event.dataTransfer.setData("text", event.target.dataset.taskId);
}

function dropTask(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text");
    const newStatus = event.currentTarget.closest('.kanban-column').dataset.status;
    
    updateTaskStatus(parseInt(taskId), newStatus);
}

async function updateTaskStatus(taskId, newStatus) {
    try {
        const response = await fetch('/api/tasks.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: taskId,
                status: newStatus
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update local data
            const task = sampleData.tasks.find(t => t.id === taskId);
            if (task) {
                task.status = newStatus;
                if (newStatus === 'tamamlandi') {
                    task.completed_at = new Date().toISOString();
                }
            }
            
            loadTasksKanban();
            showNotification('Görev durumu güncellendi', 'success');
        }
    } catch (error) {
        console.error('Task status update error:', error);
        // Fallback update for demo
        const task = sampleData.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            loadTasksKanban();
        }
    }
}

function editTask(taskId) {
    const task = sampleData.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Populate form with existing data
    document.querySelector('[name="title"]').value = task.title;
    document.querySelector('[name="description"]').value = task.description || '';
    document.querySelector('[name="assigned_to"]').value = task.assigned_to || task.assignedTo;
    document.querySelector('[name="department_id"]').value = task.department_id;
    document.querySelector('[name="due_date"]').value = task.due_date || task.dueDate;
    document.querySelector('[name="reminder_at"]').value = task.reminder_at;
    document.querySelector('[name="priority"]').value = task.priority;
    document.querySelector('[name="estimated_hours"]').value = task.estimated_hours;
    
    if (task.tags) {
        const tags = typeof task.tags === 'string' ? JSON.parse(task.tags) : task.tags;
        document.querySelector('[name="tags"]').value = tags.join(', ');
    }
    
    // Change form to edit mode
    document.querySelector('#task-modal h3').textContent = 'Görevi Düzenle';
    document.querySelector('#task-form').dataset.editId = taskId;
    
    showTaskCreationModal();
}

function deleteTask(taskId) {
    if (!confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    sampleData.tasks = sampleData.tasks.filter(t => t.id !== taskId);
    loadTasksKanban();
    showNotification('Görev silindi', 'success');
}

function viewTaskDetail(taskId) {
    const task = sampleData.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const assignedUser = sampleData.members.find(m => m.id === (task.assigned_to || task.assignedTo));
    const departmentName = getDepartmentName(task.department_id);
    
    const content = `
        <div class="task-detail">
            <h3>${task.title}</h3>
            <div class="task-info">
                <p><strong>Açıklama:</strong> ${task.description || 'Açıklama yok'}</p>
                <p><strong>Atanan:</strong> ${assignedUser ? assignedUser.name : 'Atanmamış'}</p>
                <p><strong>Birim:</strong> ${departmentName || 'Belirsiz'}</p>
                <p><strong>Durum:</strong> ${task.status}</p>
                <p><strong>Öncelik:</strong> ${getPriorityText(task.priority)}</p>
                <p><strong>Bitiş Tarihi:</strong> ${formatTaskDate(task.due_date || task.dueDate)}</p>
                ${task.estimated_hours ? `<p><strong>Tahmini Süre:</strong> ${task.estimated_hours} saat</p>` : ''}
                ${task.tags ? `<p><strong>Etiketler:</strong> ${JSON.parse(task.tags).map(tag => '#' + tag).join(', ')}</p>` : ''}
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="editTask(${taskId}); closeModal();">Düzenle</button>
                <button class="btn btn-danger" onclick="deleteTask(${taskId}); closeModal();">Sil</button>
                <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
            </div>
        </div>
    `;
    
    createModal('Görev Detayları', content);
}
