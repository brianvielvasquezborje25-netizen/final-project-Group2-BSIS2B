/* Shared helpers for all BU Hangout pages */

/* Scalloped (wavy-edge) badge, drawn as inline SVG */
function scallopSVG(fill) {
  const n = 12, cx = 50, cy = 50, r = 42, amp = 5, pts = [];
  for (let i = 0; i <= 240; i++) {
    const a = (i / 240) * Math.PI * 2, rr = r + amp * Math.sin(a * n);
    pts.push((cx + rr * Math.cos(a)).toFixed(2) + ',' + (cy + rr * Math.sin(a)).toFixed(2));
  }
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><polygon points="${pts.join(' ')}" fill="${fill}" stroke="#4a2a1a" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
}
function decorateScallops(root = document) {
  root.querySelectorAll('.scallop:not([data-done])').forEach(el => {
    el.insertAdjacentHTML('afterbegin', scallopSVG(el.dataset.fill || '#fffaf0'));
    el.dataset.done = '1';
  });
}

/* Show/hide password: <button data-toggle-password="#passwordInputId"> */
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-toggle-password]');
  if (!btn) return;
  const input = document.querySelector(btn.dataset.togglePassword);
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  btn.querySelector('i').className = show ? 'bi bi-eye-slash' : 'bi bi-eye';
  btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
});

/* Logout modal is injected on any page that has a logout trigger */
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-bs-target="#logoutModal"]') && !document.getElementById('logoutModal')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="logoutTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm">
          <div class="modal-content sticker">
            <div class="modal-body text-center p-4">
              <i class="bi bi-box-arrow-right fs-1"></i>
              <h2 class="h3 mt-2" id="logoutTitle">Log out?</h2>
              <p class="small fw-semibold">You'll need to sign in again to manage your stall.</p>
              <form action="#" method="POST" id="logoutForm" class="d-flex gap-2 justify-content-center">
                <button type="button" class="btn btn-ink btn-ink-outline" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-ink">Logout</button>
              </form>
            </div>
          </div>
        </div>
      </div>`);
    // TODO (backend week): on submit, call POST /api/auth/logout, clear the token, redirect to login.html
    document.getElementById('logoutForm').addEventListener('submit', e => { e.preventDefault(); window.location.href = 'login.html'; });
  }
  decorateScallops();
});

/* Bootstrap validation helper: add class "needs-validation" + novalidate to a form */
document.addEventListener('submit', e => {
  const form = e.target.closest('.needs-validation');
  if (form && !form.checkValidity()) { e.preventDefault(); e.stopPropagation(); }
  if (form) form.classList.add('was-validated');
}, true);
