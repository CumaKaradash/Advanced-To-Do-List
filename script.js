// DOM elementlerini seç
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const taskDate = document.getElementById('task-date');
const taskList = document.getElementById('task-list');
const filterCategory = document.getElementById('filter-category');
const filterPriority = document.getElementById('filter-priority');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');

// Görevleri saklamak için bir dizi
let tasks = [];

// Event listeners
taskForm.addEventListener('submit', addTask);
filterCategory.addEventListener('change', filterTasks);
filterPriority.addEventListener('change', filterTasks);
searchInput.addEventListener('input', searchTasks);
themeToggle.addEventListener('click', toggleTheme);

// Görev ekleme fonksiyonu
function addTask(e) {
    e.preventDefault();
    
    if (taskInput.value.trim() === '') return;

    const newTask = {
        id: Date.now(),
        text: taskInput.value,
        category: taskCategory.value,
        priority: taskPriority.value,
        dueDate: taskDate.value ? new Date(taskDate.value) : null,
        completed: false,
        createdAt: new Date()
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskDate.value = '';
}

// Görevleri render etme fonksiyonu
function renderTasks(tasksToRender = tasks) {
    taskList.innerHTML = '';
    tasksToRender.forEach(task => {
        const li = document.createElement('li');
        li.className = `list-group-item task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`;
        li.setAttribute('data-id', task.id);
        
        li.innerHTML = `
            <span>
                ${task.text} 
                <small class="text-muted">(${task.category})</small>
                ${task.dueDate ? `<small class="text-muted">Tarih: ${new Date(task.dueDate).toLocaleDateString()}</small>` : ''}
            </span>
            <div class="task-actions">
                <button class="btn btn-sm btn-success complete-btn">✓</button>
                <button class="btn btn-sm btn-danger delete-btn">×</button>
            </div>
        `;
        
        li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
        
        taskList.appendChild(li);
    });

    updateStats();
}

// Görev tamamlama durumunu değiştirme
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
}

// Görev silme
function deleteTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    gsap.to(taskElement, {
        duration: 0.5,
        opacity: 0,
        x: 100,
        onComplete: () => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }
    });
}

// Görevleri filtreleme
function filterTasks() {
    const category = filterCategory.value;
    const priority = filterPriority.value;
    let filteredTasks = tasks;

    if (category) {
        filteredTasks = filteredTasks.filter(t => t.category === category);
    }

    if (priority) {
        filteredTasks = filteredTasks.filter(t => t.priority === priority);
    }

    renderTasks(filteredTasks);
}

// Görevleri arama
function searchTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(searchTerm) ||
        task.category.toLowerCase().includes(searchTerm)
    );
    renderTasks(filteredTasks);
}

// İstatistikleri güncelleme
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const statsHtml = `
        <p>Toplam Görev: ${totalTasks}</p>
        <p>Tamamlanan: ${completedTasks}</p>
        <p>Bekleyen: ${pendingTasks}</p>
    `;

    document.getElementById('task-stats').innerHTML = statsHtml;
}

// LocalStorage'a kaydetme
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// LocalStorage'dan yükleme
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
}

// Tema değiştirme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Sürükle ve bırak sıralama
new Sortable(taskList, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: function() {
        const newOrder = Array.from(taskList.children).map(li => parseInt(li.getAttribute('data-id')));
        tasks = newOrder.map(id => tasks.find(t => t.id === id));
        saveTasks();
    }
});

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Dil seçimi için DOM elementi
const languageSelect = document.getElementById('language-select');

