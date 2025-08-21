
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
        { id: 1, title: 'Geminids Meteor Yağmuru', date: '2024-12-13', location: 'Uludağ Gözlemevi', status: 'active' },
        { id: 2, title: 'Mars Karşıtlığı Gözlemi', date: '2024-12-20', location: 'Kampüs', status: 'planning' },
        { id: 3, title: 'Astronomi Semineri', date: '2024-12-25', location: 'Konferans Salonu', status: 'active' }
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
            console.log('Loading social media content...');
            break;
        case 'events':
            console.log('Loading events data...');
            break;
        case 'members':
            console.log('Loading members...');
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
    
    switch(action) {
        case 'view_members':
            return highLevelRoles.includes(userRole);
        case 'edit_members':
            return highLevelRoles.includes(userRole);
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
