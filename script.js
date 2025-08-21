
// Global variables
let currentUser = {
    email: 'admin@subuasto.edu.tr',
    role: 'başkan'
};

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const dashboardCards = document.querySelectorAll('.dashboard-card.expandable');

// Sample data
const sampleData = {
    events: [
        { id: 1, title: 'Geminids Meteor Yağmuru', date: '2024-12-13', location: 'Uludağ Gözlemevi', status: 'active', sponsor: 'ABC Optik', type: 'gozlem' },
        { id: 2, title: 'Mars Karşıtlığı Gözlemi', date: '2024-12-20', location: 'Kampüs', status: 'planning', sponsor: 'TÜBİTAK', type: 'gozlem' },
        { id: 3, title: 'Astronomi Semineri', date: '2024-12-25', location: 'Konferans Salonu', status: 'active', sponsor: '', type: 'seminer' }
    ],
    socialMediaPosts: [
        { id: 1, title: 'Mars Karşıtlığı Paylaşımı', platform: 'Instagram & TikTok', status: 'taslak', author: 'Ahmet Y.' },
        { id: 2, title: 'Geminids Duyurusu', platform: 'Tüm Platformlar', status: 'planlandi', scheduledDate: '2024-12-10' },
        { id: 3, title: 'Satürn Halkaları', platform: 'YouTube Video', status: 'yayinlandi', views: '1.2K' }
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
        { id: 1, name: 'Ahmet Yılmaz', role: 'başkan', status: 'active' },
        { id: 2, name: 'Zeynep Kaya', role: 'mentor', status: 'active' },
        { id: 3, name: 'Mehmet Demir', role: 'üye', status: 'active' },
        { id: 4, name: 'Ayşe Çelik', role: 'üye', status: 'active' }
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

function viewDocument(id) {
    alert(`Belge ${id} görüntüleniyor`);
}

function downloadDocument(id) {
    alert(`Belge ${id} indiriliyor`);
}

function editMember(id) {
    alert(`Üye ${id} düzenleme formu açılacak`);
}
