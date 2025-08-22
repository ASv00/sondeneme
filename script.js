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
        { 
            id: 1, 
            title: '2024 Faaliyet Raporu', 
            document_type: 'rapor', 
            status: 'onay_bekliyor',
            approval_status: 'bekliyor',
            uploaded_by: 1,
            uploader_name: 'Ahmet Yılmaz',
            access_level: 'uyeler',
            created_at: '2024-12-01'
        },
        { 
            id: 2, 
            title: 'Etkinlik Onay Formu', 
            document_type: 'protokol', 
            status: 'onay_bekliyor',
            approval_status: 'bekliyor',
            uploaded_by: 2,
            uploader_name: 'Zeynep Kaya',
            access_level: 'uyeler',
            created_at: '2024-12-02'
        },
        { 
            id: 3, 
            title: 'Bütçe Talebi', 
            document_type: 'butce', 
            status: 'onaylandi',
            approval_status: 'onaylandi',
            uploaded_by: 1,
            uploader_name: 'Ahmet Yılmaz',
            approved_by: 1,
            approver_name: 'Ahmet Yılmaz',
            approved_at: '2024-11-30',
            access_level: 'yoneticiler',
            created_at: '2024-11-28'
        }
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
        { 
            id: 1, 
            title: 'Mobil Gözlemevi Projesi', 
            project_type: 'Donanım', 
            status: 'devam_ediyor',
            budget_total: 30000, 
            budget_used: 25000, 
            progress_percentage: 75,
            partners: JSON.stringify(['TÜBİTAK', 'XYZ Teknoloji', 'Uludağ Üniversitesi']),
            description: 'Taşınabilir astronomi gözlem ekipmanı geliştirme projesi',
            start_date: '2024-01-15',
            end_date: '2024-12-31'
        },
        { 
            id: 2, 
            title: 'Web Sitesi Yenileme', 
            project_type: 'Yazılım', 
            status: 'devam_ediyor',
            budget_total: 15000, 
            budget_used: 10000, 
            progress_percentage: 60,
            partners: JSON.stringify(['ABC Yazılım']),
            description: 'Topluluk web sitesi modernizasyonu ve mobil uyumluluk',
            start_date: '2024-02-01',
            end_date: '2024-06-30'
        },
        { 
            id: 3, 
            title: 'Astronomi Eğitim Programı', 
            project_type: 'Eğitim', 
            status: 'planlama',
            budget_total: 8000, 
            budget_used: 2000, 
            progress_percentage: 20,
            partners: JSON.stringify(['Milli Eğitim Müdürlüğü', 'Bilim Merkezi']),
            description: 'İlkokul ve ortaokul öğrencileri için astronomi eğitim programı',
            start_date: '2024-03-01',
            end_date: '2024-11-30'
        }
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
    setupDepartmentFilters();
    setupSocialFilters();

    // Calendar export
    const exportBtn = document.getElementById('export-calendar-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportEventsToCalendar);
    }

    // Legacy support
    const legacyExportBtn = document.getElementById('export-calendar');
    if (legacyExportBtn) {
        legacyExportBtn.addEventListener('click', exportEventsToCalendar);
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

    // Calendar events will be handled by calendarDayClick function

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
            setupDocumentFilters();
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
            updatePerformanceMetrics();
            break;
        case 'projects':
            loadProjectsData();
            break;
        case 'departments':
            setupDepartmentFilters();
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
    showNewSocialPostForm('taslak');
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
        title: formData.get('title'),
        description: formData.get('description'),
        project_type: formData.get('project_type'),
        status: formData.get('status'),
        budget_total: parseFloat(formData.get('budget_total')) || 0,
        budget_used: parseFloat(formData.get('budget_used')) || 0,
        progress_percentage: parseInt(formData.get('progress_percentage')) || 0,
        start_date: formData.get('start_date') || null,
        end_date: formData.get('end_date') || null,
        partners: JSON.stringify(partners)
    };

    // Validation
    if (!projectData.title || projectData.budget_total < 0) {
        alert('Lütfen Proje Adı giriniz ve geçerli bir bütçe değeri belirtiniz.');
        return;
    }

    if (projectData.budget_used > projectData.budget_total) {
        alert('Kullanılan bütçe toplam bütçeden fazla olamaz.');
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
    const content = `
        <div class="resource-form">
            <form id="resource-form">
                <div class="form-group">
                    <label>Kaynak Başlığı: *</label>
                    <input type="text" name="title" required placeholder="Kaynak adını girin">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Yazar:</label>
                        <input type="text" name="author" placeholder="Yazar adı">
                    </div>
                    <div class="form-group">
                        <label>ISBN:</label>
                        <input type="text" name="isbn" placeholder="ISBN (opsiyonel)">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Kaynak Türü: *</label>
                        <select name="resource_type" required>
                            <option value="">Tür seçin...</option>
                            <option value="kitap">Kitap</option>
                            <option value="dergi">Dergi</option>
                            <option value="makale">Makale</option>
                            <option value="pdf">PDF</option>
                            <option value="video">Video</option>
                            <option value="podcast">Podcast</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Zorluk Seviyesi:</label>
                        <select name="difficulty_level">
                            <option value="baslangic">Başlangıç</option>
                            <option value="orta" selected>Orta</option>
                            <option value="ileri">İleri</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Açıklama:</label>
                    <textarea name="description" rows="3" placeholder="Kaynak hakkında açıklama"></textarea>
                </div>

                <div class="form-group">
                    <label>Yaş Grupları:</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" name="age_group" value="cocuk"> Çocuk (6-12)</label>
                        <label><input type="checkbox" name="age_group" value="genc"> Genç (13-18)</label>
                        <label><input type="checkbox" name="age_group" value="yetiskin"> Yetişkin (18+)</label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Etiketler:</label>
                    <div class="tag-input-container">
                        <input type="text" id="resource-tag-input" class="tag-input" placeholder="Etiket ekle...">
                        <div class="selected-tags" id="resource-selected-tags"></div>
                    </div>
                    <small>Enter'a basarak etiket ekleyebilirsiniz</small>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Dosya Yolu:</label>
                        <input type="text" name="file_path" placeholder="Dosya yolu (opsiyonel)">
                    </div>
                    <div class="form-group">
                        <label>Dış Bağlantı:</label>
                        <input type="url" name="external_url" placeholder="https://...">
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Kaynak Ekle</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                </div>
            </form>
        </div>
    `;

    createModal('Yeni Kaynak Ekle', content);
    setupResourceForm();
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

    const partners = JSON.parse(project.partners || []);

    const content = `
        <div class="project-form">
            <form id="project-form">
                <div class="form-group">
                    <label>Proje Adı: *</label>
                    <input type="text" name="title" required placeholder="Proje adını girin" value="${project.title || project.name}">
                </div>
                <div class="form-group">
                    <label>Açıklama:</label>
                    <textarea name="description" rows="3" placeholder="Proje detaylarını açıklayın">${project.description || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Proje Türü:</label>
                        <select name="project_type">
                            <option value="">Tür Seçin</option>
                            <option value="Donanım" ${(project.project_type || project.type) === 'Donanım' ? 'selected' : ''}>Donanım</option>
                            <option value="Yazılım" ${(project.project_type || project.type) === 'Yazılım' ? 'selected' : ''}>Yazılım</option>
                            <option value="Araştırma" ${(project.project_type || project.type) === 'Araştırma' ? 'selected' : ''}>Araştırma</option>
                            <option value="Eğitim" ${(project.project_type || project.type) === 'Eğitim' ? 'selected' : ''}>Eğitim</option>
                            <option value="Sosyal" ${(project.project_type || project.type) === 'Sosyal' ? 'selected' : ''}>Sosyal</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Durum:</label>
                        <select name="status">
                            <option value="planlama" ${project.status === 'planlama' ? 'selected' : ''}>Planlama</option>
                            <option value="devam_ediyor" ${project.status === 'devam_ediyor' ? 'selected' : ''}>Devam Ediyor</option>
                            <option value="beklemede" ${project.status === 'beklemede' ? 'selected' : ''}>Beklemede</option>
                            <option value="tamamlandi" ${project.status === 'tamamlandi' ? 'selected' : ''}>Tamamlandı</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Toplam Bütçe (₺): *</label>
                        <input type="number" name="budget_total" min="0" step="0.01" required placeholder="0.00" value="${project.budget_total || 0}">
                    </div>
                    <div class="form-group">
                        <label>Kullanılan Bütçe (₺):</label>
                        <input type="number" name="budget_used" min="0" step="0.01" placeholder="0.00" value="${project.budget_used || 0}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Proje İlerlemesi (%):</label>
                    <input type="number" name="progress_percentage" min="0" max="100" placeholder="0" value="${project.progress_percentage || 0}">
                </div>
                <div class="form-group">
                    <label>Ortaklar (virgülle ayrılmış):</label>
                    <input type="text" name="partners" placeholder="Örn: TÜBİTAK, XYZ Teknoloji" value="${partners.join(', ')}">
                    <small>Ortak kurum/kuruluş isimlerini virgülle ayırarak ekleyin</small>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Başlangıç Tarihi:</label>
                        <input type="date" name="start_date" value="${project.start_date || ''}">
                    </div>
                    <div class="form-group">
                        <label>Bitiş Tarihi:</label>
                        <input type="date" name="end_date" value="${project.end_date || ''}">
                    </div>
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
        
        if (data.success) {
            populateSponsorFilter(data.sponsors || []);
        } else {
            throw new Error('API response invalid');
        }
    } catch (error) {
        console.error('Error loading sponsors:', error);
        // Fallback to sample data sponsors
        const sponsors = [...new Set(sampleData.events.map(event => event.sponsor).filter(sponsor => sponsor))];
        populateSponsorFilter(sponsors);
    }
}

function populateSponsorFilter(sponsors) {
    const sponsorFilter = document.getElementById('event-sponsor-filter');
    if (sponsorFilter) {
        // Clear existing options except first
        sponsorFilter.innerHTML = '<option value="">Tüm Sponsorlar</option>';

        sponsors.forEach(sponsor => {
            if (sponsor) {
                const option = document.createElement('option');
                option.value = sponsor;
                option.textContent = sponsor;
                sponsorFilter.appendChild(option);
            }
        });
    }
}

// Enhanced sponsor filtering function
function filterEventsBySponsor(sponsorName) {
    const events = sampleData.events.filter(event => {
        if (!sponsorName) return true; // Show all if no sponsor selected
        return event.sponsor === sponsorName || event.sponsor_company === sponsorName;
    });

    displayFilteredEvents(events);

    // Update filter dropdown to reflect selection
    const sponsorFilter = document.getElementById('event-sponsor-filter');
    if (sponsorFilter) {
        sponsorFilter.value = sponsorName;
    }

    showNotification(`${events.length} etkinlik "${sponsorName || 'Tüm Sponsorlar'}" için gösteriliyor`, 'info');
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
            generateICSFromSampleData();
        }
    } catch (error) {
        console.error('Calendar export error:', error);
        generateICSFromSampleData();
    }
}

// New enhanced calendar export function
async function exportEventsToCalendar() {
    try {
        showNotification('Takvim dosyası hazırlanıyor...', 'info');
        const typeFilter = document.getElementById('event-type-filter')?.value || '';
        const monthFilter = document.getElementById('event-month-filter')?.value || '';
        const sponsorFilter = document.getElementById('event-sponsor-filter')?.value || '';
        const searchTerm = document.getElementById('event-search')?.value || '';

        const params = new URLSearchParams({
            export: 'ics',
            type: typeFilter,
            month: monthFilter,
            sponsor: sponsorFilter,
            search: searchTerm
        });

        const response = await fetch(`/api/events.php?${params.toString()}`);
        if (response.ok) {
            const blob = await response.blob();
            downloadFile(blob, 'subu-asto-etkinlikler.ics', 'text/calendar');
            showNotification('Takvim dosyası indirildi!', 'success');
        } else {
            throw new Error('API response not ok');
        }
    } catch (error) {
        console.error('Calendar export error:', error);
        // Fallback to sample data
        generateICSFromSampleData();
    }
}

function generateICSFromSampleData() {
    try {
        const events = sampleData.events;
        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//SUBÜ ASTO//Events//TR',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        events.forEach(event => {
            const startDate = new Date(event.date || event.start_date);
            const endDate = event.end_date ? new Date(event.end_date) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later if no end date

            const formatDate = (date) => {
                return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            };

            icsContent.push(
                'BEGIN:VEVENT',
                `DTSTART:${formatDate(startDate)}`,
                `DTEND:${formatDate(endDate)}`,
                `SUMMARY:${event.title}`,
                `DESCRIPTION:${event.description || event.title}`,
                `LOCATION:${event.location || ''}`,
                `UID:${event.id}@subuasto.edu.tr`,
                `DTSTAMP:${formatDate(new Date())}`,
                `CREATED:${formatDate(new Date())}`,
                'STATUS:CONFIRMED',
                'TRANSP:OPAQUE',
                'END:VEVENT'
            );
        });

        icsContent.push('END:VCALENDAR');

        const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
        downloadFile(blob, 'subu-asto-etkinlikler.ics', 'text/calendar');
        showNotification('Takvim dosyası indirildi! (demo verisi)', 'success');
    } catch (error) {
        console.error('ICS generation error:', error);
        showNotification('Takvim dosyası oluşturulurken hata oluştu', 'error');
    }
}

function downloadFile(blob, filename, mimeType) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Social media board functions
async function loadSocialMediaBoard() {
    const platformFilter = document.getElementById('social-platform-filter')?.value.toLowerCase() || '';
    const searchTerm = document.getElementById('social-search')?.value.toLowerCase() || '';

    const statuses = ['taslak', 'planlandi', 'yayinlandi'];

    for (const status of statuses) {
        const container = document.getElementById(`social-${status}`);
        if (!container) continue;

        try {
            const response = await fetch(`/api/social_posts.php?status=${status}`);
            const data = await response.json();
            let posts = (data.posts || []).map(p => ({
                ...p,
                scheduledDate: p.scheduled_date,
                publishedAt: p.published_date
            }));

            if (platformFilter) {
                posts = posts.filter(post => (post.platform || '').toLowerCase().includes(platformFilter));
            }

            if (searchTerm) {
                posts = posts.filter(post => post.title.toLowerCase().includes(searchTerm));
            }

            const countElement = document.getElementById(`${status}-count`);
            if (countElement) {
                countElement.textContent = `(${posts.length})`;
            }

            container.innerHTML = posts.map(post => renderSocialPost(post)).join('');
        } catch (error) {
            console.error('Error loading social posts:', error);

            let posts = sampleData.socialMediaPosts.filter(post => post.status === status);
            if (platformFilter) {
                posts = posts.filter(post => post.platform.toLowerCase().includes(platformFilter));
            }
            if (searchTerm) {
                posts = posts.filter(post => post.title.toLowerCase().includes(searchTerm));
            }

            const countElement = document.getElementById(`${status}-count`);
            if (countElement) {
                countElement.textContent = `(${posts.length})`;
            }

            container.innerHTML = posts.map(post => renderSocialPost(post)).join('');
        }
    }
}

function setupSocialFilters() {
    const platformFilter = document.getElementById('social-platform-filter');
    const searchInput = document.getElementById('social-search');

    if (platformFilter) {
        platformFilter.addEventListener('change', loadSocialMediaBoard);
    }

    if (searchInput) {
        searchInput.addEventListener('input', loadSocialMediaBoard);
    }
}

function renderSocialPost(post) {
    const platformIcon = getSocialPlatformIcon(post.platform);
    const statusBadge = getSocialStatusBadge(post.status);
    const engagement = calculateEngagement(post);

    return `
        <div class="kanban-item social-post-item" 
             data-post-id="${post.id}" 
             data-status="${post.status}"
             draggable="true"
             ondragstart="dragSocialPost(event)"
             onclick="openSocialPostDetail(${post.id})">
            <div class="post-header">
                <div class="platform-info">
                    <span class="platform-icon">${platformIcon}</span>
                    <span class="platform-name">${post.platform}</span>
                </div>
                ${statusBadge}
            </div>
            <h4 class="post-title">${post.title}</h4>
            <div class="post-meta">
                ${post.author ? `<p><strong>Yazar:</strong> ${post.author}</p>` : ''}
                ${post.scheduledDate ? `<p><strong>Tarih:</strong> ${formatDate(post.scheduledDate)}</p>` : ''}
                ${post.publishedAt ? `<p><strong>Yayın:</strong> ${formatDate(post.publishedAt)}</p>` : ''}
                ${post.status === 'yayinlandi' && engagement > 0 ? `<p><strong>Etkileşim:</strong> ${engagement}</p>` : ''}
            </div>
            ${post.content_type ? `<span class="content-type-badge">${getContentTypeBadge(post.content_type)}</span>` : ''}
            <div class="post-actions">
                <button class="btn-sm" onclick="event.stopPropagation(); editSocialPost(${post.id})">✏️</button>
                <button class="btn-sm" onclick="event.stopPropagation(); duplicateSocialPost(${post.id})">📋</button>
                ${post.status === 'taslak' ? 
                    `<button class="btn-sm btn-success" onclick="event.stopPropagation(); schedulePost(${post.id})">📅</button>` : ''
                }
                ${post.status === 'planlandi' ? 
                    `<button class="btn-sm btn-success" onclick="event.stopPropagation(); publishPost(${post.id})">✅</button>` : ''
                }
                <button class="btn-sm btn-danger" onclick="event.stopPropagation(); deleteSocialPost(${post.id})">🗑️</button>
            </div>
        </div>
    `;
}

function getSocialPlatformIcon(platform) {
    const icons = {
        'Instagram': '📷',
        'TikTok': '🎵',
        'YouTube': '📺',
        'Twitter': '🐦',
        'Facebook': '👥',
        'LinkedIn': '💼',
        'Pinterest': '📌',
        'Snapchat': '👻'
    };
    return icons[platform] || '📱';
}

function getSocialStatusBadge(status) {
    const badges = {
        'taslak': '<span class="status-badge draft">Taslak</span>',
        'planlandi': '<span class="status-badge scheduled">Planlı</span>',
        'yayinlandi': '<span class="status-badge published">Yayınlandı</span>'
    };
    return badges[status] || '';
}

function getContentTypeBadge(type) {
    const types = {
        'post': '📝 Gönderi',
        'story': '📖 Hikaye',
        'reel': '🎬 Reel',
        'video': '🎥 Video',
        'carousel': '🖼️ Albüm',
        'live': '🔴 Canlı'
    };
    return types[type] || type;
}

function calculateEngagement(post) {
    const likes = post.likes || 0;
    const comments = post.comments || 0;
    const shares = post.shares || 0;
    const views = post.views || 0;

    if (typeof views === 'string' && views.includes('K')) {
        return views;
    }

    return likes + comments + shares;
}

// Drag and drop functions for social posts
function dragSocialPost(event) {
    event.dataTransfer.setData("text", event.target.dataset.postId);
}

function dropSocialPost(event) {
    event.preventDefault();
    const postId = event.dataTransfer.getData("text");
    const newStatus = event.currentTarget.closest('.kanban-column').dataset.status;

    updateSocialPostStatus(parseInt(postId), newStatus);
}

async function updateSocialPostStatus(postId, newStatus, extraData = {}, successMessage = 'Gönderi durumu güncellendi') {
    try {
        const response = await fetch('/api/social_posts.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: postId,
                status: newStatus,
                updated_at: new Date().toISOString(),
                ...extraData
            })
        });

        const result = await response.json();

        if (result.success) {
            const post = sampleData.socialMediaPosts.find(p => p.id === postId);
            if (post) {
                post.status = newStatus;
               if (extraData.scheduled_date) post.scheduledDate = extraData.scheduled_date;
                if (extraData.published_date) post.publishedAt = extraData.published_date;
                if (newStatus === 'yayinlandi' && !post.publishedAt) {
                    post.publishedAt = new Date().toISOString().split('T')[0];
                }
            }

            loadSocialMediaBoard();
                       showNotification(successMessage, 'success');
            return true;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Social post status update error:', error);
        const post = sampleData.socialMediaPosts.find(p => p.id === postId);
        if (post) {
            post.status = newStatus;
            if (extraData.scheduled_date) post.scheduledDate = extraData.scheduled_date;
            if (extraData.published_date) post.publishedAt = extraData.published_date;
            if (newStatus === 'yayinlandi' && !post.publishedAt) {
                post.publishedAt = new Date().toISOString().split('T')[0];
            }
        }
        loadSocialMediaBoard();
        showNotification(successMessage + ' (demo)', 'success');
        return false;
    }
}

// Social post management functions
function showNewSocialPostForm(initialStatus = 'taslak') {
    const content = `
        <div class="social-post-form">
            <form id="social-post-form">
                <div class="form-group">
                    <label>Başlık: *</label>
                    <input type="text" name="title" required placeholder="Gönderi başlığı">
                </div>
                <div class="form-group">
                    <label>İçerik: *</label>
                    <textarea name="content" rows="4" required placeholder="Gönderi içeriği yazın..."></textarea>
                    <small>Karakter sayısı: <span id="char-count">0</span></small>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Platform: *</label>
                        <select name="platform" required>
                            <option value="">Platform seçin</option>
                            <option value="Instagram">Instagram</option>
                            <option value="TikTok">TikTok</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Facebook">Facebook</option>
                            <option value="LinkedIn">LinkedIn</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>İçerik Türü:</label>
                        <select name="content_type">
                            <option value="post">Gönderi</option>
                            <option value="story">Hikaye</option>
                            <option value="reel">Reel</option>
                            <option value="video">Video</option>
                            <option value="carousel">Albüm</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Durum:</label>
                        <select name="status" id="post-status">
                            <option value="taslak" ${initialStatus === 'taslak' ? 'selected' : ''}>Taslak</option>
                            <option value="planlandi" ${initialStatus === 'planlandi' ? 'selected' : ''}>Planlı</option>
                            <option value="yayinlandi" ${initialStatus === 'yayinlandi' ? 'selected' : ''}>Yayınla</option>
                        </select>
                    </div>
                    <div class="form-group" id="schedule-group" style="display: none;">
                        <label>Planlanan Tarih:</label>
                        <input type="datetime-local" name="scheduled_date">
                    </div>
                </div>
                <div class="form-group">
                    <label>Etiketler:</label>
                    <input type="text" name="hashtags" placeholder="#etiket1 #etiket2 #etiket3">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Kaydet</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                </div>
            </form>
        </div>
    `;

    createModal('Yeni Sosyal Medya İçeriği', content);
    setupSocialPostForm();
}

function setupSocialPostForm() {
    const form = document.getElementById('social-post-form');
    const statusSelect = document.getElementById('post-status');
    const scheduleGroup = document.getElementById('schedule-group');
    const contentTextarea = form.querySelector('[name="content"]');
    const charCount = document.getElementById('char-count');

    // Show/hide schedule field based on status
    if (statusSelect && scheduleGroup) {
        statusSelect.addEventListener('change', function() {
            scheduleGroup.style.display = this.value === 'planlandi' ? 'block' : 'none';
        });
    }

    // Character counter
    if (contentTextarea && charCount) {
        contentTextarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const isEdit = this.dataset.editId;
            if (isEdit) {
                updateSocialPostData(new FormData(this), isEdit);
            } else {
                createSocialPostData(new FormData(this));
            }
        });
    }
}

async function createSocialPostData(formData) {
    const postData = {
        title: formData.get('title'),
        content: formData.get('content'),
        platform: formData.get('platform'),
        content_type: formData.get('content_type'),
        status: formData.get('status'),
        scheduled_date: formData.get('scheduled_date'),
        hashtags: formData.get('hashtags'),
        author: currentUser.email,
        created_by: currentUser.id || 1
    };

    try {
        const response = await fetch('/api/social_posts.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        const result = await response.json();

        if (result.success) {
            const newPost = {
                id: result.id,
                ...postData,
                likes: 0,
                comments: 0,
                shares: 0
            };
            sampleData.socialMediaPosts.push(newPost);

            closeModal();
            loadSocialMediaBoard();
            showNotification('Sosyal medya içeriği oluşturuldu!', 'success');
        } else {
            alert('İçerik oluşturulurken hata: ' + result.message);
        }
    } catch (error) {
        console.error('Social post creation error:', error);
        // Fallback for demo
        const newPost = {
            id: Date.now(),
            ...postData,
            likes: 0,
            comments: 0,
            shares: 0
        };
        sampleData.socialMediaPosts.push(newPost);
        closeModal();
        loadSocialMediaBoard();
        showNotification('İçerik oluşturuldu (demo modu)', 'success');
    }
}

async function schedulePost(postId) {
    const scheduleDate = prompt('Planlanan tarih ve saat (YYYY-MM-DD HH:MM):');
    if (!scheduleDate) return;

    await updateSocialPostStatus(postId, 'planlandi', { scheduled_date: scheduleDate }, 'Gönderi planlandı');
}

async function publishPost(postId) {
    if (!confirm('Bu gönderiyi hemen yayınlamak istediğinizden emin misiniz?')) {
        return;
    }

    await updateSocialPostStatus(postId, 'yayinlandi', { published_date: new Date().toISOString().split('T')[0] }, 'Gönderi yayınlandı!');
}

function duplicateSocialPost(postId) {
    const originalPost = sampleData.socialMediaPosts.find(p => p.id === postId);
    if (!originalPost) return;

    const duplicatedPost = {
        ...originalPost,
        id: Date.now(),
        title: originalPost.title + ' (Kopya)',
        status: 'taslak',
        publishedAt: null,
        scheduledDate: null,
        likes: 0,
        comments: 0,
        shares: 0
    };

    sampleData.socialMediaPosts.push(duplicatedPost);
    loadSocialMediaBoard();
    showNotification('Gönderi kopyalandı', 'success');
}

function deleteSocialPost(postId) {
    if (!confirm('Bu gönderiyi silmek istediğinizden emin misiniz?')) {
        return;
    }

    sampleData.socialMediaPosts = sampleData.socialMediaPosts.filter(p => p.id !== postId);
    loadSocialMediaBoard();
    showNotification('Gönderi silindi', 'success');
}

function refreshSocialBoard() {
    loadSocialMediaBoard();
    showNotification('Sosyal medya panosu yenilendi', 'info');
}

function exportSocialMediaReport() {
    const reportData = {
        posts: sampleData.socialMediaPosts,
        summary: {
            total: sampleData.socialMediaPosts.length,
            taslak: sampleData.socialMediaPosts.filter(p => p.status === 'taslak').length,
            planlandi: sampleData.socialMediaPosts.filter(p => p.status === 'planlandi').length,
            yayinlandi: sampleData.socialMediaPosts.filter(p => p.status === 'yayinlandi').length
        },
        generated_at: new Date().toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `sosyal-medya-raporu-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    showNotification('Sosyal medya raporu indirildi', 'success');
}

