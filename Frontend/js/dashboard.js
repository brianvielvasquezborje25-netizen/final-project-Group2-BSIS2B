window.onload = async function () {
  try {
    const res = await fetch('http://localhost:5000/api/users');
    const users = await res.json();

    const container = document.getElementById('userList');
    if (!container) return;

    container.innerHTML = ''; // Clear previous content

    if (users.length === 0) {
      container.innerHTML = '<p class="text-muted">No users found.</p>';
      return;
    }

    users.forEach(user => {
      const div = document.createElement('div');
      div.className = 'card mb-2 p-3 shadow-sm border-0';
      div.innerHTML = `
        <h5 class="text-dark font-weight-bold">${user.name || user.username}</h5>
        <p class="text-muted mb-0">${user.email}</p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};