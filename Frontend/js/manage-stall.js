const API_BASE_URL = 'http://localhost:5000/api';
let activeStallId = '';

// ==========================================
// 1. FETCH ACTIVE STALL ID
// ==========================================
async function fetchActiveStallId() {
    try {
        const res = await fetch(`${API_BASE_URL}/stalls`);
        if (!res.ok) return;

        const stalls = await res.json();
        const list = Array.isArray(stalls) ? stalls : (stalls.stalls || stalls.data || []);
        if (list.length > 0 && !activeStallId) {
            activeStallId = list[0]._id || list[0].id || '';
        }
    } catch (err) {
        console.error('Failed to fetch stalls:', err);
    }
}

// ==========================================
// 2. STALL DETAILS SUBMISSION (POST)
// ==========================================
document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (e) => e.preventDefault());
});

document.getElementById('saveStallBtn')?.addEventListener('click', async function (e) {
    e.preventDefault();

    const stallName = document.getElementById('stallName')?.value.trim() || '';
    const section = document.getElementById('stallSection')?.value.trim() || '';
    const description = document.getElementById('stallDescription')?.value.trim() || '';
    const opens = document.getElementById('openTime')?.value || '08:30 AM';
    const closes = document.getElementById('closeTime')?.value || '04:30 PM';
    const operatingHours = `${opens} - ${closes}`;
    const isOpen = document.getElementById('isOpen')?.checked ?? false;
    const gcashAvailable = document.getElementById('gcashAvailable')?.checked ?? false;

    try {
        const response = await fetch(`${API_BASE_URL}/stalls`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                stallName,
                section,
                description,
                operatingHours,
                isOpen,
                gcashAvailable
            })
        });

        const data = await response.json();
        if (response.ok) {
            activeStallId = data._id || data.stall?._id || data.id || activeStallId;
            alert('Stall details saved to database successfully!');
            if (typeof loadStalls === 'function') {
                loadStalls();
            }
        } else {
            alert(`Error: ${data.message || 'Failed to save stall details'}`);
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('Server connection failed. Make sure your server is running.');
    }
});

// ==========================================
// 3. ADD ITEM MODAL RESET & SAVE (POST / PUT)
// ==========================================
document.getElementById('addItemBtn')?.addEventListener('click', function () {
    document.getElementById('itemForm')?.reset();

    const itemIdInput = document.getElementById('itemId');
    if (itemIdInput) itemIdInput.value = '';

    const modalTitle = document.getElementById('itemModalTitle');
    if (modalTitle) modalTitle.textContent = 'Add menu item';
});

document.getElementById('saveItemBtn')?.addEventListener('click', async function () {
    const itemId = document.getElementById('itemId')?.value?.trim() || '';
    const itemName = document.getElementById('itemName')?.value.trim() || '';
    const price = Number(document.getElementById('itemPrice')?.value);
    const isAvailable = document.getElementById('itemAvailable')?.checked ?? true;
    const category = document.getElementById('itemCategory')?.value.trim() || 'General';

    if (!activeStallId) {
        await fetchActiveStallId();
    }

    if (!itemName || !price) {
        alert('Please fill in both item name and price.');
        return;
    }

    if (!activeStallId) {
        alert('No stall found. Please save stall details first.');
        return;
    }

    const isEditing = Boolean(itemId);
    const url = isEditing ? `${API_BASE_URL}/menu/${itemId}` : `${API_BASE_URL}/menu/add`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                stallId: activeStallId,
                itemName,
                category,
                price,
                isAvailable
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert(isEditing ? 'Menu item updated successfully!' : 'Menu item added successfully!');

            document.getElementById('itemForm')?.reset();
            const itemIdInput = document.getElementById('itemId');
            if (itemIdInput) itemIdInput.value = '';

            const modalEl = document.getElementById('itemModal');
            const modal = bootstrap.Modal.getInstance(modalEl) || bootstrap.Modal.getOrCreateInstance(modalEl);
            if (modal) modal.hide();

            if (typeof loadMenuItems === 'function') {
                loadMenuItems();
            }
        } else {
            alert(`Error: ${data.error || data.message || 'Failed to save menu item'}`);
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('Server connection failed.');
    }
});

// ==========================================
// 4. LOAD, EDIT & DELETE MENU ITEMS
// ==========================================
async function loadMenuItems() {
    try {
        if (!activeStallId) {
            await fetchActiveStallId();
        }

        const url = activeStallId
            ? `${API_BASE_URL}/menu?stallId=${activeStallId}`
            : `${API_BASE_URL}/menu`;

        const response = await fetch(url);
        if (!response.ok) return;

        const items = await response.json();
        const tbody = document.getElementById('menuTableBody');
        const emptyMsg = document.getElementById('menuEmpty');
        if (!tbody) return;

        if (!Array.isArray(items) || items.length === 0) {
            tbody.innerHTML = '';
            if (emptyMsg) emptyMsg.classList.remove('d-none');
            return;
        }

        if (emptyMsg) emptyMsg.classList.add('d-none');

        tbody.innerHTML = items.map((item) => `
            <tr>
                <td>${item.itemName}</td>
                <td>₱${Number(item.price).toFixed(2)}</td>
                <td>${item.isAvailable ? 'Yes' : 'No'}</td>
                <td>
                    <button type="button" class="btn btn-sm btn-outline-dark me-1" data-id="${item._id}" onclick="editMenuItem('${item._id}')">Edit</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-id="${item._id}" onclick="deleteMenuItem('${item._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load menu items:', error);
    }
}

async function editMenuItem(id) {
    try {
        if (!activeStallId) {
            await fetchActiveStallId();
        }

        const url = activeStallId
            ? `${API_BASE_URL}/menu?stallId=${activeStallId}`
            : `${API_BASE_URL}/menu`;

        const response = await fetch(url);
        if (!response.ok) {
            alert('Failed to fetch menu item details.');
            return;
        }

        const items = await response.json();
        const item = Array.isArray(items) ? items.find((entry) => entry._id === id) : null;
        if (!item) {
            alert('Menu item not found.');
            return;
        }

        const itemIdInput = document.getElementById('itemId');
        if (itemIdInput) itemIdInput.value = item._id;

        if (document.getElementById('itemName')) {
            document.getElementById('itemName').value = item.itemName || '';
        }
        if (document.getElementById('itemPrice')) {
            document.getElementById('itemPrice').value = item.price ?? '';
        }
        if (document.getElementById('itemCategory')) {
            document.getElementById('itemCategory').value = item.category || 'General';
        }
        if (document.getElementById('itemAvailable')) {
            document.getElementById('itemAvailable').checked = Boolean(item.isAvailable);
        }

        const modalTitle = document.getElementById('itemModalTitle');
        if (modalTitle) modalTitle.textContent = 'Edit menu item';

        const modalEl = document.getElementById('itemModal');
        if (modalEl && window.bootstrap) {
            bootstrap.Modal.getOrCreateInstance(modalEl).show();
        }
    } catch (error) {
        console.error('Error loading menu item for editing:', error);
        alert('Server connection failed while loading menu item.');
    }
}

async function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        if (response.ok) {
            alert('Menu item deleted successfully!');
            if (typeof loadMenuItems === 'function') {
                loadMenuItems();
            }
        } else {
            alert(`Error: ${data.error || data.message || 'Failed to delete menu item'}`);
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Server connection failed.');
    }
}

// Initial load
fetchActiveStallId().then(() => loadMenuItems());