// Sky calendar event handling
function setupSkyCalendarEvents() {
    // Load sky events for current month
    loadSkyCalendarEvents();
}

// Handle calendar day clicks
function calendarDayClick(element) {
    const { eventId, day } = element.dataset;

    if (eventId) {
        // Navigate to event detail page
        window.location.href = `event.php?id=${eventId}&type=sky`;
    } else {
        // Show message for days without events
        showNotification(`${day} Aralık'ta herhangi bir gök olayı bulunmuyor`, 'info');
    }
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
                // Ensure every day has data-event-id attribute
        day.setAttribute('data-event-id', '');
        day.removeAttribute('data-event-type');
        day.removeAttribute('onclick');
        const existingDot = day.querySelector('.event-dot');
        if (existingDot) existingDot.remove();
    });

    // Add event indicators
    events.forEach(event => {
        const eventDate = new Date(event.event_date);
        const dayNumber = eventDate.getDate();
        const dayElement = document.querySelector(`.calendar-day[data-day="${dayNumber}"]`);

        if (dayElement) {
            dayElement.classList.add('has-event');
            dayElement.setAttribute('data-event-id', event.id);
            dayElement.setAttribute('data-event-type', event.event_type);
            dayElement.setAttribute('onclick', 'calendarDayClick(this)');
            dayElement.style.cursor = 'pointer';

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

// Document filter setup
function setupDocumentFilters() {
    const categoryFilter = document.getElementById('document-category-filter');
    const statusFilter = document.getElementById('document-status-filter');
    const searchInput = document.getElementById('document-search');

    [categoryFilter, statusFilter, searchInput].forEach(element => {
        if (element) {
            element.addEventListener('change', loadDocuments);
            if (element === searchInput) {
                element.addEventListener('input', loadDocuments);
            }
        }
    });
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

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('API response is not JSON');
        }

        const result = await response.json();

        if (result.success) {
            displayDocuments(result.data, result.user_role, result.can_approve_any);
        } else {
            console.error('Belge yükleme hatası:', result.error);
            // Fallback olarak örnek veriyi göster
            displayDocuments(sampleData.documents, currentUser.role, hasPermission('approve_documents'));
        }
    } catch (error) {
        console.error('Belgeler API hatası:', error);
        // Fallback to sample data with proper role checking
        displayDocuments(sampleData.documents, currentUser.role, hasPermission('approve_documents'));
    }
}

function displayDocuments(documents, userRole, canApproveAny) {
    const grid = document.querySelector('#documents .content-grid');
    if (!grid) return;

    // Filter documents based on role and visibility
    const filteredDocuments = documents.filter(document => {
        // Role-based visibility control
        if (userRole === 'başkan' || userRole === 'mentor') {
            return true; // Admins can see all documents
        }

        // For other users, check document access level and status
        const accessLevel = document.access_level || 'uyeler';
        const status = document.status || document.approval_status;

        switch (accessLevel) {
            case 'herkese_acik':
                return true;
            case 'uyeler':
                return status === 'yayinlandi' || status === 'onaylandi' || document.uploaded_by == (currentUser.id || 1);
            case 'yoneticiler':
                return userRole === 'başkan' || userRole === 'mentor' || userRole === 'birim_yoneticisi';
            case 'gizli':
                return document.uploaded_by == (currentUser.id || 1);
            default:
                return false;
        }
    });

    if (filteredDocuments.length === 0) {
        grid.innerHTML = '<div class="empty-state">Belge bulunamadı.</div>';
        return;
    }

    grid.innerHTML = filteredDocuments.map(document => {
        const statusClass = getDocumentStatusClass(document.approval_status || document.status);
        const statusText = getDocumentStatusText(document.approval_status || document.status);
        const canApprove = (userRole === 'başkan' || userRole === 'mentor') && canApproveAny;
        const canEdit = document.uploaded_by == (currentUser.id || 1) || userRole === 'başkan';
        const isPending = (document.approval_status === 'bekliyor' || document.status === 'onay_bekliyor');

        return `
            <div class="card document-card" data-status="${document.status}" data-approval="${document.approval_status}">
                <div class="document-icon">📄</div>
                <h3>${document.title}</h3>
                <p><strong>Kategori:</strong> ${document.document_type || document.category}</p>
                <p><strong>Durum:</strong> <span class="status ${statusClass}">${statusText}</span></p>
                <p><strong>Yükleyen:</strong> ${document.uploader_name || 'Bilinmiyor'}</p>
                ${document.approved_by ? `<p><strong>Onaylayan:</strong> ${document.approver_name}</p>` : ''}
                ${document.approved_at ? `<p><strong>Onay Tarihi:</strong> ${formatDate(document.approved_at)}</p>` : ''}
                ${document.rejection_reason ? `<p><strong>Red Nedeni:</strong> ${document.rejection_reason}</p>` : ''}
                <div class="card-actions">
                    <button class="btn btn-sm" onclick="viewDocument(${document.id})">İncele</button>
                    <button class="btn btn-sm btn-outline" onclick="downloadDocument(${document.id})">İndir</button>
                    ${canApprove && isPending ? `
                        <button class="btn btn-sm btn-success" onclick="approveDocument(${document.id})">✓ Onayla</button>
                        <button class="btn btn-sm btn-danger" onclick="rejectDocument(${document.id})">✗ Reddet</button>
                    ` : ''}
                    ${(document.uploaded_by == (currentUser.id || 1)) && (document.status === 'taslak' || !document.status) ? `
                        <button class="btn btn-sm btn-primary" onclick="submitDocumentForApproval(${document.id})">Onaya Gönder</button>
                    ` : ''}
                    ${canEdit ? `
                        <button class="btn btn-sm btn-secondary" onclick="editDocument(${document.id})">Düzenle</button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
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
async function loadMembersData() {
    try {
        const response = await fetch('/api/users.php');
        const data = await response.json();

        if (data.success) {
            displayMembers(data.users);
            updateRiskIndicators();
        } else {
            console.error('Üye yükleme hatası:', data.error);
            displaySampleMembers();
            updateRiskIndicators();
        }
    } catch (error) {
        console.error('Üyeler API hatası:', error);
        displaySampleMembers();
        updateRiskIndicators();
    }

    // Load contact logs
    loadContactLogs();
}

function displayMembers(members) {
    const container = document.querySelector('.members-grid');
    if (!container) return;

    container.innerHTML = members.map(member => {
        const riskClass = getRiskStatusClass(member.risk_status);
        const riskText = getRiskStatusText(member.risk_status);
        const avatarInitial = member.full_name ? member.full_name.charAt(0).toUpperCase() : '?';

        return `
            <div class="member-card" data-member-id="${member.id}">
                <div class="member-avatar">${avatarInitial}</div>
                <div class="risk-indicator ${riskClass}" title="Risk Durumu: ${riskText}">●</div>
                <h3>${member.full_name}</h3>
                <p><strong>Rol:</strong> ${member.role}</p>
                <p><strong>Birim:</strong> ${member.department || 'Belirtilmemiş'}</p>
                <p><strong>E-posta:</strong> ${member.email}</p>
                <p><strong>Son Giriş:</strong> ${member.last_login ? formatDateTime(member.last_login) : 'Hiç giriş yapmadı'}</p>
                <p><strong>Risk Durumu:</strong> <span class="risk-text ${riskClass}">${riskText}</span></p>
                <div class="card-actions">
                    <button class="btn btn-sm" onclick="editMember(${member.id})">Düzenle</button>
                    <button class="btn btn-sm btn-outline" onclick="viewContactHistory(${member.id})">İletişim Geçmişi</button>
                    <button class="btn btn-sm btn-outline" onclick="updateRiskStatus(${member.id})">Risk Güncelle</button>
                </div>
            </div>
        `;
    }).join('');
}

function displaySampleMembers() {
    const container = document.querySelector('.members-grid');
    if (!container) return;

    // Update sample data with risk status
    const sampleMembersWithRisk = sampleData.members.map(member => ({
        ...member,
        risk_status: member.risk_status || (Math.random() > 0.8 ? 'kirmizi' : Math.random() > 0.6 ? 'sari' : 'normal')
    }));

    container.innerHTML = sampleMembersWithRisk.map(member => {
        const riskClass = getRiskStatusClass(member.risk_status);
        const riskText = getRiskStatusText(member.risk_status);
        const avatarInitial = member.name ? member.name.charAt(0).toUpperCase() : '?';

        return `
            <div class="member-card" data-member-id="${member.id}">
                <div class="member-avatar">${avatarInitial}</div>
                <div class="risk-indicator ${riskClass}" title="Risk Durumu: ${riskText}">●</div>
                <h3>${member.name}</h3>
                <p><strong>Rol:</strong> ${member.role}</p>
                <p><strong>E-posta:</strong> ${member.email || member.name.toLowerCase().replace(' ', '.') + '@subuasto.edu.tr'}</p>
                <p><strong>Kayıt Tarihi:</strong> ${member.joinDate}</p>
                <p><strong>Risk Durumu:</strong> <span class="risk-text ${riskClass}">${riskText}</span></p>
                <div class="card-actions">
                    <button class="btn btn-sm" onclick="editMember(${member.id})">Düzenle</button>
                    <button class="btn btn-sm btn-outline" onclick="viewContactHistory(${member.id})">İletişim Geçmişi</button>
                    <button class="btn btn-sm btn-outline" onclick="updateRiskStatus(${member.id})">Risk Güncelle</button>
                </div>
            </div>
        `;
    }).join('');
}

function getRiskStatusClass(status) {
    const classes = {
        'normal': 'normal',
        'sari': 'warning',
        'kirmizi': 'danger'
    };
    return classes[status] || 'normal';
}

function getRiskStatusText(status) {
    const texts = {
        'normal': 'Normal',
        'sari': 'Dikkat',
        'kirmizi': 'Yüksek Risk'
    };
    return texts[status] || 'Bilinmiyor';
}

async function loadContactLogs(memberId = null) {
    const container = document.getElementById('contact-logs-list');
    if (!container) return;

    try {
        const params = memberId ? `?member=${memberId}` : '';
        const response = await fetch(`/api/contact_logs.php${params}`);
        const data = await response.json();

        if (data.success) {
            displayContactLogs(data.logs, container);
        } else {
            console.error('İletişim kayıtları yükleme hatası:', data.error);
            displaySampleContactLogs(container);
        }
    } catch (error) {
        console.error('İletişim kayıtları API hatası:', error);
        displaySampleContactLogs(container);
    }
}

function displayContactLogs(logs, container) {
    if (logs.length === 0) {
        container.innerHTML = '<div class="empty-state">İletişim kaydı bulunamadı.</div>';
        return;
    }

    container.innerHTML = logs.map(log => `
        <div class="contact-log-item" data-log-id="${log.id}">
            <div class="log-header">
                <h4>${log.company_name || log.member_name || 'Bilinmiyor'}</h4>
                <span class="status-badge ${log.response_status}">${getResponseStatusText(log.response_status)}</span>
                <span class="priority-badge ${log.priority}">${getPriorityText(log.priority)}</span>
            </div>
            <div class="log-content">
                <p><strong>Konu:</strong> ${log.subject}</p>
                <p><strong>İletişim Türü:</strong> ${getContactTypeText(log.contact_type)}</p>
                <p><strong>Tarih:</strong> ${formatDateTime(log.contact_date)}</p>
                ${log.message ? `<p><strong>Mesaj:</strong> ${log.message}</p>` : ''}
                ${log.notes ? `<p><strong>Notlar:</strong> ${log.notes}</p>` : ''}
                ${log.follow_up_date ? `<p><strong>Takip Tarihi:</strong> ${formatDateTime(log.follow_up_date)}</p>` : ''}
                <small>Ekleyen: ${log.created_by_name} - ${formatDateTime(log.created_at)}</small>
            </div>
            <div class="log-actions">
                <button class="btn btn-sm" onclick="editContactLog(${log.id})">Düzenle</button>
                <button class="btn btn-sm btn-outline" onclick="addFollowUp(${log.id})">Takip Ekle</button>
                <button class="btn btn-sm btn-danger" onclick="deleteContactLog(${log.id})">Sil</button>
            </div>
        </div>
    `).join('');
}

function displaySampleContactLogs(container) {
    const sampleLogs = [
        { id: 1, company_name: 'ABC Optik', subject: 'Sponsorluk talebi', contact_type: 'email', contact_date: '2024-12-01', response_status: 'bekliyor', priority: 'yuksek' },
        { id: 2, company_name: 'XYZ Teknoloji', subject: 'İşbirliği önerisi', contact_type: 'telefon', contact_date: '2024-11-28', response_status: 'yanitlandi', priority: 'orta' }
    ];

    container.innerHTML = sampleLogs.map(log => `
        <div class="contact-log-item">
            <div class="log-header">
                <h4>${log.company_name}</h4>
                <span class="status-badge ${log.response_status}">${getResponseStatusText(log.response_status)}</span>
            </div>
            <div class="log-content">
                <p><strong>Konu:</strong> ${log.subject}</p>
                <p><strong>Tarih:</strong> ${log.contact_date}</p>
                <small>Demo veri</small>
            </div>
        </div>
    `).join('');
}

function getContactTypeText(type) {
    const types = {
        'email': 'E-posta',
        'telefon': 'Telefon',
        'whatsapp': 'WhatsApp',
        'yuz_yuze': 'Yüz Yüze',
        'toplanti': 'Toplantı',
        'diger': 'Diğer'
    };
    return types[type] || type;
}

function getResponseStatusText(status) {
    const statuses = {
        'bekliyor': 'Bekliyor',
        'yanitlandi': 'Yanıtlandı',
        'takip_edilecek': 'Takip Edilecek',
        'tamamlandi': 'Tamamlandı'
    };
    return statuses[status] || status;
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR');
}

function updateRiskIndicators() {
    document.querySelectorAll('.risk-indicator').forEach(indicator => {
        const status = indicator.classList.contains('warning') ? 'warning' :
                      indicator.classList.contains('danger') ? 'danger' : 'normal';
        indicator.style.color = status === 'danger' ? '#ef4444' :
                               status === 'warning' ? '#f59e0b' : '#10b981';
    });
}

async function viewContactHistory(memberId) {
    try {
        const response = await fetch(`/api/contact_logs.php?member=${memberId}`);
        const data = await response.json();

        let content = `
            <div class="detail-content">
                <h3>İletişim Geçmişi</h3>
                <div class="contact-timeline" id="member-contact-timeline">
        `;

        if (data.success && data.logs.length > 0) {
            content += data.logs.map(log => `
                <div class="timeline-item">
                    <div class="timeline-date">${formatDateTime(log.contact_date)}</div>
                    <div class="timeline-content">
                        <h5>${log.subject}</h5>
                        <p><strong>Tür:</strong> ${getContactTypeText(log.contact_type)}</p>
                        ${log.company_name ? `<p><strong>Firma:</strong> ${log.company_name}</p>` : ''}
                        ${log.message ? `<p><strong>Mesaj:</strong> ${log.message}</p>` : ''}
                        <span class="status-badge ${log.response_status}">${getResponseStatusText(log.response_status)}</span>
                    </div>
                </div>
            `).join('');
        } else {
            content += '<p>Bu üye için henüz iletişim kaydı bulunmuyor.</p>';
        }

        content += `
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="addContactEntry(${memberId})">Yeni Kayıt</button>
                    <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
                </div>
            </div>
        `;

        createModal('İletişim Geçmişi', content);
    } catch (error) {
        console.error('İletişim geçmişi yükleme hatası:', error);

        // Fallback to sample data
        const content = `
            <div class="detail-content">
                <h3>İletişim Geçmişi</h3>
                <div class="contact-timeline">
                    <div class="timeline-item">
                        <div class="timeline-date">2024-12-01</div>
                        <div class="timeline-content">
                            <h5>E-posta gönderildi</h5>
                            <p>Sponsorluk talebi hakkında</p>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary" onclick="addContactEntry(${memberId})">Yeni Kayıt</button>
                    <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
                </div>
            </div>
        `;
        createModal('İletişim Geçmişi', content);
    }
}

function addContactEntry(memberId) {
    closeModal();

    const content = `
        <div class="contact-form">
            <form id="contact-log-form">
                <input type="hidden" name="member_id" value="${memberId}">
                <input type="hidden" name="created_by" value="${currentUser.id || 1}">

                <div class="form-row">
                    <div class="form-group">
                        <label>İletişim Türü: *</label>
                        <select name="contact_type" required>
                            <option value="">Seçin...</option>
                            <option value="email">E-posta</option>
                            <option value="telefon">Telefon</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="yuz_yuze">Yüz Yüze</option>
                            <option value="toplanti">Toplantı</option>
                            <option value="diger">Diğer</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Öncelik:</label>
                        <select name="priority">
                            <option value="dusuk">Düşük</option>
                            <option value="orta" selected>Orta</option>
                            <option value="yuksek">Yüksek</option>
                            <option value="acil">Acil</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Firma Adı:</label>
                    <input type="text" name="company_name" placeholder="Firma adı (opsiyonel)">
                </div>

                <div class="form-group">
                    <label>Konu: *</label>
                    <input type="text" name="subject" required placeholder="İletişim konusu">
                </div>

                <div class="form-group">
                    <label>İletişim Tarihi: *</label>
                    <input type="datetime-local" name="contact_date" required>
                </div>

                <div class="form-group">
                    <label>Mesaj/Detaylar:</label>
                    <textarea name="message" rows="3" placeholder="İletişim detayları"></textarea>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Durum:</label>
                        <select name="response_status">
                            <option value="bekliyor">Bekliyor</option>
                            <option value="yanitlandi">Yanıtlandı</option>
                            <option value="takip_edilecek">Takip Edilecek</option>
                            <option value="tamamlandi">Tamamlandı</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Takip Tarihi:</label>
                        <input type="datetime-local" name="follow_up_date">
                    </div>
                </div>

                <div class="form-group">
                    <label>Notlar:</label>
                    <textarea name="notes" rows="2" placeholder="Ek notlar"></textarea>
                </div>

                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Kaydet</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                </div>
            </form>
        </div>
    `;

    createModal('Yeni İletişim Kaydı', content);
    setupContactLogForm();
}

function setupContactLogForm() {
    const form = document.getElementById('contact-log-form');
    if (form) {
        // Set default contact date to now
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        form.contact_date.value = now.toISOString().slice(0, 16);

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/contact_logs.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    closeModal();
                    loadContactLogs(); // Refresh contact logs
                    showNotification('İletişim kaydı eklendi!', 'success');
                } else {
                    alert('Hata: ' + result.error);
                }
            } catch (error) {
                console.error('İletişim kaydı ekleme hatası:', error);
                closeModal();
                showNotification('İletişim kaydı eklendi (demo modu)', 'success');
            }
        });
    }
}

