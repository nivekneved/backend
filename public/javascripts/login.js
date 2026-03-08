document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const btn = document.getElementById('login-btn');
    const errorMsg = document.getElementById('error-msg');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            btn.disabled = true;
            btn.innerText = 'Authenticating...';
            errorMsg.style.display = 'none';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok && data.token) {
                    localStorage.setItem('tl_token', data.token);
                    localStorage.setItem('tl_user', JSON.stringify(data));
                    window.location.href = '/dashboard';
                } else {
                    errorMsg.innerText = data.message || 'Login failed';
                    errorMsg.style.display = 'block';
                }
            } catch (err) {
                errorMsg.innerText = 'Connection error';
                errorMsg.style.display = 'block';
            } finally {
                btn.disabled = false;
                btn.innerText = 'Secure Login';
            }
        });
    }

    // Redirect if already logged in
    if (localStorage.getItem('tl_token')) {
        window.location.href = '/dashboard';
    }
});
