let isMobile = window.innerWidth <= 768;
let currentClaimItemId = null;

window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
});

function showForm(type) {
    if (isMobile) {
        const modal = document.getElementById('mobile-modal');
        const container = document.getElementById('modal-form-container');
        const formContent = document.getElementById('found-form').cloneNode(true);
        formContent.style.display = 'block';

        const form = formContent.querySelector('form');
        form.onsubmit = (e) => submitItem(e);

        const photoInput = form.querySelector('input[type="file"]');
        if (photoInput) {
            photoInput.onchange = (e) => {
                const file = e.target.files[0];
                const preview = formContent.querySelector('.photo-preview');
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (ev) {
                        preview.src = ev.target.result;
                        preview.classList.add('show');
                    }
                    reader.readAsDataURL(file);
                }
            };
        }

        container.innerHTML = '';
        container.appendChild(formContent);
        modal.classList.add('active');
    } else {
        document.querySelectorAll('.form-content').forEach(f => f.classList.remove('active'));
        document.querySelectorAll('.sidebar-button').forEach(b => b.classList.remove('active'));
        document.getElementById('found-form').classList.add('active');
        event.target.classList.add('active');
    }
}

function showArchive() {
    const foundPanel = document.querySelector('.found-panel');
    const archivePanel = document.querySelector('.archive-panel');
    const archiveBtn = event.target;

    if (archivePanel.style.display === 'block') {
        archivePanel.style.display = 'none';
        foundPanel.style.display = 'block';
        archiveBtn.classList.remove('active');
        archiveBtn.textContent = 'Archive';
    } else {
        foundPanel.style.display = 'none';
        archivePanel.style.display = 'block';
        archiveBtn.classList.add('active');
        archiveBtn.textContent = 'Back';
        
        document.querySelectorAll('.sidebar-button').forEach(b => {
            if (b !== archiveBtn) b.classList.remove('active');
        });
        document.querySelectorAll('.form-content').forEach(f => f.classList.remove('active'));
    }
}

function closeModal() {
    document.getElementById('mobile-modal').classList.remove('active');
}

function closeClaimModal() {
    document.getElementById('claim-modal').classList.remove('active');
    currentClaimItemId = null;
}

function previewPhoto(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('found-preview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.add('show');
        }
        reader.readAsDataURL(file);
    }
}


function submitItem(event) {
    event.preventDefault();
    const form = event.target; // <--- Save the form here!
    const formData = new FormData(form);

    fetch('submit_found_item.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Submitted successfully!');
            if (isMobile) {
                closeModal();
            } else {
                form.reset(); 
                const preview = form.querySelector('.photo-preview');
                if (preview) preview.classList.remove('show');
            }
            loadFoundItems(); // This refreshes the list
        }
    })
    .catch(error => {
        console.error('Real Error:', error); // DEBUG
        alert('The server ghosted me...');
    });
}

function displayFoundItem(item) {
    const list = document.getElementById('found-list');
    const noItems = list.querySelector('.no-items-found');
    if (noItems) noItems.style.display = 'none';

    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.itemId = item.item_id;
    
    const datePosted = new Date(item.created_at).toLocaleDateString();
    
    card.innerHTML = `
        <div class="item-photo">
            ${item.photo_src ? `<img src="${item.photo_src}" alt="${item.item_name}">` : ''}
        </div>
        <div class="item-details">
            <h4>${item.item_name}</h4>
            <h5>Category: ${item.category_name}</h5>
            <h5>Location: ${item.location}</h5>
            <h6>Date Posted: ${datePosted}</h6>
            <p>Description: ${item.item_description}</p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="claim-btn" onclick="openClaimModal(${item.item_id})">Claim This Item</button>
                <button class="delete-btn" onclick="deleteItem(${item.item_id}, false)">Delete</button>
            </div>
        </div>
    `;

    list.insertBefore(card, list.firstChild);
}

