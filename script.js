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
    ],
    projects: [
        { id: 1, name: 'Mobil Gözlemevi Projesi', type: 'Donanım', budget_total: 30000, budget_used: 25000, partners: JSON.stringify(['TÜBİTAK', 'XYZ Teknoloji']) },
        { id: 2, name: 'Web Sitesi Yenileme', type: 'Yazılım', budget_total: 15000, budget_used: 10000, partners: JSON.stringify(['ABC Yazılım']) }
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
    setupProjectFilters();

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
    const activeProjectsCard = document.querySelector('[data-type="projects"] .card-count');

    if (upcomingEventsCard) upcomingEventsCard.textContent = sampleData.events.length;
    if (pendingDocsCard) pendingDocsCard.textContent = sampleData.documents.filter(d => d.status === 'pending').length;
    if (activeMembersCard) activeMembersCard.textContent = sampleData.members.filter(m => m.status === 'active').length;
    if (activeProjectsCard) activeProjectsCard.textContent = sampleData.projects.length;
}

function loadCardData(type) {
    const list = document.getElementById(`${type === 'events' ? 'upcoming-events' : type === 'documents' ? 'pending-approvals' : type === 'members' ? 'active-members' : 'active-projects'}-list`);

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
        case 'projects':
            items = sampleData.projects;
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
            case 'projects':
                const partners = JSON.parse(item.partners || '[]');
                return `
                    <div class="list-item" onclick="openProjectDetail(${item.id})">
                        <h4>${item.name}</h4>
                        <p>Tür: ${item.type}</p>
                        <p>Bütçe: ₺${item.budget_used} / ₺${item.budget_total}</p>
                        <p>Ortaklar: ${partners.length > 0 ? partners.join(', ') : 'Belirtilmemiş'}</p>
                    </div>
                `;
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
        case 'documents':
            loadDocuments();
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
        case 'projects':
            loadProjectsData();
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
    const content = `
        <div class="event-form">
            <form id="event-form">
                <div class="form-group">
                    <label>Etkinlik Başlığı: *</label>
                    <input type="text" name="title" required placeholder="Etkinlik adını girin">
                </div>
                <div class="form-group">
                    <label>Açıklama:</label>
                    <textarea name="description" rows="3" placeholder="Etkinlik detaylarını açıklayın"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Etkinlik Türü: *</label>
                        <select name="event_type" required>
                            <option value="">Tür seçin...</option>
                            <option value="gozlem">Gözlem</option>
                            <option value="seminer">Seminer</option>
                            <option value="atolye">Atölye</option>
                            <option value="sosyal">Sosyal</option>
                            <option value="konferans">Konferans</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Konum:</label>
                        <input type="text" name="location" placeholder="Etkinlik yeri">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Başlangıç Tarihi: *</label>
                        <input type="datetime-local" name="start_date" required>
                    </div>
                    <div class="form-group">
                        <label>Bitiş Tarihi:</label>
                        <input type="datetime-local" name="end_date">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Maksimum Katılımcı:</label>
                        <input type="number" name="max_participants" min="1" placeholder="Örn: 30">
                    </div>
                    <div class="form-group">
                        <label>Bütçe (₺):</label>
                        <input type="number" name="budget" min="0" step="0.01" placeholder="0.00">
                    </div>
                </div>
                <div class="form-group">
                    <label>Sponsor Firma:</label>
                    <input type="text" name="sponsor_company" placeholder="Sponsor firma adı">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Etkinlik Oluştur</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                </div>
            </form>
        </div>
    `;

    createModal('Yeni Etkinlik Oluştur', content);
    setupEventForm();
}

function setupEventForm() {
    const form = document.getElementById('event-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const isEdit = this.dataset.editId;
            if (isEdit) {
                updateEventData(new FormData(this), isEdit);
            } else {
                createEventData(new FormData(this));
            }
        });
    }
}

