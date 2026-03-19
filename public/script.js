const API_URL = '/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    document.getElementById('task-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancel-edit-btn').addEventListener('click', cancelEdit);
});

let isEditing = false;
let currentEditId = null;

async function fetchTasks() {
    const container = document.getElementById('tasks-container');
    const loading = document.getElementById('loading');
    const countBadge = document.getElementById('task-count');
    
    loading.classList.remove('hidden');
    container.innerHTML = '';
    
    try {
        const response = await fetch(`${API_URL}/getTodos`);
        const result = await response.json();
        
        loading.classList.add('hidden');
        
        if (result.success && result.data.length > 0) {
            renderTasks(result.data);
            countBadge.innerText = `${result.data.length} Task${result.data.length > 1 ? 's' : ''}`;
        } else {
            countBadge.innerText = `0 Tasks`;
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
                    <i class="ph-light ph-folder-open" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>It's empty here. Time to launch a new task!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        loading.classList.add('hidden');
        showToast('Failed to load tasks. Verify backend.', 'error', 'ph-warning-circle');
    }
}

function renderTasks(tasks) {
    const container = document.getElementById('tasks-container');
    container.innerHTML = '';
    
    // Sort tasks by latest first
    tasks.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).reverse();
    
    tasks.forEach((task, index) => {
        const date = new Date(task.updatedAt || task.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        
        const card = document.createElement('div');
        card.className = `task-card ${task.completed ? 'task-completed' : ''}`;
        // Staggered animation delay
        card.style.animationDelay = `${index * 0.05}s`;
        
        card.innerHTML = `
            <div>
                <div class="task-header-row">
                    <h3 class="task-title">${escapeHTML(task.title)}</h3>
                    <div>
                        <input type="checkbox" id="chk-${task._id}" class="custom-checkbox complete-checkbox" data-id="${task._id}" ${task.completed ? 'checked' : ''}>
                        <label for="chk-${task._id}" class="checkbox-label">
                            <i class="ph-bold ph-check"></i>
                        </label>
                    </div>
                </div>
                <p class="task-desc">${escapeHTML(task.description)}</p>
                <div class="task-meta">
                    <i class="ph ph-clock"></i> ${date}
                </div>
            </div>
            <div class="task-actions">
                <button class="icon-btn edit" data-id="${task._id}">
                    <i class="ph-bold ph-pencil-simple"></i> Edit
                </button>
                <button class="icon-btn delete" data-id="${task._id}">
                    <i class="ph-bold ph-trash"></i> Delete
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    bindEvents();
}

function bindEvents() {
    document.querySelectorAll('.edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const taskTitle = e.currentTarget.closest('.task-card').querySelector('.task-title').innerText;
            const taskDesc = e.currentTarget.closest('.task-card').querySelector('.task-desc').innerText;
            startEdit({ _id: id, title: taskTitle, description: taskDesc });
        });
    });

    document.querySelectorAll('.delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const card = e.currentTarget.closest('.task-card');
            
            // Add shrink animation and delete
            card.style.transform = 'scale(0.8)';
            card.style.opacity = '0';
            setTimeout(() => deleteTask(id), 300);
        });
    });

    document.querySelectorAll('.complete-checkbox').forEach(chk => {
        chk.addEventListener('change', (e) => {
            const id = e.target.getAttribute('data-id');
            const isChecked = e.target.checked;
            toggleComplete(id, isChecked);
        });
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const titleEle = document.getElementById('title');
    const descEle = document.getElementById('description');
    const btn = document.getElementById('submit-btn');
    const btnText = btn.querySelector('span');
    const btnIcon = btn.querySelector('i');
    
    const title = titleEle.value.trim();
    const description = descEle.value.trim();
    
    if (!title || !description) return;

    if(title.length > 50 || description.length > 50) {
        showToast("Title and Description must be max 50 characters", "error", "ph-warning-circle");
        return;
    }

    try {
        btn.disabled = true;
        btnText.innerText = isEditing ? 'Updating...' : 'Launching...';
        btnIcon.className = 'ph-bold ph-spinner-gap spin';
        
        const endpoint = isEditing ? `/updateTodo/${currentEditId}` : '/createTodo';
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showToast(isEditing ? 'Task updated!' : 'Task created successfully!', 'success', 'ph-check-circle');
            titleEle.value = '';
            descEle.value = '';
            if (isEditing) cancelEdit();
            fetchTasks(); 
        } else {
            showToast(result.message || 'Error saving task', 'error', 'ph-warning-circle');
        }
    } catch (error) {
        console.error('Error saving task:', error);
        showToast('Network error, could not save task', 'error', 'ph-wifi-slash');
    } finally {
        btn.disabled = false;
        btnText.innerText = isEditing ? 'Update Task' : 'Create Task';
        btnIcon.className = 'ph-bold ph-arrow-right';
    }
}

function startEdit(task) {
    isEditing = true;
    currentEditId = task._id;
    
    const titleEle = document.getElementById('title');
    const descEle = document.getElementById('description');
    
    titleEle.value = task.title;
    descEle.value = task.description;
    
    document.querySelector('#submit-btn span').innerText = 'Update Task';
    document.getElementById('cancel-edit-btn').classList.remove('hidden');
    
    document.querySelector('.container').scrollTo({ top: 0, behavior: 'smooth' });
    titleEle.focus();
}

function cancelEdit() {
    isEditing = false;
    currentEditId = null;
    
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    
    document.querySelector('#submit-btn span').innerText = 'Create Task';
    document.getElementById('cancel-edit-btn').classList.add('hidden');
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/deleteTodo/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (response.ok && result.success) {
            showToast('Task eradicated', 'success', 'ph-trash');
            fetchTasks();
        } else {
            showToast(result.message || 'Error deleting task', 'error', 'ph-warning-circle');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showToast('Network error, could not delete task', 'error', 'ph-wifi-slash');
    }
}

async function toggleComplete(id, completed) {
    try {
        const response = await fetch(`${API_URL}/updateTodo/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        const result = await response.json();
        if (response.ok && result.success) {
            fetchTasks();
        } else {
            showToast(result.message || 'Error updating status', 'error', 'ph-warning-circle');
        }
    } catch (error) {
        console.error('Error toggling status:', error);
        showToast('Network error', 'error', 'ph-wifi-slash');
    }
}

function showToast(message, type = 'success', iconName = 'ph-check-circle') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const msg = document.getElementById('toast-message');
    
    msg.innerText = message;
    toast.className = `toast show ${type}`;
    icon.className = `ph-fill ${iconName} toast-icon`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Fluid Mouse Hover Effect Tracker
document.getElementById('tasks-container').onmousemove = e => {
  for(const card of document.getElementsByClassName('task-card')) {
    const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }
};