// Dil çevirileri
const translations = {
    tr: {
        title: "Gelişmiş To-Do List",
        addTask: "Yeni görev ekle",
        category: "Kategori seç",
        priority: "Öncelik",
        date: "Tarih",
        add: "Ekle",
        allCategories: "Tüm kategoriler",
        allPriorities: "Tüm öncelikler",
        search: "Görev ara...",
        work: "İş",
        personal: "Kişisel",
        shopping: "Alışveriş",
        low: "Düşük",
        medium: "Orta",
        high: "Yüksek",
        totalTasks: "Toplam Görev",
        completed: "Tamamlanan",
        pending: "Bekleyen",
        changeTheme: "Tema Değiştir"
    },
    en: {
        title: "Advanced To-Do List",
        addTask: "Add new task",
        category: "Select category",
        priority: "Priority",
        date: "Date",
        add: "Add",
        allCategories: "All categories",
        allPriorities: "All priorities",
        search: "Search tasks...",
        work: "Work",
        personal: "Personal",
        shopping: "Shopping",
        low: "Low",
        medium: "Medium",
        high: "High",
        totalTasks: "Total Tasks",
        completed: "Completed",
        pending: "Pending",
        changeTheme: "Change Theme"
    }
};

let currentLanguage = 'tr';

// Dil değiştirme fonksiyonu
function changeLanguage(lang) {
    currentLanguage = lang;
    document.querySelector('h1').textContent = translations[lang].title;
    document.getElementById('task-input').placeholder = translations[lang].addTask;
    document.getElementById('task-category').options[0].text = translations[lang].category;
    document.getElementById('task-category').options[1].text = translations[lang].work;
    document.getElementById('task-category').options[2].text = translations[lang].personal;
    document.getElementById('task-category').options[3].text = translations[lang].shopping;
    document.getElementById('task-priority').options[0].text = translations[lang].low;
    document.getElementById('task-priority').options[1].text = translations[lang].medium;
    document.getElementById('task-priority').options[2].text = translations[lang].high;
    document.querySelector('button[type="submit"]').textContent = translations[lang].add;
    document.getElementById('filter-category').options[0].text = translations[lang].allCategories;
    document.getElementById('filter-category').options[1].text = translations[lang].work;
    document.getElementById('filter-category').options[2].text = translations[lang].personal;
    document.getElementById('filter-category').options[3].text = translations[lang].shopping;
    document.getElementById('filter-priority').options[0].text = translations[lang].allPriorities;
    document.getElementById('filter-priority').options[1].text = translations[lang].low;
    document.getElementById('filter-priority').options[2].text = translations[lang].medium;
    document.getElementById('filter-priority').options[3].text = translations[lang].high;
    document.getElementById('search-input').placeholder = translations[lang].search;
    document.getElementById('theme-toggle').textContent = translations[lang].changeTheme;
    renderTasks();
    updateStats();
}

// Dil seçimi için event listener
languageSelect.addEventListener('change', (e) => changeLanguage(e.target.value));

// updateStats fonksiyonunu güncelle
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    const statsHtml = `
        <p>${translations[currentLanguage].totalTasks}: ${totalTasks}</p>
        <p>${translations[currentLanguage].completed}: ${completedTasks}</p>
        <p>${translations[currentLanguage].pending}: ${pendingTasks}</p>
    `;

    document.getElementById('task-stats').innerHTML = statsHtml;
}

// renderTasks fonksiyonunu güncelle
function renderTasks(tasksToRender = tasks) {
    taskList.innerHTML = '';
    tasksToRender.forEach(task => {
        const li = document.createElement('li');
        li.className = `list-group-item task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`;
        li.setAttribute('data-id', task.id);
        
        li.innerHTML = `
            <span>
                ${task.text} 
                <small class="text-muted">(${translations[currentLanguage][task.category]})</small>
                ${task.dueDate ? `<small class="text-muted">${translations[currentLanguage].date}: ${new Date(task.dueDate).toLocaleDateString()}</small>` : ''}
            </span>
            <div class="task-actions">
                <button class="btn btn-sm btn-success complete-btn">✓</button>
                <button class="btn btn-sm btn-danger delete-btn">×</button>
            </div>
        `;
        
        li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
        
        taskList.appendChild(li);
    });

    updateStats();
}

// Sayfa yüklendiğinde çalışacak fonksiyona dil değiştirme özelliğini ekle
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
    changeLanguage(currentLanguage); // Varsayılan dili yükle
});