async function updateRiskStatus(memberId) {
    const member = sampleData.members.find(m => m.id === memberId);
    const currentRisk = member?.risk_status || 'normal';

    const content = `
        <div class="risk-update-form">
            <h3>Risk Durumu Güncelle</h3>
            <form id="risk-update-form">
                <input type="hidden" name="member_id" value="${memberId}">

                <div class="form-group">
                    <label>Risk Durumu:</label>
                    <select name="risk_status" required>
                        <option value="normal" ${currentRisk === 'normal' ? 'selected' : ''}>🟢 Normal</option>
                        <option value="sari" ${currentRisk === 'sari' ? 'selected' : ''}>🟡 Dikkat</option>
                        <option value="kirmizi" ${currentRisk === 'kirmizi' ? 'selected' : ''}>🔴 Yüksek Risk</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Risk Sebebi:</label>
                    <textarea name="risk_reason" rows="3" placeholder="Risk durumu değişikliğinin sebebini açıklayın..."></textarea>
                </div>

                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Güncelle</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                </div>
            </form>
        </div>
    `;

    createModal('Risk Durumu Güncelle', content);
    setupRiskUpdateForm();
}

function setupRiskUpdateForm() {
    const form = document.getElementById('risk-update-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const memberId = formData.get('member_id');
            const riskStatus = formData.get('risk_status');
            const riskReason = formData.get('risk_reason');

            try {
                const response = await fetch('/api/users.php', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: memberId,
                        risk_status: riskStatus
                    })
                });

                const result = await response.json();

                if (result.success) {
                    // Log the risk status change
                    if (riskReason) {
                        await fetch('/api/contact_logs.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                member_id: memberId,
                                contact_type: 'diger',
                                subject: `Risk durumu güncellendi: ${getRiskStatusText(riskStatus)}`,
                                message: riskReason,
                                contact_date: new Date().toISOString(),
                                response_status: 'tamamlandi',
                                created_by: currentUser.id || 1
                            })
                        });
                    }

                    closeModal();
                    loadMembersData(); // Refresh members list
                    showNotification('Risk durumu güncellendi!', 'success');
                } else {
                    alert('Hata: ' + result.error);
                }
            } catch (error) {
                console.error('Risk durumu güncelleme hatası:', error);
                // Fallback for demo
                const member = sampleData.members.find(m => m.id == memberId);
                if (member) {
                    member.risk_status = riskStatus;
                    loadMembersData();
                    showNotification('Risk durumu güncellendi (demo modu)', 'success');
                }
                closeModal();
            }
        });
    }
}

