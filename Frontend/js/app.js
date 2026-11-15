/* ==========================================
   BU Hangout - Client-Side App & API Placeholders
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log("BU Hangout Frontend Loaded Successfully!");

    // ==========================================
    // 1. LOGIN FORM HANDLER (User.js)
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log("Attempting login with:", { email });
            
            // TODO: Connect to Backend API (e.g., POST /api/users/login)
            // Example:
            // const response = await fetch('http://localhost:5000/api/users/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, password })
            // });
            // const data = await response.json();
            
            // Temporary redirect placeholder for grading/testing:
            window.location.href = 'dashboard.html';
        });
    }

    // ==========================================
    // 2. REGISTER FORM HANDLER (User.js)
    // ==========================================
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            console.log("Registering user:", { name, email, role });
            
            // TODO: Connect to Backend API (e.g., POST /api/users/register)
            alert('Registration placeholder triggered successfully!');
            window.location.href = 'login.html';
        });
    }

    // ==========================================
    // 3. STALL DIRECTORY & SEARCH FILTER (Stall.js)
    // ==========================================
    const stallSearchInput = document.getElementById('stallSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchBtn && stallSearchInput) {
        searchBtn.addEventListener('click', () => {
            const query = stallSearchInput.value.toLowerCase();
            console.log("Searching stalls for:", query);
            
            // TODO: Filter stall items or fetch from GET /api/stalls?search=query
        });
    }

    // ==========================================
    // 4. ADD MENU ITEM FORM (MenuItem.js)
    // ==========================================
    const addMenuItemForm = document.getElementById('addMenuItemForm');
    if (addMenuItemForm) {
        addMenuItemForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const itemName = document.getElementById('itemName').value;
            const category = document.getElementById('category').value;
            const price = document.getElementById('price').value;
            const isAvailable = document.getElementById('isAvailable').checked;
            const isBestseller = document.getElementById('isBestseller')?.checked || false;

            console.log("Adding menu item:", { itemName, category, price, isAvailable, isBestseller });

            // TODO: Connect to Backend API (e.g., POST /api/menuitems)
            alert(`Menu item "${itemName}" added successfully!`);
            addMenuItemForm.reset();
        });
    }

    // ==========================================
    // 5. DYNAMIC MENU MODAL POPULATOR
    // ==========================================
    const menuModal = document.getElementById('menuModal');
    if (menuModal) {
        menuModal.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            const stallName = button.getAttribute('data-stall-name');
            
            const modalTitle = menuModal.querySelector('.modal-title');
            modalTitle.textContent = `${stallName} - Menu`;

            console.log(`Fetching menu items for stall: ${stallName}`);
            // TODO: Fetch menu items belonging to this stall from backend API
        });
    }
});