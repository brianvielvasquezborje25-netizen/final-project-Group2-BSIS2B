const API_BASE_URL = 'http://localhost:5000/api';
let activeStallId = '';
let allStallsCache = [];

function getLoggedInUser() {
    const raw = localStorage.getItem('bu_hangout_user') || sessionStorage.getItem('bu_hangout_user');
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (_) {
        return null;
    }
}

function populateStallForm(stall) {
    if (!stall) return;
    const nameEl = document.getElementById('stallName');
    const secEl = document.getElementById('stallSection');
    const descEl = document.getElementById('stallDescription');
    const openEl = document.getElementById('openTime');
    const closeEl = document.getElementById('closeTime');
    const isOpenEl = document.getElementById('isOpen');
    const gcashEl = document.getElementById('acceptsGcash') || document.getElementById('gcashAvailable');

    if (nameEl && stall.stallName) nameEl.value = stall.stallName;
    if (secEl && stall.section) secEl.value = stall.section;
    if (descEl && stall.description !== undefined) descEl.value = stall.description;

    if (stall.operatingHours && stall.operatingHours.includes(' - ')) {
        const [rawOpen, rawClose] = stall.operatingHours.split(' - ').map(s => s.trim());
        if (openEl && /^\d{2}:\d{2}$/.test(rawOpen)) openEl.value = rawOpen;
        if (closeEl && /^\d{2}:\d{2}$/.test(rawClose)) closeEl.value = rawClose;
    }

    if (isOpenEl && typeof stall.isOpen === 'boolean') isOpenEl.checked = stall.isOpen;
    if (gcashEl && typeof stall.gcashAvailable === 'boolean') gcashEl.checked = stall.gcashAvailable;

    const statusText = document.getElementById('statusText');
    const statusPill = document.getElementById('statusPill');
    if (statusText) statusText.textContent = stall.isOpen ? 'Open' : 'Closed';
    if (statusPill) {
        statusPill.classList.toggle('tag-open', Boolean(stall.isOpen));
        statusPill.classList.toggle('tag-closed', !stall.isOpen);
    }
}

function renderStallsTable(list) {
    const tbody = document.getElementById('stallsTableBody');
    if (!tbody) return;

    const currentUser = getLoggedInUser();
    const currentUserId = currentUser?._id || currentUser?.id || '';

    if (!Array.isArray(list) || list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-muted">No stalls found.</td></tr>';
        return;
    }

    tbody.innerHTML = list.map((s) => {
        const id = s._id || s.id;
        const isOwner = currentUserId && String(s.ownerId) === String(currentUserId);
        return `
            <tr>
                <td><strong>${s.stallName || 'Untitled Stall'}</strong> ${isOwner ? '<span class="badge bg-warning text-dark">My Stall</span>' : ''}</td>
                <td>${s.section || '-'}</td>
                <td><span class="badge ${s.isOpen ? 'bg-success' : 'bg-secondary'}">${s.isOpen ? 'Open' : 'Closed'}</span></td>
                <td>
                    <button type="button" class="btn btn-sm btn-outline-dark me-1" onclick="selectStall('${id}')">Select</button>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteStall('${id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

window.selectStall = async function (id) {
    activeStallId = id;
    const found = allStallsCache.find((s) => String(s._id || s.id) === String(id));
    if (found) populateStallForm(found);
    await loadMenuItems();
};

window.deleteStall = async function (id) {
    if (!confirm('Delete this stall?')) return;
    try {
        const res = await fetch(`${API_BASE_URL}/stalls/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            alert(`Error: ${errData.message || errData.error || 'Failed to delete stall'}`);
            return;
        }
        if (String(activeStallId) === String(id)) activeStallId = '';
        await loadStalls();
        await loadMenuItems();
    } catch (err) {
        console.error('Delete stall error:', err);
        alert('Server connection failed.');
    }
};

// ==========================================
// 1. FETCH ACTIVE STALL ID & STALLS LIST
// ==========================================
async function loadStalls() {
    try {
        const res = await fetch(`${API_BASE_URL}/stalls`);
        if (!res.ok) return;

        const stalls = await res.json();
        const list = Array.isArray(stalls) ? stalls : (stalls.stalls || stalls.data || []);
        allStallsCache = list;
        renderStallsTable(list);

        const currentUser = getLoggedInUser();
        const currentUserId = currentUser?._id || currentUser?.id || '';
        const ownedStall = currentUserId
            ? list.find((s) => String(s.ownerId) === String(currentUserId))
            : null;

        const chosen = ownedStall || (activeStallId ? list.find((s) => String(s._id || s.id) === String(activeStallId)) : null) || list[0];
        if (chosen) {
            activeStallId = chosen._id || chosen.id || '';
            populateStallForm(chosen);
        }
    } catch (err) {
        console.error('Failed to fetch stalls:', err);
    }
}

async function fetchActiveStallId() {
    await loadStalls();
}

// ==========================================
// 2. STALL DETAILS SUBMISSION (POST / PUT)
// ==========================================
document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (e) => e.preventDefault());
});

async function handleSaveStall(e) {
    e?.preventDefault();

    const currentUser = getLoggedInUser();
    const ownerId = currentUser?._id || currentUser?.id;
    if (!ownerId) {
        alert('Please log in first before saving stall details.');
        return;
    }

    const stallName = document.getElementById('stallName')?.value.trim() || '';
    const section = document.getElementById('stallSection')?.value.trim() || '';
    const description = document.getElementById('stallDescription')?.value.trim() || '';
    const opens = document.getElementById('openTime')?.value || '08:30';
    const closes = document.getElementById('closeTime')?.value || '16:30';
    const operatingHours = `${opens} - ${closes}`;
    const isOpen = document.getElementById('isOpen')?.checked ?? false;
    const gcashAvailable = document.getElementById('acceptsGcash')?.checked
        ?? document.getElementById('gcashAvailable')?.checked
        ?? false;

    if (!stallName || !section) {
        alert('Please enter both stall name and course/section.');
        return;
    }

    // If the user already owns a stall, update it via PUT so unique ownerId doesn't conflict
    const existingOwned = allStallsCache.find((s) => String(s.ownerId) === String(ownerId));
    const targetId = existingOwned?._id || existingOwned?.id || activeStallId;
    const isUpdate = Boolean(existingOwned || targetId);

    const url = isUpdate ? `${API_BASE_URL}/stalls/${targetId}` : `${API_BASE_URL}/stalls`;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ownerId,
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
            alert(isUpdate ? 'Stall details updated successfully!' : 'Stall details saved to database successfully!');
            await loadStalls();
            await loadMenuItems();
        } else {
            alert(`Error: ${data.message || data.error || 'Failed to save stall details'}`);
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('Server connection failed. Make sure your server is running.');
    }
}

document.getElementById('saveStallBtn')?.addEventListener('click', handleSaveStall);
document.getElementById('stallForm')?.addEventListener('submit', handleSaveStall);

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

    if (!itemName || Number.isNaN(price) || price <= 0) {
        alert('Please fill in both item name and a valid price.');
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

            await loadMenuItems();
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
            await loadMenuItems();
        } else {
            alert(`Error: ${data.error || data.message || 'Failed to delete menu item'}`);
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Server connection failed.');
    }
}

// Initial load
loadStalls().then(() => loadMenuItems());