async function editContactLog(logId) {
    // Implementation for editing contact logs
    console.log('Edit contact log:', logId);
    alert('İletişim kaydı düzenleme özelliği yakında eklenecek');
}

async function addFollowUp(logId) {
    // Implementation for adding follow-up
    console.log('Add follow-up for log:', logId);
    alert('Takip ekleme özelliği yakında eklenecek');
}

async function deleteContactLog(logId) {
    if (!confirm('Bu iletişim kaydını silmek istediğinizden emin misiniz?')) {
        return;
    }

    try {
        const response = await fetch(`/api/contact_logs.php?id=${logId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            loadContactLogs(); // Refresh logs
            showNotification('İletişim kaydı silindi', 'success');
        } else {
            alert('Hata: ' + result.error);
        }
    } catch (error) {
        console.error('İletişim kaydı silme hatası:', error);
        showNotification('İletişim kaydı silindi (demo modu)', 'success');
    }
}

// Department filtering functions
function setupDepartmentFilters() {
    const statusFilter = document.getElementById('department-status-filter');
    const sizeFilter = document.getElementById('department-size-filter');
    const budgetFilter = document.getElementById('department-budget-filter');
    const searchInput = document.getElementById('department-search');

    [statusFilter, sizeFilter, budgetFilter, searchInput].forEach(element => {
        if (element) {
            element.addEventListener('change', filterDepartments);
            if (element === searchInput) {
                element.addEventListener('input', filterDepartments);
            }
        }
    });

    // Load saved shortcuts
    loadSavedShortcuts();
}

function filterDepartments(filterObj = null) {
    const statusFilter = document.getElementById('department-status-filter')?.value || '';
    const sizeFilter = document.getElementById('department-size-filter')?.value || '';
    const budgetFilter = document.getElementById('department-budget-filter')?.value || '';
    const searchTerm = document.getElementById('department-search')?.value.toLowerCase() || '';

    // If filterObj is provided, apply it directly
    if (filterObj) {
        applyFilterObject(filterObj);
        return;
    }

    const departmentCards = document.querySelectorAll('.department-card');
    let visibleCount = 0;

    departmentCards.forEach(card => {
        const status = card.getAttribute('data-status');
        const memberCount = parseInt(card.getAttribute('data-member-count'));
        const budget = parseInt(card.getAttribute('data-budget'));
        const activeProjects = parseInt(card.getAttribute('data-active-projects'));
        const departmentName = card.querySelector('h3').textContent.toLowerCase();

        let isVisible = true;

        // Status filter
        if (statusFilter && status !== statusFilter) {
            isVisible = false;
        }

        // Size filter
        if (sizeFilter && !matchesSizeFilter(memberCount, sizeFilter)) {
            isVisible = false;
        }

        // Budget filter
        if (budgetFilter && !matchesBudgetFilter(budget, budgetFilter)) {
            isVisible = false;
        }

        // Search filter
        if (searchTerm && !departmentName.includes(searchTerm)) {
            isVisible = false;
        }

        // Apply visibility
        card.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });

    updateDepartmentCounter(visibleCount, departmentCards.length);
}

function matchesSizeFilter(memberCount, sizeFilter) {
    switch (sizeFilter) {
        case 'small': return memberCount >= 1 && memberCount <= 5;
        case 'medium': return memberCount >= 6 && memberCount <= 15;
        case 'large': return memberCount >= 16;
        default: return true;
    }
}

function matchesBudgetFilter(budget, budgetFilter) {
    switch (budgetFilter) {
        case 'low': return budget >= 0 && budget <= 5000;
        case 'medium': return budget > 5000 && budget <= 20000;
        case 'high': return budget > 20000;
        default: return true;
    }
}

function applyFilterObject(filterObj) {
    const departmentCards = document.querySelectorAll('.department-card');
    let visibleCount = 0;

    departmentCards.forEach(card => {
        const memberCount = parseInt(card.getAttribute('data-member-count'));
        const budget = parseInt(card.getAttribute('data-budget'));
        const activeProjects = parseInt(card.getAttribute('data-active-projects'));
        const status = card.getAttribute('data-status');

        let isVisible = true;

        // Apply filter conditions
        if (filterObj.hasActiveProjects && activeProjects === 0) {
            isVisible = false;
        }

        if (filterObj.activityLevel === 'high' && activeProjects < 3) {
            isVisible = false;
        }

        if (filterObj.needsAttention && (status === 'aktif' && activeProjects > 0)) {
            isVisible = false;
        }

        if (filterObj.lowMemberCount && memberCount > 5) {
            isVisible = false;
        }

        if (filterObj.highBudget && budget <= 20000) {
            isVisible = false;
        }

        if (filterObj.status && status !== filterObj.status) {
            isVisible = false;
        }

        if (filterObj.minMembers && memberCount < filterObj.minMembers) {
            isVisible = false;
        }

        if (filterObj.maxMembers && memberCount > filterObj.maxMembers) {
            isVisible = false;
        }

        card.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
    });

    updateDepartmentCounter(visibleCount, departmentCards.length);
}

function applyDepartmentShortcut(shortcutType) {
    const shortcuts = {
        'active-projects': { 
            hasActiveProjects: true,
            name: 'Aktif Projeli Birimler'
        },
        'high-activity': { 
            activityLevel: 'high',
            name: 'Yüksek Aktiviteli Birimler'
        },
        'needs-attention': { 
            needsAttention: true,
            name: 'Dikkat Gereken Birimler'
        },
        'low-member-count': { 
            lowMemberCount: true,
            name: 'Az Üyeli Birimler'
        },
        'high-budget': { 
            highBudget: true,
            name: 'Yüksek Bütçeli Birimler'
        }
    };

    const shortcut = shortcuts[shortcutType];
    if (shortcut) {
        filterDepartments(shortcut);

        // Save to localStorage
        const filterHistory = getFilterHistory();
        filterHistory.unshift({
            ...shortcut,
            timestamp: new Date().toISOString(),
            type: shortcutType
        });

        // Keep only last 10 filters
        if (filterHistory.length > 10) {
            filterHistory.splice(10);
        }

        localStorage.setItem('departmentFilterHistory', JSON.stringify(filterHistory));

        showNotification(`${shortcut.name} filtresi uygulandı`, 'info');
        updateActiveShortcutIndicator(shortcutType);
    }
}

function clearDepartmentFilters() {
    // Clear all filter inputs
    document.getElementById('department-status-filter').value = '';
    document.getElementById('department-size-filter').value = '';
    document.getElementById('department-budget-filter').value = '';
    document.getElementById('department-search').value = '';

    // Show all departments
    const departmentCards = document.querySelectorAll('.department-card');
    departmentCards.forEach(card => {
        card.style.display = 'block';
    });

    updateDepartmentCounter(departmentCards.length, departmentCards.length);
    clearActiveShortcutIndicator();
    showNotification('Tüm filtreler temizlendi', 'success');
}

function saveDepartmentFilterShortcut() {
    const statusFilter = document.getElementById('department-status-filter').value;
    const sizeFilter = document.getElementById('department-size-filter').value;
    const budgetFilter = document.getElementById('department-budget-filter').value;
    const searchTerm = document.getElementById('department-search').value;

    if (!statusFilter && !sizeFilter && !budgetFilter && !searchTerm) {
        alert('Kaydetmek için en az bir filtre seçmelisiniz!');
        return;
    }

    const shortcutName = prompt('Kısayol adını girin:');
    if (!shortcutName) return;

    const filterObj = {
        status: statusFilter,
        sizeFilter: sizeFilter,
        budgetFilter: budgetFilter,
        searchTerm: searchTerm,
        name: shortcutName,
        created: new Date().toISOString()
    };

    const savedShortcuts = getSavedShortcuts();
    savedShortcuts.push(filterObj);
    localStorage.setItem('departmentSavedShortcuts', JSON.stringify(savedShortcuts));

    loadSavedShortcuts();
    showNotification(`"${shortcutName}" kısayolu kaydedildi!`, 'success');
}

function getSavedShortcuts() {
    return JSON.parse(localStorage.getItem('departmentSavedShortcuts') || '[]');
}

function getFilterHistory() {
    return JSON.parse(localStorage.getItem('departmentFilterHistory') || '[]');
}

function loadSavedShortcuts() {
    const shortcuts = getSavedShortcuts();
    const container = document.getElementById('saved-shortcuts-container');
    const list = document.getElementById('saved-shortcuts-list');

    if (shortcuts.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    list.innerHTML = shortcuts.map((shortcut, index) => `
        <div class="saved-shortcut-item">
            <button class="btn btn-sm btn-outline" onclick="applySavedShortcut(${index})">
                📌 ${shortcut.name}
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteSavedShortcut(${index})" title="Sil">
                ×
            </button>
        </div>
    `).join('');
}

function applySavedShortcut(index) {
    const shortcuts = getSavedShortcuts();
    const shortcut = shortcuts[index];

    if (!shortcut) return;

    // Apply the saved filters
    if (shortcut.status) {
        document.getElementById('department-status-filter').value = shortcut.status;
    }
    if (shortcut.sizeFilter) {
        document.getElementById('department-size-filter').value = shortcut.sizeFilter;
    }
    if (shortcut.budgetFilter) {
        document.getElementById('department-budget-filter').value = shortcut.budgetFilter;
    }
    if (shortcut.searchTerm) {
        document.getElementById('department-search').value = shortcut.searchTerm;
    }

    filterDepartments();
    showNotification(`"${shortcut.name}" kısayolu uygulandı`, 'success');
}

function deleteSavedShortcut(index) {
    const shortcuts = getSavedShortcuts();
    const shortcut = shortcuts[index];

    if (!confirm(`"${shortcut.name}" kısayolunu silmek istediğinizden emin misiniz?`)) {
        return;
    }

    shortcuts.splice(index, 1);
    localStorage.setItem('departmentSavedShortcuts', JSON.stringify(shortcuts));
    loadSavedShortcuts();
    showNotification('Kısayol silindi', 'info');
}

function updateDepartmentCounter(visible, total) {
    const existingCounter = document.querySelector('.department-counter');
    if (existingCounter) {
        existingCounter.remove();
    }

    if (visible !== total) {
        const counter = document.createElement('div');
        counter.className = 'department-counter';
        counter.innerHTML = `<small>Gösterilen: ${visible} / ${total} birim</small>`;
        document.querySelector('#departments .section-header').appendChild(counter);
    }
}

function updateActiveShortcutIndicator(activeType) {
    // Remove previous active indicators
    document.querySelectorAll('.filter-shortcuts .btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active indicator to current shortcut
    const activeBtn = document.querySelector(`[onclick="applyDepartmentShortcut('${activeType}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function clearActiveShortcutIndicator() {
    document.querySelectorAll('.filter-shortcuts .btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Additional utility functions
async function loadEventsData() {
    try {
        const response = await fetch('/api/events.php');
        const data = await response.json();

        if (data.success) {
            displayFilteredEvents(data.events);
        } else {
            displayFilteredEvents(sampleData.events);
        }
    } catch (error) {
        console.error('Error loading events:', error);
        displayFilteredEvents(sampleData.events);
    }
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

    // Set default date range to last 30 days
    if (dateToFilter) {
        dateToFilter.value = new Date().toISOString().split('T')[0];
    }
    if (dateFromFilter) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateFromFilter.value = thirtyDaysAgo.toISOString().split('T')[0];
    }
}

async function filterMediaFiles() {
    const typeFilter = document.getElementById('media-type-filter')?.value || '';
    const categoryFilter = document.getElementById('media-category-filter')?.value || '';
    const dateFrom = document.getElementById('media-date-from')?.value || '';
    const dateTo = document.getElementById('media-date-to')?.value || '';
    const searchTerm = document.getElementById('media-search')?.value.toLowerCase() || '';

    try {
        const params = new URLSearchParams();
        if (typeFilter) params.append('type', typeFilter);
        if (categoryFilter) params.append('category', categoryFilter);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        if (searchTerm) params.append('search', searchTerm);

        const response = await fetch(`/api/files.php?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response is not JSON');
        }

        const data = await response.json();

        if (data.success) {
            displayMediaFiles(data.files);
            updateMediaFilterSummary(data.filtered_count, data.total_count);
        } else {
            console.error('Medya filtreleme hatası:', data.error);
            filterMediaFilesLocal();
        }
    } catch (error) {
        console.error('Medya API hatası:', error);
        filterMediaFilesLocal();
    }
}

function compareDates(fileDate, filterDate) {
    // Convert file date (e.g., "2024-12-15") and filter date for comparison
    const fDate = new Date(fileDate);
    const filterDateObj = new Date(filterDate);
    return fDate.getTime() - filterDateObj.getTime();
}

function updateMediaFilterSummary(filteredCount, totalCount) {
    const summary = document.getElementById('media-filter-summary');
    const countSpan = summary?.querySelector('.filter-count');

    if (summary && countSpan) {
        countSpan.textContent = `${filteredCount} / ${totalCount} dosya gösteriliyor`;
        summary.style.display = filteredCount !== totalCount ? 'block' : 'none';
    }
}

function clearMediaDateFilters() {
    document.getElementById('media-date-from').value = '';
    document.getElementById('media-date-to').value = '';
    filterMediaFiles();
}

function clearAllMediaFilters() {
    document.getElementById('media-type-filter').value = '';
    document.getElementById('media-category-filter').value = '';
    document.getElementById('media-date-from').value = '';
    document.getElementById('media-date-to').value = '';
    document.getElementById('media-search').value = '';
    filterMediaFiles();
}

function displayMediaFiles(files) {
    const grid = document.getElementById('media-grid');
    if (!grid) return;

    if (files.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>Seçilen kriterlere uygun medya dosyası bulunamadı.</p>
                <button class="btn btn-primary" onclick="clearAllMediaFilters()">Filtreleri Temizle</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = files.map(file => {
        const uploadDate = formatMediaDate(file.uploadedAt || file.uploaded_at);
        const fileSize = formatFileSize(file.file_size || parseFileSizeString(file.size));
        const category = getCategoryDisplayName(file.category);
        const uploader = file.uploader_name || 'Bilinmiyor';

        return `
            <div class="media-item" onclick="viewMediaFile(${file.id})" data-category="${file.category}" data-type="${file.type}">
                <div class="media-thumbnail">
                    ${getFileIcon(file.type)}
                    <div class="file-type-badge">${file.type.toUpperCase()}</div>
                </div>
                <div class="media-info">
                    <h4 title="${file.title}">${file.title}</h4>
                    <div class="media-meta">
                        <p><strong>Kategori:</strong> <span class="category-tag">${category}</span></p>
                        <p><strong>Boyut:</strong> ${fileSize}</p>
                        <p><strong>Tarih:</strong> ${uploadDate}</p>
                        <p><strong>Yükleyen:</strong> ${uploader}</p>
                        ${file.download_count ? `<p><strong>İndirme:</strong> ${file.download_count}</p>` : ''}
                    </div>
                </div>
                <div class="media-actions">
                    <button class="btn btn-sm" onclick="event.stopPropagation(); downloadMediaFile(${file.id})" title="İndir">📥</button>
                    <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); showMediaVersions(${file.id})" title="Sürümler">🕒</button>
                    <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); editMediaFile(${file.id})" title="Düzenle">✏️</button>
                </div>
            </div>
        `;
    }).join('');
}

// Helper function to parse file size strings like "2.4 MB"
function parseFileSizeString(sizeStr) {
    if (!sizeStr || typeof sizeStr === 'number') return sizeStr;

    const match = sizeStr.match(/^([\d.]+)\s*(B|KB|MB|GB)$/i);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();

    const multipliers = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
    return value * (multipliers[unit] || 1);
}

function formatMediaDate(dateString) {
    if (!dateString) return 'Bilinmiyor';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'genel': 'Genel',
        'etkinlik': 'Etkinlik',
        'proje': 'Proje',
        'afiş': 'Afiş',
        'sosyal': 'Sosyal Medya',
        'egitim': 'Eğitim',
        'toplanti': 'Toplantı',
        'gozlem': 'Gözlem'
    };
    return categoryNames[category] || category;
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
                    <button class="btn btn-sm" onclick="restoreVersion(${file.id}, ${file.version - 1})">Geri Yükle</button>
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

function restoreVersion(fileId, targetVersion) {
    if (!confirm('Bu sürümü geri yüklemek istediğiniz emin misiniz?')) {
        return;
    }

    console.log(`Restoring file ${fileId} to version ${targetVersion}`);

    fetch('/api/files.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'restore',
            file_id: fileId,
            target_version: targetVersion
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Sürüm başarıyla geri yüklendi', 'success');
            closeModal();
            loadMediaFiles();
        } else {
            showNotification(data.message || 'Sürüm geri yüklenirken hata oluştu', 'error');
        }
    })
    .catch(error => {
        console.error('Version restore error:', error);
        showNotification('Sürüm geri yüklenirken hata oluştu', 'error');
    });
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
        const params = new URLSearchParams();
        if (categoryFilter) params.append('category', categoryFilter);
        if (statusFilter) params.append('status', statusFilter);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        if (searchTerm) params.append('search', searchTerm);

        const response = await fetch(`/api/blog.php?${params.toString()}`);

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('API response is not JSON');
        }

        const data = await response.json();

        if (data.success) {
            displayBlogPosts(data.posts);
            updateBlogFilterResults(data.posts.length, data.total || data.posts.length);
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

    // Enhanced sample data with more realistic entries
    const enhancedBlogPosts = [
        { id: 1, title: 'Kış Gözlemciliği Rehberi', category: 'Rehber', status: 'yayinlandi', publishedAt: '2024-12-10', views: 245, excerpt: 'Kış aylarında astronomi gözlemciliği için kapsamlı rehber' },
        { id: 2, title: 'Mars Karşıtlığı Nedir?', category: 'Eğitim', status: 'taslak', publishedAt: null, views: 0, excerpt: 'Mars gezegeninin karşıtlık pozisyonu hakkında bilgiler' },
        { id: 3, title: 'Geminids Meteor Yağmuru 2024', category: 'Etkinlik', status: 'yayinlandi', publishedAt: '2024-12-01', views: 156, excerpt: 'Bu yılın en büyük meteor yağmuru etkinliği' },
        { id: 4, title: 'Teleskop Bakım Rehberi', category: 'Teknoloji', status: 'inceleme', publishedAt: null, views: 0, excerpt: 'Teleskop bakımı ve temizliği için detaylı bilgiler' },
        { id: 5, title: 'Astronomi Topluluğu Kuruluş Hikayesi', category: 'Duyuru', status: 'yayinlandi', publishedAt: '2024-11-15', views: 89, excerpt: 'SUBÜ ASTO topluluğunun kuruluş sürecindeki deneyimler' }
    ];

    let filteredPosts = enhancedBlogPosts.filter(post => {
        const matchesCategory = !categoryFilter || post.category === categoryFilter;
        const matchesStatus = !statusFilter || post.status === statusFilter;

        // Tarih filtresi - sadece yayınlanan yazılar için geçerli
        const matchesDateFrom = !dateFrom || (post.publishedAt && new Date(post.publishedAt) >= new Date(dateFrom));
        const matchesDateTo = !dateTo || (post.publishedAt && new Date(post.publishedAt) <= new Date(dateTo));

        // Arama - başlık ve excerpt'te ara
        const matchesSearch = !searchTerm || 
            post.title.toLowerCase().includes(searchTerm) || 
            (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm));

        return matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo && matchesSearch;
    });

    displayBlogPosts(filteredPosts);
    updateBlogFilterResults(filteredPosts.length, enhancedBlogPosts.length);
}

function clearBlogFilters() {
    document.getElementById('blog-category-filter').value = '';
    document.getElementById('blog-status-filter').value = '';
    document.getElementById('blog-date-from').value = '';
    document.getElementById('blog-date-to').value = '';
    document.getElementById('blog-search').value = '';

    // Filter results'ı gizle
    const filterResults = document.getElementById('blog-filter-results');
    if (filterResults) {
        filterResults.style.display = 'none';
    }

    filterBlogPosts();
    showNotification('Blog filtreleri temizlendi', 'info');
}

function clearBlogDateFilters() {
    document.getElementById('blog-date-from').value = '';
    document.getElementById('blog-date-to').value = '';
    filterBlogPosts();
    showNotification('Tarih filtreleri temizlendi', 'info');
}

function updateBlogFilterResults(shown, total) {
    const filterResults = document.getElementById('blog-filter-results');
    const resultsCount = document.getElementById('blog-results-count');

    if (filterResults && resultsCount) {
        resultsCount.textContent = shown;
        filterResults.style.display = shown !== total ? 'inline-block' : 'none';
    }
}

function formatBlogDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function publishBlogPost(id) {
    if (!confirm('Bu blog yazısını yayınlamak istediğinizden emin misiniz?')) {
        return;
    }

    // API call to publish post
    fetch(`/api/blog.php`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            status: 'yayinlandi',
            published_at: new Date().toISOString()
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Blog yazısı yayınlandı!', 'success');
            filterBlogPosts(); // Refresh list
        } else {
            alert('Yayınlama hatası: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Publish error:', error);
        showNotification('Blog yazısı yayınlandı (demo modu)', 'success');
        filterBlogPosts();
    });
}

function displayBlogPosts(posts) {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    if (posts.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>📝 Blog yazısı bulunamadı</h3>
                <p>Seçilen kriterlere uygun blog yazısı bulunamadı.</p>
                <div class="empty-state-actions">
                    <button class="btn btn-primary" onclick="clearBlogFilters()">Filtreleri Temizle</button>
                    <button class="btn btn-secondary">+ Yeni Blog Yazısı</button>
                </div>
            </div>
        `;
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
                <p><strong>Yayın Tarihi:</strong> ${formatBlogDate(post.publishedAt || post.published_at) || 'Henüz yayınlanmadı'}</p>
                <p><strong>Görüntülenme:</strong> ${post.views || post.view_count || 0}</p>
                <p><strong>Yazar:</strong> ${post.author_name || 'Bilinmiyor'}</p>
                ${post.excerpt ? `<p class="blog-excerpt">${post.excerpt.substring(0, 150)}${post.excerpt.length > 150 ? '...' : ''}</p>` : ''}
            </div>
            <div class="card-actions">
                <button class="btn btn-sm" onclick="editBlogPost(${post.id})">Düzenle</button>
                <button class="btn btn-sm btn-outline" onclick="viewBlogPost(${post.id})">Görüntüle</button>
                ${post.status === 'taslak' ? 
                    `<button class="btn btn-sm btn-success" onclick="publishBlogPost(${post.id})">Yayınla</button>` : ''
                }
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
    const searchTerm = document.getElementById('library-search')?.value || '';
    const selectedAgeGroups = [...document.querySelectorAll('#age-group-filters input:checked')].map(cb => cb.value);
    const selectedTags = window.getSelectedFilterTags ? window.getSelectedFilterTags() : [];

    try {
        const params = new URLSearchParams({
            type: typeFilter,
            tags: selectedTags.join(','),
            search: searchTerm,
            age_groups: selectedAgeGroups.join(',')
        });

        const response = await fetch(`/api/library.php?${params}`);
        const data = await response.json();

        if (data.success) {
            displayLibraryResources(data.resources);
            updateLibraryFilterSummary(data.resources.length);
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
    const searchTerm = document.getElementById('library-search')?.value.toLowerCase() || '';
    const selectedAgeGroups = [...document.querySelectorAll('#age-group-filters input:checked')].map(cb => cb.value);
    const selectedTags = window.getSelectedFilterTags ? window.getSelectedFilterTags() : [];

    // Enhanced sample data with proper structure
    const enhancedLibraryResources = [
        { 
            id: 1, 
            title: 'Astronomi Temelleri', 
            author: 'Prof. Dr. Ahmet Kaya',
            resource_type: 'kitap', 
            age_group: ['genc', 'yetiskin'], 
            tags: ['temel', 'gezegenler', 'yıldızlar'],
            difficulty_level: 'baslangic',
            downloads: 89,
            description: 'Astronomi biliminin temel kavramlarını açıklayan kapsamlı bir kaynak.'
        },
        { 
            id: 2, 
            title: 'Gök Mekaniği', 
            author: 'Dr. Zeynep Demir',
            resource_type: 'pdf', 
            age_group: ['yetiskin'], 
            tags: ['ileri', 'matematik', 'fizik'],
            difficulty_level: 'ileri',
            downloads: 34,
            description: 'Gök cisimlerinin hareketlerini matematiksel olarak açıklayan ileri seviye kaynak.'
        },
        {
            id: 3,
            title: 'Çocuklar İçin Uzay',
            author: 'Mehmet Yıldız',
            resource_type: 'video',
            age_group: ['cocuk'],
            tags: ['temel', 'eğlenceli', 'uzay'],
            difficulty_level: 'baslangic',
            downloads: 156,
            description: 'Çocukların uzay hakkında öğrenmesi için hazırlanmış eğlenceli video serisi.'
        },
        {
            id: 4,
            title: 'Teleskop Kullanım Kılavuzu',
            author: 'Ayşe Çelik',
            resource_type: 'pdf',
            age_group: ['genc', 'yetiskin'],
            tags: ['praktik', 'gözlem', 'ekipman'],
            difficulty_level: 'orta',
            downloads: 78,
            description: 'Teleskop seçimi ve kullanımı hakkında detaylı pratik bilgiler.'
        }
    ];

    let filteredResources = enhancedLibraryResources.filter(resource => {
        const matchesType = !typeFilter || resource.resource_type === typeFilter;
        const matchesAgeGroup = selectedAgeGroups.length === 0 || selectedAgeGroups.some(age => resource.age_group.includes(age));
        const matchesSearch = !searchTerm || resource.title.toLowerCase().includes(searchTerm) || resource.author.toLowerCase().includes(searchTerm);
        const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => resource.tags.includes(tag));

        return matchesType && matchesAgeGroup && matchesSearch && matchesTags;
    });

    displayLibraryResources(filteredResources);
    updateLibraryFilterSummary(filteredResources.length);
}

function updateLibraryFilterSummary(filteredCount) {
    const summary = document.getElementById('library-filter-summary');
    const countElement = summary?.querySelector('.filter-count');

    if (summary && countElement) {
        countElement.textContent = `${filteredCount} kaynak gösteriliyor`;
        // Show summary if filters are applied
        const hasFilters = document.getElementById('library-type-filter')?.value ||
                          document.querySelectorAll('#age-group-filters input:checked').length > 0 ||
                          document.getElementById('library-search')?.value ||
                          (window.getSelectedFilterTags && window.getSelectedFilterTags().length > 0);
        summary.style.display = hasFilters ? 'block' : 'none';
    }
}

function clearLibraryFilters() {
    document.getElementById('library-type-filter').value = '';
    document.getElementById('library-search').value = '';
    document.getElementById('library-tag-input').value = '';

    // Clear age group checkboxes
    document.querySelectorAll('#age-group-filters input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    // Clear selected tags
    if (window.getSelectedFilterTags) {
        const selectedTags = window.getSelectedFilterTags();
        selectedTags.forEach(tag => {
            if (window.removeFilterTag) {
                window.removeFilterTag(tag);
            }
        });
    }

    // Hide filter summary
    const summary = document.getElementById('library-filter-summary');
    if (summary) {
        summary.style.display = 'none';
    }

    filterLibraryResources();
    showNotification('Kütüphane filtreleri temizlendi', 'info');
}

function displayLibraryResources(resources) {
    const grid = document.getElementById('library-grid');
    if (!grid) return;

    if (resources.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>📚 Kaynak bulunamadı</h3>
                <p>Seçilen kriterlere uygun kaynak bulunamadı.</p>
                <div class="empty-state-actions">
                    <button class="btn btn-primary" onclick="clearLibraryFilters()">Filtreleri Temizle</button>
                    <button class="btn btn-secondary" onclick="showNewResourceForm()">+ Yeni Kaynak</button>
                </div>
            </div>
        `;
        return;
    }

    grid.innerHTML = resources.map(resource => {
        const ageGroupLabels = {
            'cocuk': 'Çocuk (6-12)',
            'genc': 'Genç (13-18)',
            'yetiskin': 'Yetişkin (18+)'
        };

        const difficultyLabels = {
            'baslangic': 'Başlangıç',
            'orta': 'Orta',
            'ileri': 'İleri'
        };

        const typeIcons = {
            'kitap': '📖',
            'dergi': '📰',
            'makale': '📄',
            'pdf': '📑',
            'video': '🎥',
            'podcast': '🎧'
        };

        const ageGroups = Array.isArray(resource.age_group) ? resource.age_group : 
                         (resource.age_group ? JSON.parse(resource.age_group) : []);
        const tags = Array.isArray(resource.tags) ? resource.tags : 
                    (resource.tags ? JSON.parse(resource.tags) : []);

        return `
            <div class="card resource-card" data-resource-id="${resource.id}">
                <div class="resource-header">
                    <div class="resource-icon">${typeIcons[resource.resource_type] || '📚'}</div>
                    <div class="resource-type-badge">${resource.resource_type.toUpperCase()}</div>
                </div>

                <h3>${resource.title}</h3>

                <div class="resource-meta">
                    ${resource.author ? `<p><strong>Yazar:</strong> ${resource.author}</p>` : ''}
                    <p><strong>Zorluk:</strong> ${difficultyLabels[resource.difficulty_level] || resource.difficulty_level}</p>
                    <p><strong>Yaş Grupları:</strong> 
                        <span class="age-group-tags">
                            ${ageGroups.map(age => `<span class="age-tag">${ageGroupLabels[age] || age}</span>`).join('')}
                        </span>
                    </p>
                    <p><strong>İndirme:</strong> ${resource.download_count || resource.downloads || 0}</p>
                </div>

                ${tags.length > 0 ? `
                    <div class="resource-tags">
                        ${tags.map(tag => `<span class="tag-item">#${tag}</span>`).join('')}
                    </div>
                ` : ''}

                ${resource.description ? `
                    <p class="resource-description">${resource.description.length > 100 ? resource.description.substring(0, 100) + '...' : resource.description}</p>
                ` : ''}

                <div class="card-actions">
                    <button class="btn btn-sm btn-primary" onclick="downloadResource(${resource.id})">📥 İndir</button>
                    <button class="btn btn-sm btn-outline" onclick="viewResourceDetail(${resource.id})">👁️ Detay</button>
                    <button class="btn btn-sm btn-outline" onclick="editResource(${resource.id})">✏️ Düzenle</button>
                </div>
            </div>
        `;
    }).join('');
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
        assigned_to: parseInt(formData.get('assigned_to')),
        department_id: formData.get('department_id') ? parseInt(formData.get('department_id')) : null,
        due_date: formData.get('due_date'),
        reminder_at: formData.get('reminder_at') || null,
        priority: formData.get('priority'),
        estimated_hours: formData.get('estimated_hours') ? parseInt(formData.get('estimated_hours')) : null,
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
                                    <p><strong>👤 Atanan:</strong> ${assignedUser ? assignedUser.name || assignedUser.full_name : 'Atanmamış'}</p>
                                    ${departmentName ? `<p><strong>🏢 Birim:</strong> ${departmentName}</p>` : ''}
                                    <p><strong>📅 Bitiş:</strong> ${dueDate}</p>
                                    ${task.estimated_hours ? `<p><strong>⏱️ Tahmini:</strong> ${task.estimated_hours}h</p>` : ''}
                                    ${isOverdue ? '<p class="overdue-warning">⚠️ Süresi geçti!</p>' : ''}
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
    const reportType = document.getElementById('report-type-filter')?.value || 'all';

    try {
        const params = new URLSearchParams();
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        if (reportType !== 'all') params.append('type', reportType);

        const response = await fetch(`/api/reports.php?${params}`);
        const result = await response.json();

        if (result.success) {
            const data = result.data;

            if (reportType === 'all' || reportType === 'events') {
                loadEventsChart(data.events || data);
            }
            if (reportType === 'all' || reportType === 'budget') {
                loadBudgetChart(data.budget || data);
            }
            if (reportType === 'all' || reportType === 'social') {
                loadSocialChart(data.social || data);
            }
            if (reportType === 'all' || reportType === 'membership') {
                loadMembershipChart(data.membership || data);
            }
        } else {
            console.error('Reports API error:', result.message);
            loadReportsDataFallback(reportType, dateFrom, dateTo);
        }
    } catch (error) {
        console.error('Reports fetch error:', error);
        loadReportsDataFallback(reportType, dateFrom, dateTo);
    }
}

function loadReportsDataFallback(reportType = 'all', dateFrom = '', dateTo = '') {
    // Filter sample data by date range if provided
    let filteredEvents = sampleData.events;
    let filteredSocialPosts = sampleData.socialMediaPosts;
    let filteredBudgetLogs = sampleData.budgetLogs;
    let filteredMembers = sampleData.members;

    if (dateFrom || dateTo) {
        const fromDate = dateFrom ? new Date(dateFrom) : new Date('2000-01-01');
        const toDate = dateTo ? new Date(dateTo) : new Date('2099-12-31');

        filteredEvents = sampleData.events.filter(event => {
            const eventDate = new Date(event.date || event.start_date);
            return eventDate >= fromDate && eventDate <= toDate;
        });

        filteredSocialPosts = sampleData.socialMediaPosts.filter(post => {
            if (!post.publishedAt && !post.published_at) return false;
            const postDate = new Date(post.publishedAt || post.published_at);
            return postDate >= fromDate && postDate <= toDate;
        });

        filteredBudgetLogs = sampleData.budgetLogs.filter(log => {
            const logDate = new Date(log.date || log.created_at);
            return logDate >= fromDate && logDate <= toDate;
        });

        filteredMembers = sampleData.members.filter(member => {
            const joinDate = new Date(member.joinDate || member.created_at);
            return joinDate >= fromDate && joinDate <= toDate;
        });
    }

    if (reportType === 'all' || reportType === 'events') {
        loadEventsChart({ events: filteredEvents });
    }
    if (reportType === 'all' || reportType === 'budget') {
        loadBudgetChart({ logs: filteredBudgetLogs });
    }
    if (reportType === 'all' || reportType === 'social') {
        loadSocialChart({ posts: filteredSocialPosts });
    }
    if (reportType === 'all' || reportType === 'membership') {
        loadMembershipChart({ members: filteredMembers });
    }
}

async function loadEventsChart(eventsData = null) {
    const canvas = document.getElementById('events-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let events, totalParticipants, avgParticipants;

    if (eventsData && eventsData.events) {
        events = eventsData.events;
        const data = events.map(event => event.participants_count || event.participants || 0);
        const labels = events.map(event => {
            const title = event.title || event.name;
            return title.length > 12 ? title.substring(0, 12) + '...' : title;
        });

        drawBarChart(ctx, data, labels, '#3b82f6');

        totalParticipants = eventsData.total_participants || data.reduce((sum, val) => sum + val, 0);
        avgParticipants = eventsData.avg_participants || Math.round(totalParticipants / data.length);

        document.getElementById('events-summary').textContent =
            `${events.length} etkinlik, toplam ${totalParticipants} katılımcı, ortalama ${avgParticipants} kişi/etkinlik`;
    } else {
        // Fallback to sample data
        events = sampleData.events;
        const data = events.map(event => event.participants || 0);
        const labels = events.map(event => {
            const title = event.title;
            return title.length > 12 ? title.substring(0, 12) + '...' : title;
        });

        drawBarChart(ctx, data, labels, '#3b82f6');

        totalParticipants = data.reduce((sum, val) => sum + val, 0);
        avgParticipants = events.length > 0 ? Math.round(totalParticipants / events.length) : 0;

        document.getElementById('events-summary').textContent =
            `${events.length} etkinlik, toplam ${totalParticipants} katılımcı, ortalama ${avgParticipants} kişi/etkinlik`;
    }

    // Add event type breakdown
    const typeBreakdown = {};
    events.forEach(event => {
        const type = event.event_type || event.type || 'Diğer';
        typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;
    });

    const typeLabels = Object.keys(typeBreakdown);
    if (typeLabels.length > 1) {
        const typeCanvas = document.getElementById('event-types-chart');
        if (typeCanvas) {
            const typeCtx = typeCanvas.getContext('2d');
            const typeData = Object.values(typeBreakdown);
            const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
            drawPieChart(typeCtx, typeData, typeLabels, colors);
        }
    }
}

async function loadBudgetChart(budgetData = null) {
    const canvas = document.getElementById('budget-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let totalIncome, totalExpense, remaining, categoryStats = {};

    if (budgetData && (budgetData.total_income !== undefined || budgetData.logs)) {
        if (budgetData.logs) {
            // Process logs data
            totalIncome = budgetData.logs.filter(log => (log.type || log.transaction_type) === 'gelir')
                .reduce((sum, log) => sum + (log.amount || 0), 0);
            totalExpense = budgetData.logs.filter(log => (log.type || log.transaction_type) === 'gider')
                .reduce((sum, log) => sum + (log.amount || 0), 0);

            // Calculate category breakdown
            budgetData.logs.forEach(log => {
                if ((log.type || log.transaction_type) === 'gider') {
                    const category = log.category || 'Diğer';
                    categoryStats[category] = (categoryStats[category] || 0) + (log.amount || 0);
                }
            });
        } else {
            totalIncome = budgetData.total_income || 0;
            totalExpense = budgetData.total_expense || 0;
            categoryStats = budgetData.category_stats || {};
        }

        remaining = totalIncome - totalExpense;
        const expensePercentage = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;

        // Main income vs expense chart
        if (totalIncome > 0 || totalExpense > 0) {
            drawPieChart(ctx, [totalIncome, totalExpense], ['Gelir', 'Gider'], ['#10b981', '#ef4444']);
        }

        document.getElementById('budget-summary').textContent =
            `₺${remaining.toLocaleString()} kalan bütçe (${expensePercentage}% kullanıldı)`;
    } else {
        // Fallback to sample data
        totalIncome = sampleData.budgetLogs.filter(log => log.type === 'gelir')
            .reduce((sum, log) => sum + log.amount, 0);
        totalExpense = sampleData.budgetLogs.filter(log => log.type === 'gider')
            .reduce((sum, log) => sum + log.amount, 0);

        // Calculate category breakdown from sample data
        sampleData.budgetLogs.forEach(log => {
            if (log.type === 'gider') {
                const category = log.category || 'Diğer';
                categoryStats[category] = (categoryStats[category] || 0) + log.amount;
            }
        });

        drawPieChart(ctx, [totalIncome, totalExpense], ['Gelir', 'Gider'], ['#10b981', '#ef4444']);

        remaining = totalIncome - totalExpense;
        const expensePercentage = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
        document.getElementById('budget-summary').textContent =
            `₺${remaining.toLocaleString()} kalan bütçe (${expensePercentage}% kullanıldı)`;
    }

    // Display category breakdown if available
    const categoryLabels = Object.keys(categoryStats);
    if (categoryLabels.length > 0) {
        const categoryCanvas = document.getElementById('budget-categories-chart');
        if (categoryCanvas) {
            const categoryCtx = categoryCanvas.getContext('2d');
            const categoryData = Object.values(categoryStats);
            const colors = ['#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16'];
            drawPieChart(categoryCtx, categoryData, categoryLabels, colors);
        }
    }
}

async function loadSocialChart(socialData = null) {
    const canvas = document.getElementById('social-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let posts, platformStats = {};

    if (socialData && (socialData.platform_stats || socialData.posts)) {
        if (socialData.posts) {
            // Process posts data
            posts = socialData.posts.filter(post => post.status === 'yayinlandi');

            posts.forEach(post => {
                const platform = post.platform;
                if (!platformStats[platform]) {
                    platformStats[platform] = { likes: 0, comments: 0, shares: 0, posts: 0 };
                }
                platformStats[platform].likes += post.likes_count || post.likes || 0;
                platformStats[platform].comments += post.comments_count || post.comments || 0;
                platformStats[platform].shares += post.shares_count || post.shares || 0;
                platformStats[platform].posts += 1;
            });
        } else {
            platformStats = socialData.platform_stats;
            posts = { length: socialData.published_posts || 0 };
        }

        const platforms = Object.keys(platformStats);
        if (platforms.length > 0) {
            const engagementData = platforms.map(platform => {
                const stats = platformStats[platform];
                return (stats.likes || 0) + (stats.comments || 0) + (stats.shares || 0);
            });

            drawBarChart(ctx, engagementData, platforms, '#8b5cf6');
        }

        const totalEngagement = socialData.total_engagement || 
            Object.values(platformStats).reduce((sum, stats) => 
                sum + (stats.likes || 0) + (stats.comments || 0) + (stats.shares || 0), 0);
        const publishedCount = socialData.published_posts || posts.length;

        document.getElementById('social-summary').textContent =
            `${publishedCount} yayınlanan içerik, toplam ${totalEngagement.toLocaleString()} etkileşim`;
    } else {
        // Fallback to sample data
        const publishedPosts = sampleData.socialMediaPosts.filter(post => post.status === 'yayinlandi');

        // Calculate platform breakdown
        publishedPosts.forEach(post => {
            const platform = post.platform;
            if (!platformStats[platform]) {
                platformStats[platform] = { likes: 0, comments: 0, shares: 0, posts: 0 };
            }
            platformStats[platform].likes += post.likes || 0;
            platformStats[platform].comments += post.comments || 0;
            platformStats[platform].shares += post.shares || 0;
            platformStats[platform].posts += 1;
        });

        const platforms = Object.keys(platformStats);
        if (platforms.length > 0) {
            const engagementData = platforms.map(platform => {
                const stats = platformStats[platform];
                return stats.likes + stats.comments + stats.shares;
            });

            drawBarChart(ctx, engagementData, platforms, '#8b5cf6');
        } else {
            // Show engagement types instead
            const totalLikes = publishedPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
            const totalComments = publishedPosts.reduce((sum, post) => sum + (post.comments || 0), 0);
            const totalShares = publishedPosts.reduce((sum, post) => sum + (post.shares || 0), 0);

            drawBarChart(ctx, [totalLikes, totalComments, totalShares], ['Beğeni', 'Yorum', 'Paylaşım'], '#8b5cf6');
        }

        const totalEngagement = Object.values(platformStats).reduce((sum, stats) => 
            sum + stats.likes + stats.comments + stats.shares, 0);

        document.getElementById('social-summary').textContent =
            `${publishedPosts.length} yayınlanan içerik, toplam ${totalEngagement.toLocaleString()} etkileşim`;
    }

    // Display platform post counts if available
    const platformNames = Object.keys(platformStats);
    if (platformNames.length > 1) {
        const platformCanvas = document.getElementById('social-platforms-chart');
        if (platformCanvas) {
            const platformCtx = platformCanvas.getContext('2d');
            const platformPostCounts = Object.values(platformStats).map(stats => stats.posts || 0);
            const colors = ['#1DA1F2', '#E4405F', '#FF0000', '#0077B5', '#1877F2'];
            drawPieChart(platformCtx, platformPostCounts, platformNames, colors);
        }
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
    if (!data || data.length === 0) return;

    const maxValue = Math.max(...data) || 1;
    const padding = 40;
    const chartWidth = ctx.canvas.width - padding * 2;
    const chartHeight = ctx.canvas.height - padding * 2;
    const barWidth = Math.max(20, chartWidth / data.length - 8);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(ctx.canvas.width - padding, y);
        ctx.stroke();
    }

    // Draw bars
    ctx.fillStyle = color;
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * (barWidth + 8);
        const y = ctx.canvas.height - padding - barHeight;

        // Bar
        ctx.fillRect(x, y, barWidth, barHeight);

        // Value labels on top of bars
        ctx.fillStyle = '#374151';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value.toString(), x + barWidth/2, y - 5);

        // Category labels at bottom
        if (labels && labels[index]) {
            ctx.font = '10px Arial';
            ctx.fillText(labels[index], x + barWidth/2, ctx.canvas.height - padding + 15);
        }

        ctx.fillStyle = color;
    });

    // Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxValue / 5) * (5 - i));
        const y = padding + (chartHeight / 5) * i + 4;
        ctx.fillText(value.toString(), padding - 10, y);
    }

    ctx.textAlign = 'start'; // Reset text alignment
}

function drawPieChart(ctx, data, labels, colors) {
    if (!data || data.length === 0) return;

    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    const total = data.reduce((sum, val) => sum + val, 0);

    if (total === 0) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let currentAngle = -Math.PI / 2; // Start from top

    data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        const midAngle = currentAngle + sliceAngle / 2;

        // Draw slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        // Add stroke
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add percentage labels if slice is large enough
        const percentage = ((value / total) * 100).toFixed(1);
        if (parseFloat(percentage) > 5) {
            const labelX = centerX + Math.cos(midAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(midAngle) * (radius * 0.7);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(percentage + '%', labelX, labelY);
        }

        currentAngle += sliceAngle;
    });

    // Add legend
    if (labels) {
        const legendX = ctx.canvas.width - 120;
        let legendY = 20;

        ctx.font = '11px Arial';
        ctx.textAlign = 'start';

        labels.forEach((label, index) => {
            // Color square
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(legendX, legendY, 12, 12);

            // Label text
            ctx.fillStyle = '#374151';
            ctx.fillText(label, legendX + 18, legendY + 9);

            legendY += 18;
        });
    }
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

    if    if (format === 'csv') {
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


function viewTaskDetail(taskId) {
    const task = sampleData.tasks.find(t => t.id === taskId);
    if (!task) return;

    const assignedUser = sampleData.members.find(m => m.id === (task.assignedTo || task.assigned_to));
    const departmentName = getDepartmentName(task.department_id);
    const dueDate = formatTaskDate(task.due_date || task.dueDate);
    const isOverdue = isTaskOverdue(task.due_date || task.dueDate);

    const content = `
        <div class="task-detail">
            <h3>${task.title}</h3>
            <div class="task-info">
                <p><strong>Açıklama:</strong> ${task.description || 'Açıklama belirtilmemiş'}</p>
                <p><strong>👤 Atanan Kişi:</strong> ${assignedUser ? assignedUser.name || assignedUser.full_name : 'Atanmamış'}</p>
                ${departmentName ? `<p><strong>🏢 Birim:</strong> ${departmentName}</p>` : ''}
                <p><strong>📅 Bitiş Tarihi:</strong> <span class="${isOverdue ? 'overdue' : ''}">${dueDate}</span></p>
                <p><strong>🎯 Öncelik:</strong> <span class="priority priority-${task.priority}">${getPriorityText(task.priority)}</span></p>
                <p><strong>📊 Durum:</strong> ${getTaskStatusText(task.status)}</p>
                ${task.estimated_hours ? `<p><strong>⏱️ Tahmini Süre:</strong> ${task.estimated_hours} saat</p>` : ''}
                ${task.actual_hours ? `<p><strong>⏰ Gerçek Süre:</strong> ${task.actual_hours} saat</p>` : ''}
                ${task.completion_percentage ? `<p><strong>📈 Tamamlanma:</strong> %${task.completion_percentage}</p>` : ''}
            </div>
            ${task.tags ? `
                <div class="task-tags">
                    ${JSON.parse(task.tags).map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="editTask(${taskId})">Düzenle</button>
                <button class="btn btn-secondary" onclick="closeModal()">Kapat</button>
            </div>
        </div>
    `;

    createModal('Görev Detayları', content);
}

function getTaskStatusText(status) {
    const statusTexts = {
        'yapilacak': 'Yapılacak',
        'devam_ediyor': 'Devam Ediyor',
        'tamamlandi': 'Tamamlandı'
    };
    return statusTexts[status] || status;
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

function getProjectStatusText(status) {
    const statusTexts = {
        'planlama': 'Planlama',
        'devam_ediyor': 'Devam Ediyor',
        'beklemede': 'Beklemede',
        'tamamlandi': 'Tamamlandı',
        'iptal': 'İptal'
    };
    return statusTexts[status] || status;
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

function editTask(taskId) {
    const task = sampleData.tasks.find(t => t.id === taskId);
    if (!task) {
        alert('Görev bulunamadı');
        return;
    }

    closeModal(); // Close detail modal first

    const content = `
        <div class="task-form">
            <form id="task-edit-form">
                <input type="hidden" name="id" value="${taskId}">
                <div class="form-group">
                    <label>Görev Başlığı: *</label>
                    <input type="text" name="title" required value="${task.title}">
                </div>
                <div class="form-group">
                    <label>Açıklama:</label>
                    <textarea name="description" rows="3">${task.description || ''}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Atanan Kişi: *</label>
                        <select name="assigned_to" required>
                            <option value="">Kişi seçin...</option>
                            <option value="1" ${(task.assigned_to || task.assignedTo) === 1 ? 'selected' : ''}>Ahmet Yılmaz</option>
                            <option value="2" ${(task.assigned_to || task.assignedTo) === 2 ? 'selected' : ''}>Zeynep Kaya</option>
                            <option value="3" ${(task.assigned_to || task.assignedTo) === 3 ? 'selected' : ''}>Mehmet Demir</option>
                            <option value="4" ${(task.assigned_to || task.assignedTo) === 4 ? 'selected' : ''}>Ayşe Çelik</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Birim:</label>
                        <select name="department_id">
                            <option value="">Birim seçin...</option>
                            <option value="1" ${task.department_id === 1 ? 'selected' : ''}>Yönetim</option>
                            <option value="2" ${task.department_id === 2 ? 'selected' : ''}>Sosyal Medya</option>
                            <option value="3" ${task.department_id === 3 ? 'selected' : ''}>Organizasyon</option>
                            <option value="4" ${task.department_id === 4 ? 'selected' : ''}>Teknik</option>
                            <option value="5" ${task.department_id === 5 ? 'selected' : ''}>Eğitim</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Bitiş Tarihi: *</label>
                        <input type="datetime-local" name="due_date" required value="${formatDateTimeForInput(task.due_date || task.dueDate)}">
                    </div>
                    <div class="form-group">
                        <label>Durum:</label>
                        <select name="status">
                            <option value="yapilacak" ${task.status === 'yapilacak' ? 'selected' : ''}>Yapılacak</option>
                            <option value="devam_ediyor" ${task.status === 'devam_ediyor' ? 'selected' : ''}>Devam Ediyor</option>
                            <option value="tamamlandi" ${task.status === 'tamamlandi' ? 'selected' : ''}>Tamamlandı</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Öncelik:</label>
                        <select name="priority">
                            <option value="dusuk" ${task.priority === 'dusuk' ? 'selected' : ''}>Düşük</option>
                            <option value="orta" ${task.priority === 'orta' ? 'selected' : ''}>Orta</option>
                            <option value="yuksek" ${task.priority === 'yuksek' ? 'selected' : ''}>Yüksek</option>
                            <option value="acil" ${task.priority === 'acil' ? 'selected' : ''}>Acil</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Tahmini Süre (saat):</label>
                        <input type="number" name="estimated_hours" min="1" value="${task.estimated_hours || ''}">
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Görevi Güncelle</button>
                    <button type="button" class="btn btn-danger" onclick="deleteTask(${taskId})">Sil</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                </div>
            </form>
        </div>
    `;

    createModal('Görev Düzenle', content);
    setupTaskEditForm();
}

function setupTaskEditForm() {
    const form = document.getElementById('task-edit-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const taskId = parseInt(formData.get('id'));

            const taskData = {
                id: taskId,
                title: formData.get('title'),
                description: formData.get('description'),
                assigned_to: parseInt(formData.get('assigned_to')),
                department_id: formData.get('department_id') ? parseInt(formData.get('department_id')) : null,
                due_date: formData.get('due_date'),
                status: formData.get('status'),
                priority: formData.get('priority'),
                estimated_hours: formData.get('estimated_hours') ? parseInt(formData.get('estimated_hours')) : null
            };

            try {
                const response = await fetch('/api/tasks.php', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskData)
                });

                const result = await response.json();

                if (result.success) {
                    // Update local data
                    const taskIndex = sampleData.tasks.findIndex(t => t.id === taskId);
                    if (taskIndex !== -1) {
                        sampleData.tasks[taskIndex] = { ...sampleData.tasks[taskIndex], ...taskData };
                    }

                    closeModal();
                    loadTasksKanban();
                    showNotification('Görev başarıyla güncellendi!', 'success');
                } else {
                    alert('Görev güncellenirken hata: ' + result.message);
                }
            } catch (error) {
                console.error('Task update error:', error);

                // Fallback: Update local data
                const taskIndex = sampleData.tasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    sampleData.tasks[taskIndex] = { ...sampleData.tasks[taskIndex], ...taskData };
                    loadTasksKanban();
                    showNotification('Görev güncellendi (demo modu)', 'success');
                }
                closeModal();
            }
        });
    }
}

function deleteTask(taskId) {
    if (!confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
        return;
    }

    // Remove from local data
    sampleData.tasks = sampleData.tasks.filter(t => t.id !== taskId);
    closeModal();
    loadTasksKanban();
    showNotification('Görev silindi', 'success');
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
        const budgetUsed = parseFloat(project.budget_used || 0);
        const budgetTotal = parseFloat(project.budget_total || 0);
        const budgetProgress = budgetTotal > 0 ? (budgetUsed / budgetTotal) * 100 : 0;
        const projectProgress = parseInt(project.progress_percentage || 0);

        return `
            <div class="card project-card" data-project-id="${project.id}">
                <div class="project-header">
                    <h3>${project.title || project.name}</h3>
                    <span class="status-badge ${project.status || 'planlama'}">${getProjectStatusText(project.status)}</span>
                </div>

                <div class="project-info">
                    <p><strong>Tür:</strong> ${project.project_type || project.type || 'Belirtilmemiş'}</p>

                    <div class="budget-info">
                        <p><strong>Bütçe:</strong> ₺${budgetUsed.toLocaleString()} / ₺${budgetTotal.toLocaleString()}</p>
                        <div class="budget-bar">
                            <div class="budget-fill" style="width: ${Math.min(budgetProgress, 100)}%;"></div>
                            <span class="budget-percentage">${budgetProgress.toFixed(1)}%</span>
                        </div>
                    </div>

                    <div class="progress-info">
                        <p><strong>Proje İlerlemesi:</strong> ${projectProgress}%</p>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${projectProgress}%; background-color: var(--success-color);"></div>
                        </div>
                    </div>

                    ${partners.length > 0 ? `
                        <div class="partners-info">
                            <p><strong>Ortaklar:</strong></p>
                            <div class="partners-tags">
                                ${partners.map(partner => `<span class="partner-tag">${partner}</span>`).join('')}
                            </div>
                        </div>
                    ` : '<p><strong>Ortaklar:</strong> Belirtilmemiş</p>'}
                </div>

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

function setupResourceForm() {
    const form = document.getElementById('resource-form');
    const tagInput = document.getElementById('resource-tag-input');
    const selectedTagsContainer = document.getElementById('resource-selected-tags');

    let selectedTags = [];

    if (tagInput) {
        tagInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tag = this.value.trim().toLowerCase();
                if (tag && !selectedTags.includes(tag)) {
                    selectedTags.push(tag);
                    updateSelectedTags();
                    this.value = '';
                }
            }
        });
    }

    function updateSelectedTags() {
        selectedTagsContainer.innerHTML = selectedTags.map(tag => `
            <span class="tag-item">
                ${tag}
                <button type="button" onclick="removeTag('${tag}')">×</button>
            </span>
        `).join('');
    }

    window.removeTag = function(tagToRemove) {
        selectedTags = selectedTags.filter(tag => tag !== tagToRemove);
        updateSelectedTags();
    };

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const isEdit = this.dataset.editId;
            if (isEdit) {
                updateResourceData(new FormData(this), isEdit, selectedTags);
            } else {
                createResourceData(new FormData(this), selectedTags);
            }
        });
    }
}

async function createResourceData(formData, selectedTags) {
    const ageGroups = [...document.querySelectorAll('input[name="age_group"]:checked')].map(cb => cb.value);

    const resourceData = {
        title: formData.get('title'),
        author: formData.get('author'),
        isbn: formData.get('isbn'),
        resource_type: formData.get('resource_type'),
        description: formData.get('description'),
        difficulty_level: formData.get('difficulty_level'),
        file_path: formData.get('file_path'),
        external_url: formData.get('external_url'),
        age_group: ageGroups,
        tags: selectedTags,
        added_by: currentUser.id || 1
    };

    // Validation
    if (!resourceData.title || !resourceData.resource_type) {
        alert('Lütfen zorunlu alanları doldurun (Başlık, Tür)');
        return;
    }

    try {
        const response = await fetch('/api/library.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resourceData)
        });

        const result = await response.json();

        if (result.success) {
            closeModal();
            filterLibraryResources(); // Refresh resources list
            showNotification('Kaynak başarıyla eklendi!', 'success');
        } else {
            alert('Kaynak eklenirken hata: ' + result.message);
        }
    } catch (error) {
        console.error('Resource creation error:', error);

        // Fallback: Add to local data for demo purposes
        const newResource = {
            id: Date.now(),
            ...resourceData,
            download_count: 0
        };
        sampleData.libraryResources.push(newResource);

        closeModal();
        filterLibraryResources();
        showNotification('Kaynak eklendi (demo modu)', 'success');
    }
}

function setupLibraryTagInput() {
    const tagInput = document.getElementById('library-tag-input');
    const suggestionsContainer = document.getElementById('tag-suggestions');
    const selectedTagsContainer = document.getElementById('library-selected-tags');

    let selectedFilterTags = [];
    const availableTags = ['astronomi', 'temel', 'ileri', 'gözlem', 'teorik', 'praktik', 'matematik', 'fizik', 'uzay', 'gezegen'];

    if (tagInput) {
        tagInput.addEventListener('input', function() {
            const value = this.value.toLowerCase().trim();
            if (value.length > 0) {
                const suggestions = availableTags.filter(tag => 
                    tag.includes(value) && !selectedFilterTags.includes(tag)
                );
                showTagSuggestions(suggestions);
            } else {
                hideTagSuggestions();
            }
        });

        tagInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tag = this.value.trim().toLowerCase();
                if (tag && !selectedFilterTags.includes(tag)) {
                    addFilterTag(tag);
                    this.value = '';
                }
            }
        });
    }

    function showTagSuggestions(suggestions) {
        suggestionsContainer.innerHTML = suggestions.map(tag => `
            <div class="tag-suggestion" onclick="addFilterTag('${tag}')">${tag}</div>
        `).join('');
        suggestionsContainer.style.display = suggestions.length > 0 ? 'block' : 'none';
    }

    function hideTagSuggestions() {
        suggestionsContainer.style.display = 'none';
    }

    window.addFilterTag = function(tag) {
        if (!selectedFilterTags.includes(tag)) {
            selectedFilterTags.push(tag);
            updateSelectedFilterTags();
            hideTagSuggestions();
            filterLibraryResources();
        }
    };

    window.removeFilterTag = function(tagToRemove) {
        selectedFilterTags = selectedFilterTags.filter(tag => tag !== tagToRemove);
        updateSelectedFilterTags();
        filterLibraryResources();
    };

    function updateSelectedFilterTags() {
        selectedTagsContainer.innerHTML = selectedFilterTags.map(tag => `
            <span class="tag-item filter-tag">
                ${tag}
                <button type="button" onclick="removeFilterTag('${tag}')">×</button>
            </span>
        `).join('');
    }

    window.getSelectedFilterTags = function() {
        return selectedFilterTags;
    };
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

    // Tag input sistemini kur
    setupLibraryTagInput();
}