async function createEventData(formData) {
    const eventData = {
        title: formData.get('title'),
        description: formData.get('description'),
        event_type: formData.get('event_type'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        location: formData.get('location'),
        max_participants: formData.get('max_participants') || null,
        sponsor_company: formData.get('sponsor_company'),
        budget: formData.get('budget') || 0,
        created_by: currentUser.id || 1
    };

    // Validation
    if (!eventData.title || !eventData.event_type || !eventData.start_date) {
        alert('Lütfen zorunlu alanları doldurun (Başlık, Tür, Başlangıç Tarihi)');
        return;
    }

    // Check if start date is in the future
    const startDate = new Date(eventData.start_date);
    const now = new Date();
    if (startDate <= now) {
        alert('Başlangıç tarihi gelecekte bir tarih olmalıdır');
        return;
    }

    // Check end date if provided
    if (eventData.end_date) {
        const endDate = new Date(eventData.end_date);
        if (endDate <= startDate) {
            alert('Bitiş tarihi başlangıç tarihinden sonra olmalıdır');
            return;
        }
    }

    try {
        const response = await fetch('/api/events.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        const result = await response.json();

        if (result.success) {
            // Add to local data for immediate UI update
            const newEvent = {
                id: result.id,
                ...eventData,
                status: 'taslak',
                participants: 0
            };
            sampleData.events.push(newEvent);

            closeModal();
            filterEvents(); // Refresh events list
            showNotification('Etkinlik başarıyla oluşturuldu!', 'success');
        } else {
            alert('Etkinlik oluşturulurken hata: ' + result.message);
        }
    } catch (error) {
        console.error('Event creation error:', error);

        // Fallback: Add to local data for demo purposes
        const newEvent = {
            id: Date.now(),
            ...eventData,
            status: 'taslak',
            participants: 0
        };
        sampleData.events.push(newEvent);

        closeModal();
        filterEvents();
        showNotification('Etkinlik oluşturuldu (demo modu)', 'success');
    }
}

async function updateEventData(formData, eventId) {
    const eventData = {
        id: parseInt(eventId),
        title: formData.get('title'),
        description: formData.get('description'),
        event_type: formData.get('event_type'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        location: formData.get('location'),
        max_participants: formData.get('max_participants') || null,
        sponsor_company: formData.get('sponsor_company'),
        budget: formData.get('budget') || 0
    };

    // Validation
    if (!eventData.title || !eventData.event_type || !eventData.start_date) {
        alert('Lütfen zorunlu alanları doldurun');
        return;
    }

    try {
        const response = await fetch('/api/events.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        const result = await response.json();

        if (result.success) {
            // Update local data
            const eventIndex = sampleData.events.findIndex(e => e.id === parseInt(eventId));
            if (eventIndex !== -1) {
                sampleData.events[eventIndex] = { ...sampleData.events[eventIndex], ...eventData };
            }

            closeModal();
            filterEvents(); // Refresh events list
            showNotification('Etkinlik başarıyla güncellendi!', 'success');
        } else {
            alert('Etkinlik güncellenirken hata: ' + result.message);
        }
    } catch (error) {
        console.error('Event update error:', error);

        // Fallback: Update local data
        const eventIndex = sampleData.events.findIndex(e => e.id === parseInt(eventId));
        if (eventIndex !== -1) {
            sampleData.events[eventIndex] = { ...sampleData.events[eventIndex], ...eventData };
            filterEvents();
            showNotification('Etkinlik güncellendi (demo modu)', 'success');
        }
        closeModal();
    }
}

function showNewSocialMediaForm() {
    alert('Yeni sosyal medya içeriği ekleme formu açılacak');
}

function showNewDocumentForm() {
    alert('Yeni belge ekleme formu açılacak');
}

function showNewProjectForm() {
    const content = `
        <div class="project-form">
            <form id="project-form">
                <div class="form-group">
                    <label>Proje Adı: *</label>
                    <input type="text" name="name" required placeholder="Proje adını girin">
                </div>
                <div class="form-group">
                    <label>Açıklama:</label>
                    <textarea name="description" rows="3" placeholder="Proje detaylarını açıklayın"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Proje Türü:</label>
                        <input type="text" name="type" placeholder="Örn: Donanım, Yazılım, Araştırma">
                    </div>
                    <div class="form-group">
                        <label>Bütçe (₺): *</label>
                        <input type="number" name="budget_total" min="0" step="0.01" required placeholder="0.00">
                    </div>
                </div>
                <div class="form-group">
                    <label>Ortaklar (virgülle ayrılmış):</label>
                    <input type="text" name="partners" placeholder="Örn: TÜBİTAK, XYZ Teknoloji">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Projeyi Oluştur</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                </div>
            </form>
        </div>
    `;

    createModal('Yeni Proje Oluştur', content);
    setupProjectForm();
}

function setupProjectForm() {
    const form = document.getElementById('project-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const isEdit = this.dataset.editId;
            if (isEdit) {
                updateProjectData(new FormData(this), isEdit);
            } else {
                createProjectData(new FormData(this));
            }
        });
    }
}

async function createProjectData(formData) {
    const partners = formData.get('partners').split(',').map(p => p.trim()).filter(p => p);

    const projectData = {
        name: formData.get('name'),
        description: formData.get('description'),
        type: formData.get('type'),
        budget_total: parseFloat(formData.get('budget_total')) || 0,
        budget_used: 0, // Initially 0, will be updated
        partners: JSON.stringify(partners),
        created_by: currentUser.id || 1
    };

    // Validation
    if (!projectData.name || projectData.budget_total === 0) {
        alert('Lütfen Proje Adı ve Bütçe alanlarını doldurun.');
        return;
    }

    try {
        const response = await fetch('/api/projects.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });

        const result = await response.json();

        if (result.success) {
            const newProject = {
                id: result.id,
                ...projectData,
                budget_used: 0,
                partners: JSON.stringify(partners)
            };
            sampleData.projects.push(newProject);

            closeModal();
            loadProjectsData(); // Refresh projects list
            showNotification('Proje başarıyla oluşturuldu!', 'success');
        } else {
            alert('Proje oluşturulurken hata: ' + result.message);
        }
    } catch (error) {
        console.error('Project creation error:', error);
        // Fallback for demo
        const newProject = {
            id: Date.now(),
            ...projectData,
            budget_used: 0,
            partners: JSON.stringify(partners)
        };
        sampleData.projects.push(newProject);
        closeModal();
        loadProjectsData();
        showNotification('Proje oluşturuldu (demo modu)', 'success');
    }
}

async function updateProjectData(formData, projectId) {
    const partners = formData.get('partners').split(',').map(p => p.trim()).filter(p => p);

    const projectData = {
        id: parseInt(projectId),
        name: formData.get('name'),
        description: formData.get('description'),
        type: formData.get('type'),
        budget_total: parseFloat(formData.get('budget_total')) || 0,
        partners: JSON.stringify(partners)
    };

    // Validation
    if (!projectData.name || projectData.budget_total === 0) {
        alert('Lütfen Proje Adı ve Bütçe alanlarını doldurun.');
        return;
    }

    try {
        const response = await fetch('/api/projects.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });

        const result = await response.json();

        if (result.success) {
            const projectIndex = sampleData.projects.findIndex(p => p.id === parseInt(projectId));
            if (projectIndex !== -1) {
                sampleData.projects[projectIndex] = { ...sampleData.projects[projectIndex], ...projectData };
            }

            closeModal();
            loadProjectsData(); // Refresh projects list
            showNotification('Proje başarıyla güncellendi!', 'success');
        } else {
            alert('Proje güncellenirken hata: ' + result.message);
        }
    } catch (error) {
        console.error('Project update error:', error);
        // Fallback for demo
        const projectIndex = sampleData.projects.findIndex(p => p.id === parseInt(projectId));
        if (projectIndex !== -1) {
            sampleData.projects[projectIndex] = { ...sampleData.projects[projectIndex], ...projectData };
            loadProjectsData();
            showNotification('Proje güncellendi (demo modu)', 'success');
        }
        closeModal();
    }
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
    const project = sampleData.projects.find(p => p.id === id);
    if (!project) return;

    const partners = JSON.parse(project.partners || '[]');
    const progress = project.budget_total > 0 ? (project.budget_used / project.budget_total) * 100 : 0;

    const content = `
        <div class="detail-content">
            <h3>${project.name}</h3>
            <p><strong>Tür:</strong> ${project.type || 'Belirtilmemiş'}</p>
            <p><strong>Bütçe:</strong> ₺${project.budget_used.toLocaleString()} / ₺${project.budget_total.toLocaleString()}</p>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${progress}%;"></div>
            </div>
            <p><strong>İlerleme:</strong> ${progress.toFixed(1)}%</p>
            <p><strong>Ortaklar:</strong> ${partners.length > 0 ? partners.join(', ') : 'Belirtilmemiş'}</p>
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

    const event = sampleData.events.find(e => e.id === id);
    if (!event) {
        alert('Etkinlik bulunamadı');
        return;
    }

    const content = `
        <div class="event-form">
            <form id="event-form">
                <div class="form-group">
                    <label>Etkinlik Başlığı: *</label>
                    <input type="text" name="title" required placeholder="Etkinlik adını girin" value="${event.title}">
                </div>
                <div class="form-group">
                    <label>Açıklama:</label>
                    <textarea name="description" rows="3" placeholder="Etkinlik detaylarını açıklayın">${event.description || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Etkinlik Türü: *</label>
                        <select name="event_type" required>
                            <option value="">Tür seçin...</option>
                            <option value="gozlem" ${event.type === 'gozlem' ? 'selected' : ''}>Gözlem</option>
                            <option value="seminer" ${event.type === 'seminer' ? 'selected' : ''}>Seminer</option>
                            <option value="atolye" ${event.type === 'atolye' ? 'selected' : ''}>Atölye</option>
                            <option value="sosyal" ${event.type === 'sosyal' ? 'selected' : ''}>Sosyal</option>
                            <option value="konferans" ${event.type === 'konferans' ? 'selected' : ''}>Konferans</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Konum:</label>
                        <input type="text" name="location" placeholder="Etkinlik yeri" value="${event.location || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Başlangıç Tarihi: *</label>
                        <input type="datetime-local" name="start_date" required value="${formatDateTimeForInput(event.date)}">
                    </div>
                    <div class="form-group">
                        <label>Bitiş Tarihi:</label>
                        <input type="datetime-local" name="end_date" value="${event.end_date ? formatDateTimeForInput(event.end_date) : ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Maksimum Katılımcı:</label>
                        <input type="number" name="max_participants" min="1" placeholder="Örn: 30" value="${event.max_participants || ''}">
                    </div>
                    <div class="form-group">
                        <label>Bütçe (₺):</label>
                        <input type="number" name="budget" min="0" step="0.01" placeholder="0.00" value="${event.budget || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Sponsor Firma:</label>
                    <input type="text" name="sponsor_company" placeholder="Sponsor firma adı" value="${event.sponsor || ''}">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Etkinliği Güncelle</button>
                    <button type="button" class="btn btn-danger" onclick="deleteEventConfirm(${id})">Sil</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                </div>
            </form>
        </div>
    `;

    createModal('Etkinlik Düzenle', content);

    // Set form to edit mode
    const form = document.getElementById('event-form');
    if (form) {
        form.dataset.editId = id;
        setupEventForm();
    }
}

function formatDateTimeForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
}

async function deleteEventConfirm(id) {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
        return;
    }

    try {
        const response = await fetch(`/api/events.php?id=${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            // Remove from local data
            sampleData.events = sampleData.events.filter(e => e.id !== id);

            closeModal();
            filterEvents(); // Refresh events list
            showNotification('Etkinlik silindi', 'success');
        } else {
            alert('Etkinlik silinirken hata: ' + result.message);
        }
    } catch (error) {
        console.error('Event delete error:', error);

        // Fallback: Remove from local data
        sampleData.events = sampleData.events.filter(e => e.id !== id);
        closeModal();
        filterEvents();
        showNotification('Etkinlik silindi (demo modu)', 'success');
    }
}

function editDocument(id) {
    closeModal();
    alert(`Belge ${id} düzenleme formu açılacak`);
}

function editProject(id) {
    closeModal();

    const project = sampleData.projects.find(p => p.id === id);
    if (!project) {
        alert('Proje bulunamadı');
        return;
    }

    const partners = JSON.parse(project.partners || '[]');

    const content = `
        <div class="project-form">
            <form id="project-form">
                <div class="form-group">
                    <label>Proje Adı: *</label>
                    <input type="text" name="name" required placeholder="Proje adını girin" value="${project.name}">
                </div>
                <div class="form-group">
                    <label>Açıklama:</label>
                    <textarea name="description" rows="3" placeholder="Proje detaylarını açıklayın">${project.description || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Proje Türü:</label>
                        <input type="text" name="type" placeholder="Örn: Donanım, Yazılım, Araştırma" value="${project.type || ''}">
                    </div>
                    <div class="form-group">
                        <label>Bütçe (₺): *</label>
                        <input type="number" name="budget_total" min="0" step="0.01" required placeholder="0.00" value="${project.budget_total}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Ortaklar (virgülle ayrılmış):</label>
                    <input type="text" name="partners" placeholder="Örn: TÜBİTAK, XYZ Teknoloji" value="${partners.join(', ')}">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Projeyi Güncelle</button>
                    <button type="button" class="btn btn-danger" onclick="deleteProjectConfirm(${id})">Sil</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                </div>
            </form>
        </div>
    `;

    createModal('Proje Düzenle', content);

    // Set form to edit mode
    const form = document.getElementById('project-form');
    if (form) {
        form.dataset.editId = id;
        setupProjectForm();
    }
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

    // Load initial events and sponsors
    loadEventsData();
    loadSponsorsForFilter();
}

async function filterEvents() {
    const typeFilter = document.getElementById('event-type-filter')?.value || '';
    const monthFilter = document.getElementById('event-month-filter')?.value || '';
    const sponsorFilter = document.getElementById('event-sponsor-filter')?.value || '';
    const searchTerm = document.getElementById('event-search')?.value || '';

    try {
        const params = new URLSearchParams({
            type: typeFilter,
            month: monthFilter,
            sponsor: sponsorFilter,
            search: searchTerm
        });

        const response = await fetch(`/api/events.php?${params}`);
        const data = await response.json();

        if (data.success) {
            displayFilteredEvents(data.events);
        } else {
            console.error('Events filtering error:', data.message);
            displayFilteredEvents(sampleData.events);
        }
    } catch (error) {
        console.error('Events API error:', error);
        // Fallback to sample data
        let filteredEvents = sampleData.events.filter(event => {
            const matchesType = !typeFilter || event.type === typeFilter;
            const matchesMonth = !monthFilter || new Date(event.date).getMonth() + 1 == monthFilter;
            const matchesSponsor = !sponsorFilter || event.sponsor === sponsorFilter;
            const matchesSearch = !searchTerm || event.title.toLowerCase().includes(searchTerm);

            return matchesType && matchesMonth && matchesSponsor && matchesSearch;
        });
        displayFilteredEvents(filteredEvents);
    }
}

async function loadSponsorsForFilter() {
    try {
        const response = await fetch('/api/events.php');
        const data = await response.json();

        if (data.success && data.sponsors) {
            const sponsorFilter = document.getElementById('event-sponsor-filter');
            if (sponsorFilter) {
                // Clear existing options except first
                sponsorFilter.innerHTML = '<option value="">Tüm Sponsorlar</option>';

                data.sponsors.forEach(sponsor => {
                    const option = document.createElement('option');
                    option.value = sponsor;
                    option.textContent = sponsor;
                    sponsorFilter.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Error loading sponsors:', error);
    }
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
async function exportToCalendar() {
    try {
        const response = await fetch('/api/events.php?export=ics');

        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'subu-asto-etkinlikler.ics';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            // Fallback to client-side generation
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
    } catch (error) {
        console.error('Calendar export error:', error);
        alert('Takvim dışa aktarılırken hata oluştu');
    }
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

    // Load sky events for current month
    loadSkyCalendarEvents();
}

async function loadSkyCalendarEvents() {
    try {
        const currentDate = new Date();
        const params = new URLSearchParams({
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
        });

        const response = await fetch(`/api/sky_events.php?${params}`);
        const data = await response.json();

        if (data.success) {
            updateCalendarWithSkyEvents(data.events);
        }
    } catch (error) {
        console.error('Sky events loading error:', error);
    }
}

function updateCalendarWithSkyEvents(events) {
    // Clear existing event indicators
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('has-event');
        const existingDot = day.querySelector('.event-dot');
        if (existingDot) existingDot.remove();
    });

    // Add event indicators
    events.forEach(event => {
        const eventDate = new Date(event.event_date);
        const dayNumber = eventDate.getDate();
        const dayElement = document.querySelector(`.calendar-day:nth-child(${dayNumber + 6})`); // Adjust for header

        if (dayElement) {
            dayElement.classList.add('has-event');
            dayElement.setAttribute('data-id', event.id);

            const eventDot = document.createElement('div');
            eventDot.className = 'event-dot';
            eventDot.textContent = getEventTypeIcon(event.event_type);
            dayElement.appendChild(eventDot);
        }
    });
}

function getEventTypeIcon(eventType) {
    const icons = {
        'dolunay': '🌕',
        'yeniay': '🌑',
        'tutulma': '🌘',
        'meteor_yagmuru': '🌟',
        'gezegen_yakinlasma': '🪐',
        'komedi': '☄️',
        'diger': '🌌'
    };
    return icons[eventType] || '🌌';
}

async function openSkyEventDetail(id) {
    try {
        const response = await fetch(`/api/sky_events.php?id=${id}`);
        const data = await response.json();

        if (data.success) {
            const event = data.event;
            const content = `
                <div class="detail-content">
                    <h3>${event.event_name}</h3>
                    <p><strong>Tarih:</strong> ${formatDate(event.event_date)}</p>
                    <p><strong>Tür:</strong> ${getEventTypeText(event.event_type)}</p>
                    <p><strong>Görünürlük Zamanı:</strong> ${event.visibility_time || 'Belirsiz'}</p>
                    <p><strong>Zorluk:</strong> ${getDifficultyText(event.observation_difficulty)}</p>
                    ${event.description ? `<p><strong>Açıklama:</strong> ${event.description}</p>` : ''}
                    ${event.required_equipment ? `<p><strong>Gerekli Ekipman:</strong> ${event.required_equipment}</p>` : ''}
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="editSkyEvent(${id})">Düzenle</button>
                        <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
                    </div>
                </div>
            `;

            createModal('Gök Olayı Detayları', content);
        } else {
            alert('Gök olayı bulunamadı');
        }
    } catch (error) {
        console.error('Sky event detail error:', error);
        // Fallback to sample data
        const event = sampleData.skyEvents.find(e => e.id == id);
        if (event) {
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
    }
}

function getEventTypeText(eventType) {
    const types = {
        'dolunay': 'Dolunay',
        'yeniay': 'Yeniay',
        'tutulma': 'Tutulma',
        'meteor_yagmuru': 'Meteor Yağmuru',
        'gezegen_yakinlasma': 'Gezegen Yakınlaşması',
        'komedi': 'Kuyruklu Yıldız',
        'diger': 'Diğer'
    };
    return types[eventType] || eventType;
}

function getDifficultyText(difficulty) {
    const difficulties = {
        'kolay': 'Kolay',
        'orta': 'Orta',
        'zor': 'Zor'
    };
    return difficulties[difficulty] || difficulty;
}

// Document approval functions
async function approveDocument(id) {
    if (!hasPermission('approve_documents')) {
        alert('Bu işlem için yetkiniz bulunmamaktadır.');
        return;
    }

    if (!confirm('Bu belgeyi onaylamak istediğinizden emin misiniz?')) {
        return;
    }

    try {
        const formData = new FormData();
        formData.append('action', 'approve');
        formData.append('document_id', id);

        const response = await fetch('/api/documents.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Belge başarıyla onaylandı!', 'success');
            loadDocuments(); // Belge listesini yenile
        } else {
            alert('Hata: ' + result.message);
        }
    } catch (error) {
        console.error('Onaylama hatası:', error);
        alert('Onaylama sırasında bir hata oluştu.');
    }
}

async function rejectDocument(id) {
    if (!hasPermission('approve_documents')) {
        alert('Bu işlem için yetkiniz bulunmamaktadır.');
        return;
    }

    const reason = prompt('Red nedeni:');
    if (!reason) {
        return;
    }

    try {
        const formData = new FormData();
        formData.append('action', 'reject');
        formData.append('document_id', id);
        formData.append('reason', reason);

        const response = await fetch('/api/documents.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Belge reddedildi.', 'info');
            loadDocuments(); // Belge listesini yenile
        } else {
            alert('Hata: ' + result.message);
        }
    } catch (error) {
        console.error('Reddetme hatası:', error);
        alert('Reddetme sırasında bir hata oluştu.');
    }
}

async function submitDocumentForApproval(id) {
    if (!confirm('Bu belgeyi onaya göndermek istediğinizden emin misiniz?')) {
        return;
    }

    try {
        const formData = new FormData();
        formData.append('action', 'submit_for_approval');
        formData.append('document_id', id);

        const response = await fetch('/api/documents.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Belge onaya gönderildi!', 'success');
            loadDocuments();
        } else {
            alert('Hata: ' + result.message);
        }
    } catch (error) {
        console.error('Onaya gönderme hatası:', error);
        alert('İşlem sırasında bir hata oluştu.');
    }
}

async function loadDocuments() {
    try {
        const categoryFilter = document.getElementById('document-category-filter')?.value || '';
        const statusFilter = document.getElementById('document-status-filter')?.value || '';

        const params = new URLSearchParams({
            category: categoryFilter,
            status: statusFilter
        });

        const response = await fetch(`/api/documents.php?${params}`);
        const result = await response.json();

        if (result.success) {
            displayDocuments(result.data, result.user_role, result.can_approve_any);
        } else {
            console.error('Belge yükleme hatası:', result.error);
            // Fallback olarak örnek veriyi göster
            displayDocuments(sampleData.documents, 'başkan', true);
        }
    } catch (error) {
        console.error('Belgeler API hatası:', error);
        displayDocuments(sampleData.documents, 'başkan', true);
    }
}

function displayDocuments(documents, userRole, canApproveAny) {
    const grid = document.querySelector('#documents .content-grid');
    if (!grid) return;

    if (documents.length === 0) {
        grid.innerHTML = '<div class="empty-state">Belge bulunamadı.</div>';
        return;
    }

    grid.innerHTML = documents.map(document => {
        const statusClass = getDocumentStatusClass(document.approval_status || document.status);
        const statusText = getDocumentStatusText(document.approval_status || document.status);
        const canApprove = document.can_approve && canApproveAny;
        const canView = document.can_view !== false;

        if (!canView) {
            return ''; // Bu belgeyi gösterme
        }

        return `
            <div class="card document-card" data-status="${document.status}" data-approval="${document.approval_status}">
                <div class="document-icon">📄</div>
                <h3>${document.title}</h3>
                <p><strong>Kategori:</strong> ${document.document_type}</p>
                <p><strong>Durum:</strong> <span class="status ${statusClass}">${statusText}</span></p>
                <p><strong>Yükleyen:</strong> ${document.uploader_name || 'Bilinmiyor'}</p>
                ${document.approved_by ? `<p><strong>Onaylayan:</strong> ${document.approver_name}</p>` : ''}
                ${document.approved_at ? `<p><strong>Onay Tarihi:</strong> ${formatDate(document.approved_at)}</p>` : ''}
                ${document.rejection_reason ? `<p><strong>Red Nedeni:</strong> ${document.rejection_reason}</p>` : ''}
                <div class="card-actions">
                    <button class="btn btn-sm" onclick="viewDocument(${document.id})">İncele</button>
                    <button class="btn btn-sm btn-outline" onclick="downloadDocument(${document.id})">İndir</button>
                    ${canApprove && document.approval_status === 'bekliyor' ? `
                        <button class="btn btn-sm btn-success" onclick="approveDocument(${document.id})">✓ Onayla</button>
                        <button class="btn btn-sm btn-danger" onclick="rejectDocument(${document.id})">✗ Reddet</button>
                    ` : ''}
                    ${(document.uploaded_by == (currentUser.id || 1)) && document.status === 'taslak' ? `
                        <button class="btn btn-sm btn-primary" onclick="submitDocumentForApproval(${document.id})">Onaya Gönder</button>
                    ` : ''}
                    ${(document.uploaded_by == (currentUser.id || 1)) || userRole === 'başkan' ? `
                        <button class="btn btn-sm btn-secondary" onclick="editDocument(${document.id})">Düzenle</button>
                    ` : ''}
                </div>
            </div>
        `;
    }).filter(html => html).join('');
}

function getDocumentStatusClass(status) {
    const classes = {
        'bekliyor': 'pending',
        'onay_bekliyor': 'pending',
        'onaylandi': 'approved',
        'reddedildi': 'rejected',
        'yayinlandi': 'published',
        'taslak': 'draft'
    };
    return classes[status] || 'pending';
}

function getDocumentStatusText(status) {
    const texts = {
        'bekliyor': 'Onay Bekliyor',
        'onay_bekliyor': 'Onay Bekliyor',
        'onaylandi': 'Onaylandı',
        'reddedildi': 'Reddedildi',
        'yayinlandi': 'Yayınlandı',
        'taslak': 'Taslak',
        'inceleme': 'İncelemede'
    };
    return texts[status] || status;
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

function viewMediaFile(id) {
    const file = sampleData.mediaFiles.find(f => f.id === id);
    if (!file) {
        alert('Dosya bulunamadı');
        return;
    }

    const content = `
        <div class="media-detail">
            <div class="media-preview">
                ${getFileIcon(file.type)} ${file.title}
            </div>
            <div class="media-info">
                <p><strong>Tür:</strong> ${file.type}</p>
                <p><strong>Kategori:</strong> ${file.category}</p>
                <p><strong>Boyut:</strong> ${file.size}</p>
                <p><strong>Yükleme Tarihi:</strong> ${file.uploadedAt}</p>
                <p><strong>Sürüm:</strong> ${file.version}</p>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="downloadMediaFile(${id}); closeModal();">İndir</button>
                <button class="btn btn-secondary" onclick="showMediaVersions(${id})">Sürümler</button>
                <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
            </div>
        </div>
    `;

    createModal('Dosya Detayları', content);
}

function downloadMediaFile(id) {
    const file = sampleData.mediaFiles.find(f => f.id === id);
    if (file) {
        // Simulate download
        showNotification(`${file.title} indiriliyor...`, 'info');
        // In a real implementation, this would trigger actual file download
        console.log('Downloading file:', file.title);
    } else {
        alert('Dosya bulunamadı');
    }
}

function showMediaVersions(id) {
    const file = sampleData.mediaFiles.find(f => f.id === id);
    if (!file) {
        alert('Dosya bulunamadı');
        return;
    }

    const content = `
        <div class="version-history">
            <h3>Dosya Sürüm Geçmişi</h3>
            <div class="version-list">
                <div class="version-item current">
                    <h4>${file.title}</h4>
                    <p>Sürüm ${file.version} - ${file.uploadedAt} <span class="current-badge">Güncel</span></p>
                    <button class="btn btn-sm" onclick="downloadMediaFile(${id})">İndir</button>
                </div>
                <div class="version-item">
                    <h4>${file.title}</h4>
                    <p>Sürüm ${file.version - 1} - ${new Date(new Date(file.uploadedAt).getTime() - 86400000).toLocaleDateString('tr-TR')}</p>
                    <button class="btn btn-sm" onclick="restoreVersion(${id}, ${file.version - 1})">Geri Yükle</button>
                </div>
            </div>
        </div>
    `;

    createModal('Sürüm Geçmişi', content);
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

    // Etiketleri ve yaş gruplarını yükle
    loadLibraryTags();
}

async function filterLibraryResources() {
    const typeFilter = document.getElementById('library-type-filter')?.value || '';
    const tagSearch = document.getElementById('library-tag-search')?.value || '';
    const searchTerm = document.getElementById('library-search')?.value || '';
    const selectedAgeGroups = [...document.querySelectorAll('#age-group-filters input:checked')].map(cb => cb.value);

    try {
        const params = new URLSearchParams({
            type: typeFilter,
            tags: tagSearch,
            search: searchTerm,
            age_groups: selectedAgeGroups.join(',')
        });

        const response = await fetch(`/api/library.php?${params}`);
        const data = await response.json();

        if (data.success) {
            displayLibraryResources(data.resources);
        } else {
            console.error('Kütüphane filtreleme hatası:', data.message);
            // Fallback
            filterLibraryResourcesLocal();
        }
    } catch (error) {
        console.error('Kütüphane API hatası:', error);
        // Fallback
        filterLibraryResourcesLocal();
    }
}

function filterLibraryResourcesLocal() {
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

    if (resources.length === 0) {
        grid.innerHTML = '<div class="empty-state">Seçilen kriterlere uygun kaynak bulunamadı.</div>';
        return;
    }

    grid.innerHTML = resources.map(resource => `
        <div class="card resource-card">
            <div class="resource-icon">📚</div>
            <h3>${resource.title}</h3>
            ${resource.author ? `<p><strong>Yazar:</strong> ${resource.author}</p>` : ''}
            <p><strong>Tür:</strong> ${resource.resource_type}</p>
            <p><strong>Yaş Grupları:</strong> ${resource.age_group.length > 0 ? resource.age_group.join(', ') : 'Belirtilmemiş'}</p>
            <p><strong>Etiketler:</strong> ${resource.tags.length > 0 ? resource.tags.map(tag => '#' + tag).join(' ') : 'Etiket yok'}</p>
            <p><strong>İndirme:</strong> ${resource.download_count || 0}</p>
            ${resource.description ? `<p class="resource-description">${resource.description.substring(0, 100)}...</p>` : ''}
            <div class="card-actions">
                <button class="btn btn-sm" onclick="downloadResource(${resource.id})">İndir</button>
                <button class="btn btn-sm btn-outline" onclick="viewResourceDetail(${resource.id})">Detay</button>
                <button class="btn btn-sm btn-outline" onclick="archiveResource(${resource.id})">Arşivle</button>
            </div>
        </div>
    `).join('');
}

async function manageLibraryTags() {
    try {
        const response = await fetch('/api/library_tags.php');
        const data = await response.json();

        if (data.success) {
            const content = `
                <div class="tag-management">
                    <h3>Etiket Yönetimi</h3>
                    <div class="tag-form">
                        <input type="text" id="new-tag" placeholder="Yeni etiket adı">
                        <select id="tag-category">
                            <option value="genel">Genel</option>
                            <option value="konu">Konu</option>
                            <option value="zorluk">Zorluk</option>
                            <option value="format">Format</option>
                        </select>
                        <button class="btn btn-primary" onclick="addLibraryTag()">Ekle</button>
                    </div>
                    <div class="tag-cloud" id="existing-tags">
                        ${data.tags.map(tag => `
                            <span class="tag-item" data-tag-id="${tag.id}">
                                #${tag.name} (${tag.usage_count || 0})
                                <button onclick="deleteLibraryTag(${tag.id}, '${tag.name}')">×</button>
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;

            createModal('Etiket Yönetimi', content);
        } else {
            // Fallback
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
    } catch (error) {
        console.error('Etiket yükleme hatası:', error);
        alert('Etiketler yüklenirken hata oluştu');
    }
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

            closeModal();
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

        closeModal();
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
async function loadReportsData() {
    const dateFrom = document.getElementById('report-date-from')?.value || '';
    const dateTo = document.getElementById('report-date-to')?.value || '';
    
    try {
        const params = new URLSearchParams();
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        
        const response = await fetch(`/api/reports.php?${params}`);
        const result = await response.json();
        
        if (result.success) {
            const data = result.data;
            loadEventsChart(data.events);
            loadBudgetChart(data.budget);
            loadSocialChart(data.social);
            loadMembershipChart(data.membership);
        } else {
            console.error('Reports API error:', result.message);
            // Fallback to sample data
            loadReportsDataFallback();
        }
    } catch (error) {
        console.error('Reports fetch error:', error);
        loadReportsDataFallback();
    }
}

function loadReportsDataFallback() {
    loadEventsChart();
    loadBudgetChart();
    loadSocialChart();
    loadMembershipChart();
}

async function loadEventsChart(eventsData = null) {
    const canvas = document.getElementById('events-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    if (eventsData) {
        const data = eventsData.events.map(event => event.participants_count || 0);
        const labels = eventsData.events.map(event => event.title.substring(0, 15) + '...');

        drawBarChart(ctx, data, labels, '#3b82f6');

        document.getElementById('events-summary').textContent =
            `${eventsData.total_events} etkinlik, toplam ${eventsData.total_participants} katılımcı, ortalama ${eventsData.avg_participants} kişi/etkinlik`;
    } else {
        // Fallback to sample data
        const data = sampleData.events.map(event => event.participants);
        const labels = sampleData.events.map(event => event.title.substring(0, 15) + '...');

        drawBarChart(ctx, data, labels, '#3b82f6');

        const totalParticipants = data.reduce((sum, val) => sum + val, 0);
        const avgParticipation = Math.round(totalParticipants / data.length);
        document.getElementById('events-summary').textContent =
            `Toplam ${totalParticipants} katılımcı, ortalama ${avgParticipation} kişi/etkinlik (demo data)`;
    }
}

async function loadBudgetChart(budgetData = null) {
    const canvas = document.getElementById('budget-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    if (budgetData) {
        drawPieChart(ctx, [budgetData.total_income, budgetData.total_expense], ['Gelir', 'Gider'], ['#10b981', '#ef4444']);

        document.getElementById('budget-summary').textContent =
            `₺${budgetData.remaining.toLocaleString()} kalan bütçe (${budgetData.expense_percentage}% kullanıldı)`;
    } else {
        // Fallback to sample data
        const totalIncome = sampleData.budgetLogs.filter(log => log.type === 'gelir')
            .reduce((sum, log) => sum + log.amount, 0);
        const totalExpense = sampleData.budgetLogs.filter(log => log.type === 'gider')
            .reduce((sum, log) => sum + log.amount, 0);

        drawPieChart(ctx, [totalIncome, totalExpense], ['Gelir', 'Gider'], ['#10b981', '#ef4444']);

        const remaining = totalIncome - totalExpense;
        document.getElementById('budget-summary').textContent =
            `₺${remaining.toLocaleString()} kalan bütçe (${Math.round((totalExpense/totalIncome)*100)}% kullanıldı) (demo data)`;
    }
}

async function loadSocialChart(socialData = null) {
    const canvas = document.getElementById('social-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    if (socialData) {
        const platforms = Object.keys(socialData.platform_stats);
        const engagementData = platforms.map(platform => {
            const stats = socialData.platform_stats[platform];
            return stats.likes + stats.comments + stats.shares;
        });

        drawBarChart(ctx, engagementData, platforms, '#8b5cf6');

        document.getElementById('social-summary').textContent =
            `${socialData.published_posts} yayınlanan içerik, toplam ${socialData.total_engagement} etkileşim`;
    } else {
        // Fallback to sample data
        const publishedPosts = sampleData.socialMediaPosts.filter(post => post.status === 'yayinlandi');
        const totalLikes = publishedPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
        const totalComments = publishedPosts.reduce((sum, post) => sum + (post.comments || 0), 0);
        const totalShares = publishedPosts.reduce((sum, post) => sum + (post.shares || 0), 0);

        drawBarChart(ctx, [totalLikes, totalComments, totalShares], ['Beğeni', 'Yorum', 'Paylaşım'], '#8b5cf6');

        document.getElementById('social-summary').textContent =
            `${publishedPosts.length} yayınlanan içerik, toplam ${totalLikes + totalComments + totalShares} etkileşim (demo data)`;
    }
}

async function loadMembershipChart(membershipData = null) {
    const canvas = document.getElementById('membership-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    if (membershipData) {
        const monthlyData = membershipData.monthly_joins;
        const months = Object.keys(monthlyData).sort();
        const joinCounts = months.map(month => monthlyData[month]);
        const monthLabels = months.map(month => {
            const [year, monthNum] = month.split('-');
            const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
            return monthNames[parseInt(monthNum) - 1];
        });

        drawLineChart(ctx, joinCounts, monthLabels, '#f59e0b');

        document.getElementById('membership-summary').textContent =
            `${membershipData.total_members} aktif üye, bu dönem ${membershipData.new_members_count} yeni katılım`;
    } else {
        // Fallback to sample data
        const monthlyJoins = Array(12).fill(0);

        sampleData.members.forEach(member => {
            if (member.joinDate) {
                const month = new Date(member.joinDate).getMonth();
                monthlyJoins[month]++;
            }


// AJAX Mini Form Functions
function showMiniForm(type) {
    let content = '';
    
    switch(type) {
        case 'event':
            content = `
                <div class="mini-form">
                    <h4>Hızlı Etkinlik Ekle</h4>
                    <form id="mini-event-form">
                        <input type="text" name="title" placeholder="Etkinlik Başlığı *" required>
                        <input type="datetime-local" name="start_date" required>
                        <input type="text" name="location" placeholder="Konum">
                        <select name="event_type" required>
                            <option value="">Tür Seçin</option>
                            <option value="gozlem">Gözlem</option>
                            <option value="seminer">Seminer</option>
                            <option value="atolye">Atölye</option>
                        </select>
                        <div class="mini-form-actions">
                            <button type="submit" class="btn btn-primary btn-sm">Ekle</button>
                            <button type="button" class="btn btn-secondary btn-sm" onclick="closeMiniForm()">İptal</button>
                        </div>
                    </form>
                </div>
            `;
            break;
            
        case 'member':
            content = `
                <div class="mini-form">
                    <h4>Hızlı Üye Ekle</h4>
                    <form id="mini-member-form">
                        <input type="text" name="full_name" placeholder="Ad Soyad *" required>
                        <input type="email" name="email" placeholder="E-posta *" required>
                        <select name="role" required>
                            <option value="">Rol Seçin</option>
                            <option value="üye">Üye</option>
                            <option value="yönetici">Yönetici</option>
                        </select>
                        <input type="text" name="department" placeholder="Birim">
                        <div class="mini-form-actions">
                            <button type="submit" class="btn btn-primary btn-sm">Ekle</button>
                            <button type="button" class="btn btn-secondary btn-sm" onclick="closeMiniForm()">İptal</button>
                        </div>
                    </form>
                </div>
            `;
            break;
            
        case 'task':
            content = `
                <div class="mini-form">
                    <h4>Hızlı Görev Ekle</h4>
                    <form id="mini-task-form">
                        <input type="text" name="title" placeholder="Görev Başlığı *" required>
                        <select name="assigned_to" required>
                            <option value="">Kişi Seçin</option>
                            ${sampleData.members.map(m => `<option value="${m.id}">${m.name}</option>`).join('')}
                        </select>
                        <input type="date" name="due_date" required>
                        <select name="priority">
                            <option value="orta">Orta</option>
                            <option value="yuksek">Yüksek</option>
                            <option value="dusuk">Düşük</option>
                        </select>
                        <div class="mini-form-actions">
                            <button type="submit" class="btn btn-primary btn-sm">Ekle</button>
                            <button type="button" class="btn btn-secondary btn-sm" onclick="closeMiniForm()">İptal</button>
                        </div>
                    </form>
                </div>
            `;
            break;
            
        case 'blog':
            content = `
                <div class="mini-form">
                    <h4>Hızlı Blog Yazısı</h4>
                    <form id="mini-blog-form">
                        <input type="text" name="title" placeholder="Başlık *" required>
                        <textarea name="excerpt" placeholder="Kısa açıklama" rows="2"></textarea>
                        <select name="category" required>
                            <option value="">Kategori Seçin</option>
                            <option value="Rehber">Rehber</option>
                            <option value="Eğitim">Eğitim</option>
                            <option value="Duyuru">Duyuru</option>
                        </select>
                        <select name="status">
                            <option value="taslak">Taslak</option>
                            <option value="yayinlandi">Yayınla</option>
                        </select>
                        <div class="mini-form-actions">
                            <button type="submit" class="btn btn-primary btn-sm">Ekle</button>
                            <button type="button" class="btn btn-secondary btn-sm" onclick="closeMiniForm()">İptal</button>
                        </div>
                    </form>
                </div>
            `;
            break;
    }
    
    // Create mini form overlay
    const overlay = document.createElement('div');
    overlay.className = 'mini-form-overlay';
    overlay.innerHTML = content;
    document.body.appendChild(overlay);
    
    // Setup form submission
    const form = overlay.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitMiniForm(type, new FormData(this));
        });
    }
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            closeMiniForm();
        }
    });
}

function closeMiniForm() {
    const overlay = document.querySelector('.mini-form-overlay');
    if (overlay) {
        overlay.remove();
    }
}

async function submitMiniForm(type, formData) {
    const submitBtn = document.querySelector('.mini-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Ekleniyor...';
    }
    
    try {
        let apiEndpoint = '';
        let data = {};
        
        // Prepare data based on type
        switch(type) {
            case 'event':
                apiEndpoint = '/api/events.php';
                data = {
                    title: formData.get('title'),
                    start_date: formData.get('start_date'),
                    location: formData.get('location'),
                    event_type: formData.get('event_type'),
                    created_by: currentUser.id || 1
                };
                break;
                
            case 'member':
                apiEndpoint = '/api/users.php';
                data = {
                    full_name: formData.get('full_name'),
                    email: formData.get('email'),
                    role: formData.get('role'),
                    department: formData.get('department'),
                    password: generateTempPassword()
                };
                break;
                
            case 'task':
                apiEndpoint = '/api/tasks.php';
                data = {
                    title: formData.get('title'),
                    assigned_to: formData.get('assigned_to'),
                    due_date: formData.get('due_date'),
                    priority: formData.get('priority'),
                    status: 'yapilacak'
                };
                break;
                
            case 'blog':
                apiEndpoint = '/api/blog.php';
                data = {
                    title: formData.get('title'),
                    excerpt: formData.get('excerpt'),
                    category: formData.get('category'),
                    status: formData.get('status'),
                    content: formData.get('excerpt') // Minimal content from excerpt
                };
                break;
        }
        
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        


// CSV Import Enhancement Functions
function showCSVImportModal() {
    const content = `
        <div class="csv-import-modal">
            <h3>CSV Dosyası İçe Aktar</h3>
            
            <form id="csv-import-form" enctype="multipart/form-data">
                <div class="form-group">
                    <label>CSV Dosyası Seçin:</label>
                    <input type="file" name="csv_file" accept=".csv" required>
                    <small>Sadece .csv formatında dosyalar kabul edilir</small>
                </div>
                
                <div class="import-options">
                    <div class="import-option">
                        <label>Hedef Tablo:</label>
                        <select name="target_table" required>
                            <option value="">Tablo Seçin</option>
                            <option value="users">Kullanıcılar</option>
                            <option value="events">Etkinlikler</option>
                            <option value="blog_posts">Blog Yazıları</option>
                            <option value="projects">Projeler</option>
                            <option value="tasks">Görevler</option>
                            <option value="resources">Kaynaklar</option>
                        </select>
                    </div>
                    
                    <div class="import-option">
                        <label>Karakter Kodlaması:</label>
                        <select name="encoding">
                            <option value="utf-8">UTF-8</option>
                            <option value="iso-8859-9">ISO-8859-9 (Turkish)</option>
                            <option value="windows-1254">Windows-1254</option>
                        </select>
                    </div>
                </div>
                
                <div class="duplicate-handling">
                    <h4>Çoklu Kayıt Yönetimi</h4>
                    <div class="duplicate-options">
                        <label>
                            <input type="radio" name="handle_duplicates" value="skip" checked>
                            <span>Atla - Çoklu kayıtları içe aktarma</span>
                        </label>
                        <label>
                            <input type="radio" name="handle_duplicates" value="update">
                            <span>Güncelle - Mevcut kayıtları güncelle</span>
                        </label>
                        <label>
                            <input type="radio" name="handle_duplicates" value="ignore">
                            <span>Yoksay - Çoklu kayıtlara izin ver</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="validate_data" checked>
                        Veri doğrulaması yap
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="create_backup" checked>
                        İçe aktarmadan önce yedek oluştur
                    </label>
                </div>
                
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">İçe Aktar</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                </div>
            </form>
            
            <div id="import-progress" style="display: none;">
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="import-progress-fill"></div>
                    </div>
                    <p id="import-progress-text">İçe aktarma başlıyor...</p>
                </div>
            </div>
            
            <div id="import-results" style="display: none;"></div>
        </div>
    `;
    
    createModal('CSV İçe Aktar', content);
    setupCSVImportForm();
}

function setupCSVImportForm() {
    const form = document.getElementById('csv-import-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            performCSVImport(new FormData(this));
        });
    }
}

async function performCSVImport(formData) {
    const progressDiv = document.getElementById('import-progress');
    const resultsDiv = document.getElementById('import-results');
    const form = document.getElementById('csv-import-form');
    
    // Show progress, hide form
    form.style.display = 'none';
    progressDiv.style.display = 'block';
    
    updateImportProgress(0, 'Dosya yükleniyor...');
    
    try {
        updateImportProgress(25, 'Veri doğrulanıyor...');
        
        const response = await fetch('/api/import_csv.php', {
            method: 'POST',
            body: formData
        });
        
        updateImportProgress(75, 'İşleniyor...');
        
        const result = await response.json();
        
        updateImportProgress(100, 'Tamamlandı!');
        
        setTimeout(() => {
            progressDiv.style.display = 'none';
            displayImportResults(result);
        }, 1000);
        
    } catch (error) {
        console.error('CSV import error:', error);
        progressDiv.style.display = 'none';
        displayImportResults({
            success: false,
            error: 'İçe aktarma sırasında hata oluştu: ' + error.message
        });
    }
}

function updateImportProgress(percentage, text) {
    const progressFill = document.getElementById('import-progress-fill');
    const progressText = document.getElementById('import-progress-text');
    
    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressText) progressText.textContent = text;
}

function displayImportResults(result) {
    const resultsDiv = document.getElementById('import-results');
    
    if (result.success) {
        const summary = result.summary;
        const details = result.details;
        
        resultsDiv.innerHTML = `
            <div class="import-report">
                <h4>İçe Aktarma Tamamlandı</h4>
                
                <div class="import-summary">
                    <div class="summary-item">
                        <span class="number">${summary.total_rows}</span>
                        <span class="label">Toplam</span>
                    </div>
                    <div class="summary-item">
                        <span class="number">${summary.imported}</span>
                        <span class="label">Başarılı</span>
                    </div>
                    <div class="summary-item">
                        <span class="number">${summary.errors}</span>
                        <span class="label">Hata</span>
                    </div>
                    <div class="summary-item">
                        <span class="number">${summary.duplicates}</span>
                        <span class="label">Çoklu</span>
                    </div>
                    <div class="summary-item">
                        <span class="number">${summary.skipped}</span>
                        <span class="label">Atlandı</span>
                    </div>
                </div>
                
                ${details.errors.length > 0 ? `
                    <div class="detail-section">
                        <h5>Hatalar (${details.errors.length})</h5>
                        <div class="detail-list">
                            ${details.errors.map(error => `<div class="detail-item">${error}</div>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${details.duplicates.length > 0 ? `
                    <div class="detail-section">
                        <h5>Çoklu Kayıtlar (${details.duplicates.length})</h5>
                        <div class="detail-list">
                            ${details.duplicates.map(dup => `<div class="detail-item">${dup}</div>`).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${result.report_file ? `
                    <div class="form-group">
                        <a href="/uploads/reports/${result.report_file}" class="btn btn-outline" download>
                            📄 Detay Raporu İndir
                        </a>
                    </div>
                ` : ''}
                
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="closeModal(); location.reload();">Tamam</button>
                </div>
            </div>
        `;
    } else {
        resultsDiv.innerHTML = `
            <div class="import-report">
                <h4>İçe Aktarma Başarısız</h4>
                <p style="color: var(--error-color); margin: 16px 0;">
                    ${result.error || 'Bilinmeyen hata oluştu'}
                </p>
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="form.style.display='block'; resultsDiv.style.display='none';">Tekrar Dene</button>
                    <button class="btn btn-primary" onclick="closeModal()">Kapat</button>
                </div>
            </div>
        `;
    }
    
    resultsDiv.style.display = 'block';
}

// Add CSV import button to relevant sections
function addCSVImportButtons() {
    const sections = ['members', 'events', 'blog', 'projects'];
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const header = section.querySelector('.section-header, h2');
            if (header && !header.querySelector('.csv-import-btn')) {
                const csvBtn = document.createElement('button');
                csvBtn.className = 'btn btn-sm btn-outline csv-import-btn';
                csvBtn.textContent = '📊 CSV İçe Aktar';
                csvBtn.onclick = () => showCSVImportModal();
                header.appendChild(csvBtn);
            }
        }
    });
}

// Initialize CSV import buttons
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addCSVImportButtons, 1000);
});

        const result = await response.json();
        
        if (result.success) {
            closeMiniForm();
            showNotification(`${type} başarıyla eklendi!`, 'success');
            
            // Refresh relevant section
            refreshSection(type);
        } else {
            throw new Error(result.message || 'Ekleme başarısız');
        }
        
    } catch (error) {
        console.error('Mini form error:', error);
        showNotification('Ekleme sırasında hata oluştu: ' + error.message, 'error');
        
        // Fallback to local data for demo
        addToLocalData(type, formData);
        closeMiniForm();
        showNotification(`${type} eklendi (demo modu)`, 'success');
        refreshSection(type);
    }
}

function generateTempPassword() {
    return Math.random().toString(36).slice(-8);
}

function addToLocalData(type, formData) {
    const newId = Date.now();
    
    switch(type) {
        case 'event':
            sampleData.events.push({
                id: newId,
                title: formData.get('title'),
                date: formData.get('start_date'),
                location: formData.get('location'),
                type: formData.get('event_type'),
                status: 'active',
                participants: 0
            });
            break;
            
        case 'member':
            sampleData.members.push({
                id: newId,
                name: formData.get('full_name'),
                email: formData.get('email'),
                role: formData.get('role'),
                status: 'active',
                joinDate: new Date().toISOString().split('T')[0]
            });
            break;
            
        case 'task':
            sampleData.tasks.push({
                id: newId,
                title: formData.get('title'),
                assignedTo: parseInt(formData.get('assigned_to')),
                dueDate: formData.get('due_date'),
                priority: formData.get('priority'),
                status: 'yapilacak'
            });
            break;
            
        case 'blog':
            sampleData.blogPosts.push({
                id: newId,
                title: formData.get('title'),
                category: formData.get('category'),
                status: formData.get('status'),
                publishedAt: formData.get('status') === 'yayinlandi' ? new Date().toISOString().split('T')[0] : null,
                views: 0
            });
            break;
    }
}

function refreshSection(type) {
    switch(type) {
        case 'event':
            if (document.getElementById('events').classList.contains('active')) {
                filterEvents();
            }
            break;
        case 'member':
            if (document.getElementById('members').classList.contains('active')) {
                loadMembersData();
            }
            break;
        case 'task':
            if (document.getElementById('tasks').classList.contains('active')) {
                loadTasksKanban();
            }
            break;
        case 'blog':
            if (document.getElementById('blog').classList.contains('active')) {
                filterBlogPosts();
            }
            break;
    }
    
    // Always update dashboard
    updateCardCounts();
}

// Quick add buttons for sections
function addQuickAddButtons() {
    // Add mini form buttons to each section
    const sections = [
        { id: 'events', type: 'event', text: '⚡ Hızlı Ekle' },
        { id: 'members', type: 'member', text: '⚡ Hızlı Ekle' },
        { id: 'tasks', type: 'task', text: '⚡ Hızlı Ekle' },
        { id: 'blog', type: 'blog', text: '⚡ Hızlı Ekle' }
    ];
    
    sections.forEach(section => {
        const sectionElement = document.getElementById(section.id);
        if (sectionElement) {
            const header = sectionElement.querySelector('.section-header, h2');
            if (header && !header.querySelector('.quick-add-btn')) {
                const quickBtn = document.createElement('button');
                quickBtn.className = 'btn btn-sm btn-outline quick-add-btn';
                quickBtn.textContent = section.text;
                quickBtn.onclick = () => showMiniForm(section.type);
                header.appendChild(quickBtn);
            }
        }
    });
}

// Initialize quick add buttons when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addQuickAddButtons, 1000); // Add after initial load
});

        });

        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        drawLineChart(ctx, monthlyJoins, months, '#f59e0b');

        document.getElementById('membership-summary').textContent =
            `${sampleData.members.length} aktif üye, bu yıl ${monthlyJoins.reduce((sum, val) => sum + val, 0)} yeni katılım (demo data)`;
    }
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

async function generateReport() {
    const type = document.getElementById('report-type').value;
    const dateFrom = document.getElementById('custom-date-from').value;
    const dateTo = document.getElementById('custom-date-to').value;
    const format = document.getElementById('report-format').value;

    if (!dateFrom || !dateTo) {
        alert('Lütfen tarih aralığını seçin');
        return;
    }

    try {
        const params = new URLSearchParams({
            type: type,
            date_from: dateFrom,
            date_to: dateTo,
            format: format
        });

        showNotification(`${type} raporu ${format} formatında oluşturuluyor...`, 'info');

        const response = await fetch(`/api/reports.php?${params}`);
        const result = await response.json();

        if (result.success) {
            closeModal();
            
            if (format === 'pdf' || format === 'excel') {
                // Generate downloadable file
                generateDownloadableReport(result.data, type, format);
            } else {
                // Show data in new modal
                showReportResults(result.data, type);
            }
            
            showNotification('Rapor başarıyla oluşturuldu!', 'success');
        } else {
            alert('Rapor oluşturulurken hata: ' + result.message);
        }
    } catch (error) {
        console.error('Report generation error:', error);
        alert('Rapor oluşturulurken bir hata oluştu');
    }
}

function generateDownloadableReport(data, type, format) {
    let content = '';
    let filename = `${type}_raporu_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'csv') {
        content = convertToCSV(data, type);
        filename += '.csv';
        
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    } else {
        // For PDF/Excel, show data for now (could integrate with libraries later)
        showReportResults(data, type);
    }
}

function convertToCSV(data, type) {
    let csv = '';
    
    switch (type) {
        case 'events':
            csv = 'Başlık,Katılımcı Sayısı,Tarih,Tür,Konum,Bütçe\n';
            data.events.forEach(event => {
                csv += `"${event.title}",${event.participants_count || 0},"${event.start_date}","${event.event_type}","${event.location}",${event.budget || 0}\n`;
            });
            break;
        case 'budget':
            csv = 'Tutar,Tür,Kategori,Açıklama,Tarih\n';
            data.transactions.forEach(transaction => {
                csv += `${transaction.amount},"${transaction.transaction_type}","${transaction.category}","${transaction.description}","${transaction.created_at}"\n`;
            });
            break;
        case 'social':
            csv = 'Başlık,Platform,Durum,Beğeni,Yorum,Paylaşım,Yayın Tarihi\n';
            data.posts.forEach(post => {
                csv += `"${post.title}","${post.platform}","${post.status}",${post.likes_count || 0},${post.comments_count || 0},${post.shares_count || 0},"${post.published_at || ''}"\n`;
            });
            break;
        case 'membership':
            csv = 'Ad Soyad,Email,Rol,Birim,Kayıt Tarihi,Son Giriş\n';
            data.new_members.forEach(member => {
                csv += `"${member.full_name}","${member.email}","${member.role}","${member.department}","${member.created_at}","${member.last_login || ''}"\n`;
            });
            break;
    }
    
    return csv;
}

function showReportResults(data, type) {
    const content = `
        <div class="report-results">
            <h3>${type.charAt(0).toUpperCase() + type.slice(1)} Rapor Sonuçları</h3>
            <div class="report-summary">
                ${generateReportSummary(data, type)}
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="generateDownloadableReport(${JSON.stringify(data).replace(/"/g, '&quot;')}, '${type}', 'csv')">CSV İndir</button>
                <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
            </div>
        </div>
    `;
    
    createModal('Rapor Sonuçları', content);
}

function generateReportSummary(data, type) {
    switch (type) {
        case 'events':
            return `
                <p><strong>Toplam Etkinlik:</strong> ${data.total_events}</p>
                <p><strong>Toplam Katılımcı:</strong> ${data.total_participants}</p>
                <p><strong>Ortalama Katılımcı:</strong> ${data.avg_participants}</p>
                <p><strong>Toplam Bütçe:</strong> ₺${data.total_budget.toLocaleString()}</p>
            `;
        case 'budget':
            return `
                <p><strong>Toplam Gelir:</strong> ₺${data.total_income.toLocaleString()}</p>
                <p><strong>Toplam Gider:</strong> ₺${data.total_expense.toLocaleString()}</p>
                <p><strong>Kalan Bütçe:</strong> ₺${data.remaining.toLocaleString()}</p>
                <p><strong>Kullanım Oranı:</strong> %${data.expense_percentage}</p>
            `;
        case 'social':
            return `
                <p><strong>Toplam Gönderi:</strong> ${data.total_posts}</p>
                <p><strong>Yayınlanan:</strong> ${data.published_posts}</p>
                <p><strong>Toplam Etkileşim:</strong> ${data.total_engagement.toLocaleString()}</p>
                <p><strong>Ortalama Etkileşim:</strong> ${data.avg_engagement}</p>
            `;
        case 'membership':
            return `
                <p><strong>Toplam Üye:</strong> ${data.total_members}</p>
                <p><strong>Yeni Üye:</strong> ${data.new_members_count}</p>
                <p><strong>Aktif Üye:</strong> ${data.active_members}</p>
                <p><strong>Kalma Oranı:</strong> %${data.retention_rate}</p>
            `;
        default:
            return '<p>Rapor özeti hazırlanıyor...</p>';
    }
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

async function updateReports() {
    showNotification('Raporlar güncelleniyor...', 'info');
    await loadReportsData();
    showNotification('Raporlar güncellendi!', 'success');
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


// Project specific functions
function setupProjectFilters() {
    const typeFilter = document.getElementById('project-type-filter');
    const searchInput = document.getElementById('project-search');

    [typeFilter, searchInput].forEach(element => {
        if (element) {
            element.addEventListener('change', filterProjects);
            if (element === searchInput) {
                element.addEventListener('input', filterProjects);
            }
        }
    });
}

function filterProjects() {
    const typeFilter = document.getElementById('project-type-filter')?.value || '';
    const searchTerm = document.getElementById('project-search')?.value.toLowerCase() || '';

    let filteredProjects = sampleData.projects.filter(project => {
        const matchesType = !typeFilter || project.type === typeFilter;
        const matchesSearch = !searchTerm || project.name.toLowerCase().includes(searchTerm);
        return matchesType && matchesSearch;
    });

    displayProjects(filteredProjects);
}

function displayProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    if (projects.length === 0) {
        grid.innerHTML = '<div class="empty-state">Proje bulunamadı.</div>';
        return;
    }

    grid.innerHTML = projects.map(project => {
        const partners = JSON.parse(project.partners || '[]');
        const progress = project.budget_total > 0 ? (project.budget_used / project.budget_total) * 100 : 0;
        return `
            <div class="card project-card">
                <h3>${project.name}</h3>
                <p><strong>Tür:</strong> ${project.type || 'Belirtilmemiş'}</p>
                <p><strong>Bütçe:</strong> ₺${project.budget_used.toLocaleString()} / ₺${project.budget_total.toLocaleString()}</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progress}%;"></div>
                </div>
                <p><strong>İlerleme:</strong> ${progress.toFixed(1)}%</p>
                <p><strong>Ortaklar:</strong> ${partners.length > 0 ? partners.join(', ') : 'Belirtilmemiş'}</p>
                <div class="card-actions">
                    <button class="btn btn-sm" onclick="editProject(${project.id})">Düzenle</button>
                    <button class="btn btn-sm btn-outline" onclick="openProjectDetail(${project.id})">Detay</button>
                    <button class="btn btn-sm btn-outline" onclick="updateProjectBudget(${project.id})">Bütçe Güncelle</button>
                </div>
            </div>
        `;
    }).join('');
}

async function loadProjectsData() {
    try {
        const response = await fetch('/api/projects.php');
        const data = await response.json();

        if (data.success) {
            sampleData.projects = data.projects; // Update local data
            displayProjects(data.projects);
        } else {
            console.error('Proje yükleme hatası:', data.message);
            displayProjects(sampleData.projects); // Fallback to sample data
        }
    } catch (error) {
        console.error('Projeler API hatası:', error);
        displayProjects(sampleData.projects); // Fallback to sample data
    }
}

function updateProjectBudget(projectId) {
    const project = sampleData.projects.find(p => p.id === projectId);
    if (!project) return;

    const content = `
        <div class="budget-update-form">
            <form id="budget-update-form">
                <input type="hidden" name="project_id" value="${projectId}">
                <div class="form-group">
                    <label>Kullanılan Bütçe (₺): *</label>
                    <input type="number" name="budget_used" min="0" step="0.01" required placeholder="0.00" value="${project.budget_used}">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Bütçeyi Güncelle</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                </div>
            </form>
        </div>
    `;

    createModal('Bütçe Güncelleme', content);
    setupBudgetUpdateForm();
}

function setupBudgetUpdateForm() {
    const form = document.getElementById('budget-update-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const projectId = form.elements['project_id'].value;
            const budgetUsed = parseFloat(form.elements['budget_used'].value);

            // Validation
            const project = sampleData.projects.find(p => p.id === parseInt(projectId));
            if (!project || budgetUsed < 0 || budgetUsed > project.budget_total) {
                alert('Geçersiz bütçe değeri.');
                return;
            }

            try {
                const response = await fetch('/api/projects.php', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: parseInt(projectId),
                        budget_used: budgetUsed
                    })
                });

                const result = await response.json();

                if (result.success) {
                    // Update local data
                    const projectIndex = sampleData.projects.findIndex(p => p.id === parseInt(projectId));
                    if (projectIndex !== -1) {
                        sampleData.projects[projectIndex].budget_used = budgetUsed;
                    }

                    closeModal();
                    loadProjectsData(); // Refresh projects list
                    showNotification('Bütçe başarıyla güncellendi!', 'success');
                } else {
                    alert('Bütçe güncellenirken hata: ' + result.message);
                }
            } catch (error) {
                console.error('Budget update error:', error);
                // Fallback for demo
                const projectIndex = sampleData.projects.findIndex(p => p.id === parseInt(projectId));
                if (projectIndex !== -1) {
                    sampleData.projects[projectIndex].budget_used = budgetUsed;
                    loadProjectsData();
                    showNotification('Bütçe güncellendi (demo modu)', 'success');
                }
                closeModal();
            }
        });
    }
}

async function deleteProjectConfirm(id) {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
        return;
    }

    try {
        const response = await fetch(`/api/projects.php?id=${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            // Remove from local data
            sampleData.projects = sampleData.projects.filter(p => p.id !== id);
            closeModal();
            loadProjectsData(); // Refresh projects list
            showNotification('Proje silindi', 'success');
        } else {
            alert('Proje silinirken hata: ' + result.message);
        }
    } catch (error) {
        console.error('Project delete error:', error);
        // Fallback for demo
        sampleData.projects = sampleData.projects.filter(p => p.id !== id);
        closeModal();
        loadProjectsData();
        showNotification('Proje silindi (demo modu)', 'success');
    }
}

function editBlogPost(id) {
    alert(`Blog yazısı ${id} düzenleme formu açılacak`);
}

function viewBlogPost(id) {
    alert(`Blog yazısı ${id} görüntüleme detayları açılacak`);
}

function archiveBlogPost(id) {
    alert(`Blog yazısı ${id} arşivlenecek`);
}

function restoreBlogPost(id) {
    alert(`Blog yazısı ${id} geri yüklenecek`);
}

function addBlogCategory() {
    alert('Yeni blog kategorisi eklenecek');
}

function deleteBlogCategory(id) {
    alert(`Blog kategorisi ${id} silinecek`);
}

async function addLibraryTag() {
    const tagNameInput = document.getElementById('new-tag');
    const categorySelect = document.getElementById('tag-category');
    
    if (!tagNameInput || !tagNameInput.value.trim()) {
        alert('Lütfen etiket adını girin');
        return;
    }

    const tagData = {
        name: tagNameInput.value.trim(),
        category: categorySelect ? categorySelect.value : 'genel',
        created_by: currentUser.id || 1
    };

    try {
        const response = await fetch('/api/library_tags.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tagData)
        });

        const result = await response.json();

        if (result.success) {
            // Etiket listesini güncelle
            const existingTags = document.getElementById('existing-tags');
            if (existingTags) {
                const newTagElement = document.createElement('span');
                newTagElement.className = 'tag-item';
                newTagElement.setAttribute('data-tag-id', result.tag.id);
                newTagElement.innerHTML = `#${result.tag.name} (0) <button onclick="deleteLibraryTag(${result.tag.id}, '${result.tag.name}')">×</button>`;
                existingTags.appendChild(newTagElement);
            }

            // Formu temizle
            tagNameInput.value = '';
            showNotification('Etiket başarıyla eklendi!', 'success');
        } else {
            alert('Etiket eklenirken hata: ' + result.message);
        }
    } catch (error) {
        console.error('Etiket ekleme hatası:', error);
        alert('Etiket eklenirken bir hata oluştu');
    }
}

async function deleteLibraryTag(tagId, tagName) {
    if (!confirm(`"${tagName}" etiketini silmek istediğinizden emin misiniz?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/library_tags.php?id=${tagId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            // Etiket öğesini DOM'dan kaldır
            const tagElement = document.querySelector(`[data-tag-id="${tagId}"]`);
            if (tagElement) {
                tagElement.remove();
            }
            
            showNotification('Etiket silindi', 'success');
        } else {
            alert('Etiket silinirken hata: ' + result.message);
        }
    } catch (error) {
        console.error('Etiket silme hatası:', error);
        alert('Etiket silinirken bir hata oluştu');
    }
}

function deleteTag(tag) {
    alert(`Etiket "${tag}" silinecek (eski fonksiyon)`);
}

async function loadLibraryTags() {
    try {
        const response = await fetch('/api/library_tags.php');
        const data = await response.json();

        if (data.success) {
            // Yaş grubu checkboxlarını güncelle
            const ageGroupContainer = document.getElementById('age-group-filters');
            if (ageGroupContainer && data.age_groups) {
                ageGroupContainer.innerHTML = data.age_groups.map(group => `
                    <label><input type="checkbox" value="${group.value}"> ${group.label}</label>
                `).join('');

                // Event listener'ları yeniden ekle
                ageGroupContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.addEventListener('change', filterLibraryResources);
                });
            }
        }
    } catch (error) {
        console.error('Etiket yükleme hatası:', error);
    }
}

function downloadResource(id) {
    alert(`Kaynak ${id} indirilecek`);
}

function viewResourceDetail(id) {
    alert(`Kaynak ${id} detayları görüntülenecek`);
}

function archiveResource(id) {
    alert(`Kaynak ${id} arşivlenecek`);
}