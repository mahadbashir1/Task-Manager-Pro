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
    
    loading.classList.remove('hidden');
    container.innerHTML = '';
    
    try {
        const response = await fetch(`${API_URL}/getTodos`);
        const result = await response.json();
        
        loading.classList.add('hidden');
        
        if (result.success && result.data.length > 0) {
            renderTasks(result.data);
        } else {
            container.innerHTML = '<p class="task-desc" style="grid-column: 1/-1; text-align: center; padding: 2rem;">No tasks found. Add one above!</p>';
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        loading.classList.add('hidden');
        showToast('Failed to load tasks', 'error');
    }
}

function renderTasks(tasks) {
    const container = document.getElementById('tasks-container');
    container.innerHTML = '';
    
    // Sort tasks by latest first
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    tasks.forEach(task => {
        const date = new Date(task.updatedAt || task.createdAt).toLocaleDateString();
        
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
            <div>
                <h3 class="task-title">${escapeHTML(task.title)}</h3>
                <p class="task-desc">${escapeHTML(task.description)}</p>
                <div class="task-meta">
                    <span>${date}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn edit-btn" data-id="${task._id}">Edit</button>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const task = tasks.find(t => t._id === id);
            startEdit(task);
        });
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const titleEle = document.getElementById('title');
    const descEle = document.getElementById('description');
    const btn = document.getElementById('submit-btn');
    
    const title = titleEle.value.trim();
    const description = descEle.value.trim();
    
    if (!title || !description) return;

    if(title.length > 50 || description.length > 50) {
        showToast("Title and Description must be max 50 characters", "error");
        return;
    }

    try {
        btn.disabled = true;
        btn.textContent = isEditing ? 'Updating...' : 'Creating...';
        
        const endpoint = isEditing ? `/updateTodo/${currentEditId}` : '/createTodo';
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST', // Backend explicitly uses POST for both
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            showToast(isEditing ? 'Task updated successfully' : 'Task created successfully', 'success');
            titleEle.value = '';
            descEle.value = '';
            if (isEditing) cancelEdit();
            fetchTasks(); // Refresh list to get new IDs
        } else {
            showToast(result.message || 'Error saving task', 'error');
        }
    } catch (error) {
        console.error('Error saving task:', error);
        showToast('Network error, could not save task', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = isEditing ? 'Update Task' : 'Create Task';
    }
}

function startEdit(task) {
    isEditing = true;
    currentEditId = task._id;
    
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    
    document.getElementById('submit-btn').textContent = 'Update Task';
    document.getElementById('cancel-edit-btn').classList.remove('hidden');
    
    document.querySelector('.task-form-section').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('title').focus();
}

function cancelEdit() {
    isEditing = false;
    currentEditId = null;
    
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    
    document.getElementById('submit-btn').textContent = 'Create Task';
    document.getElementById('cancel-edit-btn').classList.add('hidden');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
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