function downloadResource(id) {
    // Simulate download and increment counter
    showNotification('Kaynak indiriliyor...', 'info');

    // In real implementation, this would be a proper file download
    setTimeout(() => {
        showNotification('Kaynak başarıyla indirildi!', 'success');
    }, 1000);
}

function viewResourceDetail(id) {
    // Find resource in sample data or make API call
    const resource = findResourceById(id);
    if (!resource) {
        alert('Kaynak bulunamadı');
        return;
    }

    const ageGroups = Array.isArray(resource.age_group) ? resource.age_group : 
                     (resource.age_group ? JSON.parse(resource.age_group) : []);
    const tags = Array.isArray(resource.tags) ? resource.tags : 
                (resource.tags ? JSON.parse(resource.tags) : []);

    const content = `
        <div class="resource-detail">
            <h3>${resource.title}</h3>
            <div class="resource-detail-info">
                ${resource.author ? `<p><strong>Yazar:</strong> ${resource.author}</p>` : ''}
                ${resource.isbn ? `<p><strong>ISBN:</strong> ${resource.isbn}</p>` : ''}
                <p><strong>Tür:</strong> ${resource.resource_type}</p>
                <p><strong>Zorluk Seviyesi:</strong> ${resource.difficulty_level}</p>
                ${resource.language ? `<p><strong>Dil:</strong> ${resource.language}</p>` : ''}
                <p><strong>İndirme Sayısı:</strong> ${resource.download_count || resource.downloads || 0}</p>

                ${ageGroups.length > 0 ? `
                    <div class="detail-section">
                        <strong>Yaş Grupları:</strong>
                        <div class="age-group-tags">
                            ${ageGroups.map(age => `<span class="age-tag">${getAgeGroupLabel(age)}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}

                ${tags.length > 0 ? `
                    <div class="detail-section">
                        <strong>Etiketler:</strong>
                        <div class="resource-tags">
                            ${tags.map(tag => `<span class="tag-item">#${tag}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}

                ${resource.description ? `
                    <div class="detail-section">
                        <strong>Açıklama:</strong>
                        <p>${resource.description}</p>
                    </div>
                ` : ''}

                ${resource.external_url ? `
                    <div class="detail-section">
                        <strong>Dış Bağlantı:</strong>
                        <a href="${resource.external_url}" target="_blank">${resource.external_url}</a>
                    </div>
                ` : ''}
            </div>

            <div class="modal-actions">
                <button class="btn btn-primary" onclick="downloadResource(${id}); closeModal();">İndir</button>
                <button class="btn btn-secondary" onclick="editResource(${id}); closeModal();">Düzenle</button>
                <button class="btn btn-outline" onclick="closeModal()">Kapat</button>
            </div>
        </div>
    `;

    createModal('Kaynak Detayları', content);
}

function editResource(id) {
    const resource = findResourceById(id);
    if (!resource) {
        alert('Kaynak bulunamadı');
        return;
    }

    const ageGroups = Array.isArray(resource.age_group) ? resource.age_group : 
                     (resource.age_group ? JSON.parse(resource.age_group) : []);
    const tags = Array.isArray(resource.tags) ? resource.tags : 
                (resource.tags ? JSON.parse(resource.tags) : []);

    const content = `
        <div class="resource-form">
            <form id="resource-form">
                <div class="form-group">
                    <label>Kaynak Başlığı: *</label>
                    <input type="text" name="title" required value="${resource.title}">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Yazar:</label>
                        <input type="text" name="author" value="${resource.author || ''}">
                    </div>
                    <div class="form-group">
                        <label>ISBN:</label>
                        <input type="text" name="isbn" value="${resource.isbn || ''}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Kaynak Türü: *</label>
                        <select name="resource_type" required>
                            <option value="">Tür seçin...</option>
                            <option value="kitap" ${resource.resource_type === 'kitap' ? 'selected' : ''}>Kitap</option>
                            <option value="dergi" ${resource.resource_type === 'dergi' ? 'selected' : ''}>Dergi</option>
                            <option value="makale" ${resource.resource_type === 'makale' ? 'selected' : ''}>Makale</option>
                            <option value="pdf" ${resource.resource_type === 'pdf' ? 'selected' : ''}>PDF</option>
                            <option value="video" ${resource.resource_type === 'video' ? 'selected' : ''}>Video</option>
                            <option value="podcast" ${resource.resource_type === 'podcast' ? 'selected' : ''}>Podcast</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Zorluk Seviyesi:</label>
                        <select name="difficulty_level">
                            <option value="baslangic" ${resource.difficulty_level === 'baslangic' ? 'selected' : ''}>Başlangıç</option>
                            <option value="orta" ${resource.difficulty_level === 'orta' ? 'selected' : ''}>Orta</option>
                            <option value="ileri" ${resource.difficulty_level === 'ileri' ? 'selected' : ''}>İleri</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Açıklama:</label>
                    <textarea name="description" rows="3">${resource.description || ''}</textarea>
                </div>

                <div class="form-group">
                    <label>Yaş Grupları:</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" name="age_group" value="cocuk" ${ageGroups.includes('cocuk') ? 'checked' : ''}> Çocuk (6-12)</label>
                        <label><input type="checkbox" name="age_group" value="genc" ${ageGroups.includes('genc') ? 'checked' : ''}> Genç (13-18)</label>
                        <label><input type="checkbox" name="age_group" value="yetiskin" ${ageGroups.includes('yetiskin') ? 'checked' : ''}> Yetişkin (18+)</label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Etiketler:</label>
                    <div class="tag-input-container">
                        <input type="text" id="resource-tag-input" class="tag-input" placeholder="Etiket ekle...">
                        <div class="selected-tags" id="resource-selected-tags"></div>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Dosya Yolu:</label>
                        <input type="text" name="file_path" value="${resource.file_path || ''}">
                    </div>
                    <div class="form-group">
                        <label>Dış Bağlantı:</label>
                        <input type="url" name="external_url" value="${resource.external_url || ''}">
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">Güncelle</button>
                    <button type="button" class="btn btn-danger" onclick="deleteResource(${id})">Sil</button>
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                </div>
            </form>
        </div>
    `;

    createModal('Kaynak Düzenle', content);

    const form = document.getElementById('resource-form');
    form.dataset.editId = id;
    setupResourceForm();

    // Pre-populate tags
    const tagInput = document.getElementById('resource-tag-input');
    const selectedTagsContainer = document.getElementById('resource-selected-tags');

    if (tags.length > 0 && window.removeTag) {
        // Set initial tags
        setTimeout(() => {
            tags.forEach(tag => {
                if (!window.selectedTags || !window.selectedTags.includes(tag)) {
                    if (window.selectedTags) {
                        window.selectedTags.push(tag);
                    }
                }
            });
            // Update display
            if (selectedTagsContainer) {
                selectedTagsContainer.innerHTML = tags.map(tag => `
                    <span class="tag-item">
                        ${tag}
                        <button type="button" onclick="removeTag('${tag}')">×</button>
                    </span>
                `).join('');
            }
        }, 100);
    }
}

function deleteResource(id) {
    if (!confirm('Bu kaynağı silmek istediğinizden emin misiniz?')) {
        return;
    }

    // Remove from sample data (in real app, make API call)
    const resourceIndex = sampleData.libraryResources?.findIndex(r => r.id === id);
    if (resourceIndex !== -1) {
        sampleData.libraryResources.splice(resourceIndex, 1);
    }

    closeModal();
    filterLibraryResources();
    showNotification('Kaynak silindi', 'success');
}

function findResourceById(id) {
    // Check enhanced sample data first
    const enhancedResources = [
        { 
            id: 1, 
            title: 'Astronomi Temelleri', 
            author: 'Prof. Dr. Ahmet Kaya',
            resource_type: 'kitap', 
            age_group: ['genc', 'yetiskin'], 
            tags: ['temel', 'gezegenler', 'yıldızlar'],
            difficulty_level: 'baslangic',
            downloads: 89,
            description: 'Astronomi biliminin temel kavramlarını açıklayan kapsamlı bir kaynak.'
        },
        { 
            id: 2, 
            title: 'Gök Mekaniği', 
            author: 'Dr. Zeynep Demir',
            resource_type: 'pdf', 
            age_group: ['yetiskin'], 
            tags: ['ileri', 'matematik', 'fizik'],
            difficulty_level: 'ileri',
            downloads: 34,
            description: 'Gök cisimlerinin hareketlerini matematiksel olarak açıklayan ileri seviye kaynak.'
        },
        {
            id: 3,
            title: 'Çocuklar İçin Uzay',
            author: 'Mehmet Yıldız',
            resource_type: 'video',
            age_group: ['cocuk'],
            tags: ['temel', 'eğlenceli', 'uzay'],
            difficulty_level: 'baslangic',
            downloads: 156,
            description: 'Çocukların uzay hakkında öğrenmesi için hazırlanmış eğlenceli video serisi.'
        },
        {
            id: 4,
            title: 'Teleskop Kullanım Kılavuzu',
            author: 'Ayşe Çelik',
            resource_type: 'pdf',
            age_group: ['genc', 'yetiskin'],
            tags: ['praktik', 'gözlem', 'ekipman'],
            difficulty_level: 'orta',
            downloads: 78,
            description: 'Teleskop seçimi ve kullanımı hakkında detaylı pratik bilgiler.'
        }
    ];

    return enhancedResources.find(r => r.id == id) || 
           (sampleData.libraryResources && sampleData.libraryResources.find(r => r.id == id));
}

function getAgeGroupLabel(ageGroup) {
    const labels = {
        'cocuk': 'Çocuk (6-12)',
        'genc': 'Genç (13-18)',
        'yetiskin': 'Yetişkin (18+)'
    };
    return labels[ageGroup] || ageGroup;
}

function archiveResource(id) {
    if (!confirm('Bu kaynağı arşivlemek istediğinizden emin misiniz?')) {
        return;
    }

    showNotification('Kaynak arşivlendi', 'success');
    filterLibraryResources();
}
