document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Grab values using your exact HTML element IDs
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const name = `${firstName} ${lastName}`;
  const email = document.getElementById('email').value.trim();
  const section = document.getElementById('section').value.trim();
  const role = document.getElementById('role').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Simple password match validation
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        firstName,
        lastName,
        email,
        section,
        role,
        password
      })
    });

    const data = await response.json();
    console.log('Server response:', data);

    if (response.ok) {
      alert('User registered successfully!');
      window.location.href = 'login.html';
    } else {
      alert(`Error: ${data.message || 'Registration failed'}`);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Could not connect to the backend server. Make sure nodemon is running!');
  }
});