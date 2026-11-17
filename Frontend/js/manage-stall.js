const API_BASE_URL = 'http://localhost:5000/api'; // Matches PORT 5000

// 1. STALL DETAILS FORM SUBMISSION (Stall.js)
document.getElementById('stallDetailsForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const stallName = document.getElementById('stallName').value.trim();
    const section = document.getElementById('section').value.trim();
    const description = document.getElementById('description')?.value.trim() || '';
    const opens = document.getElementById('opens')?.value || '08:30 AM';
    const closes = document.getElementById('closes')?.value || '04:30 PM';
    const operatingHours = `${opens} - ${closes}`;
    const isOpen = document.getElementById('isOpen').checked;
    const gcashAvailable = document.getElementById('gcashAvailable').checked;

    try {
        const response = await fetch(`${API_BASE_URL}/stalls`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stallName, section, description, operatingHours, isOpen, gcashAvailable })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Stall details saved to database successfully!');
        } else {
            alert(`Error: ${data.message || 'Failed to save stall details'}`);
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('Server connection failed. Make sure your server is running.');
    }
});

// 2. ADD MENU ITEM FORM SUBMISSION (MenuItem.js -> /api/menu)
document.getElementById('addMenuItemForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const itemName = document.getElementById('itemName').value.trim();
    const category = document.getElementById('category').value;
    const price = parseFloat(document.getElementById('price').value);
    const isAvailable = document.getElementById('isAvailable').checked;
    const isBestseller = document.getElementById('isBestseller')?.checked || false;

    try {
        const response = await fetch(`${API_BASE_URL}/menu`, { // Updated to match server.js mount /api/menu
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemName, category, price, isAvailable, isBestseller })
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Menu item "${itemName}" added to database!`);
            this.reset();
        } else {
            alert(`Error: ${data.message || 'Failed to add menu item'}`);
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('Server connection failed.');
    }
});