// Add after the displayFoundItem function
function deleteItem(item_id, isArchived = false) {
    const confirmed = confirm('Are you sure you want to delete this item? This action cannot be undone.');
    if (!confirmed) return;

    fetch('delete_items.php', {
        method: 'POST',
        body: JSON.stringify({item_id}),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (isArchived) {
                loadArchivedItems();
            } else {
                loadFoundItems();
            }
            alert('Item deleted successfully!');
        } else {
            alert('Failed to delete item.');
        }
    })
    .catch(error => {
        console.error('Delete error:', error);
        alert('Error deleting item.');
    });
}

function displayArchivedItem(item) {
    const list = document.getElementById('archive-list');
    const noItems = list.querySelector('.no-items-archive');
    if (noItems) noItems.style.display = 'none';

    const card = document.createElement('div');
    card.className = 'item-card';
    
    const dateClaimed = new Date(item.created_at).toLocaleDateString();
    
    card.innerHTML = `
        <div class="item-photo">
            ${item.photo_src ? `<img src="${item.photo_src}" alt="${item.item_name}">` : ''}
        </div>
        <div class="item-details">
            <h4>${item.item_name}</h4>
            <h5>Category: ${item.category_name}</h5>
            <h5>Location: ${item.location}</h5>
            <h6>Date Claimed: ${dateClaimed}</h6>
            <p>Description: ${item.item_description}</p>
            <div class="student-dropdown">
                <div class="student-info">
                    <p><strong>Claimed by:</strong></p>
                    <p><strong>Student Name:</strong> ${item.student_name}</p>
                    <p><strong>Student Number:</strong> ${item.student_id}</p>
                    <p><strong>Course & Section:</strong> ${item.student_course}</p>
                </div>
            </div>
            <button class="delete-btn" onclick="deleteItem(${item.item_id}, true)" style="margin-top: 10px;">Delete Record</button>
        </div>
    `;

    list.insertBefore(card, list.firstChild);
}

function openClaimModal(itemId) {
    currentClaimItemId = itemId;
    document.getElementById('claim-modal').classList.add('active');
}

function submitClaim(event) {
    event.preventDefault();

    const form = event.target;
    const studentName = form.querySelector('[name="student_name"]').value;
    const studentId = form.querySelector('[name="student_id"]').value;
    const studentCourse = form.querySelector('[name="student_course"]').value;

    const confirmed = confirm('Are you sure this is your item?');
    if (!confirmed) return;

    fetch('claim_item.php', {
        method: 'POST',
        body: JSON.stringify({
            itemId: currentClaimItemId,
            studentName,
            studentId,
            studentCourse
        }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadFoundItems();
            loadArchivedItems();
        }
    });

    form.reset();
    closeClaimModal();
    alert('Item claimed successfully! View it in the Archive.');
}


// Function to load found items from database
function loadFoundItems() {
    fetch('get_found_items.php')
        .then(response => response.json())
        .then(data => {
            console.log('Found items:', data); // DEBUG
            const list = document.getElementById('found-list');
            list.innerHTML = '';

            if (data.length === 0) {
                list.innerHTML = '<div class="no-items-found"><p>No found items posted yet.</p></div>';
            } else {
                data.forEach(item => displayFoundItem(item));
            }
        })
        .catch(error => console.error('Error:', error)); // DEBUG
}

// Function to load archived items from database
function loadArchivedItems() {
    fetch('get_archived_items.php')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('archive-list');
            list.innerHTML = '';

            if (data.length === 0) {
                list.innerHTML = '<div class="no-items-archive"><p>No archived items yet.</p></div>';
            } else {
                data.forEach(item => displayArchivedItem(item));
            }
        });
}
    
// Initialize: Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadFoundItems();
    loadArchivedItems();
});

window.onclick = function (event) {
    const mobileModal = document.getElementById('mobile-modal');
    const claimModal = document.getElementById('claim-modal');
    
    if (event.target === mobileModal) {
        closeModal();
    }
    if (event.target === claimModal) {
        closeClaimModal();
    }
};