/* global document, window, history */
document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    const token = localStorage.getItem('tl_token');
    if (!token) {
        window.location.href = '/';
        return;
    }

    let dashboardData = [];

    // View Switching Logic
    function checkRoute() {
        const path = window.location.pathname;
        const statsGrid = document.getElementById('stats-grid');
        const tableView = document.getElementById('table-view');
        const controls = document.querySelector('.controls');

        if (path === '/dashboard' || path === '/dashboard/') {
            if (statsGrid) statsGrid.style.display = 'grid';
            if (tableView) tableView.style.display = 'none';
            if (controls) controls.style.display = 'flex';
            fetchStats();
        } else if (path.startsWith('/dashboard/')) {
            const table = path.split('/').pop();
            if (statsGrid) statsGrid.style.display = 'none';
            if (tableView) tableView.style.display = 'block';
            if (controls) controls.style.display = 'none';
            fetchTableData(table);
        }
    }

    // Secure Event Delegation for cards
    const gridContainer = document.getElementById('stats-grid');
    if (gridContainer) {
        gridContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.stat-card');
            if (card) {
                const table = card.getAttribute('data-table');
                if (table) {
                    history.pushState(null, '', `/dashboard/${table}`);
                    checkRoute();
                }
            }
        });
    }

    // Back Button
    const backBtn = document.getElementById('back-to-stats');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            history.pushState(null, '', '/dashboard');
            checkRoute();
        });
    }

    async function fetchStats() {
        try {
            const res = await fetch('/api/dashboard/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401) { logout(); return; }

            const json = await res.json();
            dashboardData = json.data;
            renderDashboard();
            if (gridContainer) gridContainer.classList.add('loaded');
        } catch (err) {
            console.error('Fetch error:', err);
        }
    }

    async function fetchTableData(table) {
        const titleEl = document.getElementById('current-table-title');
        if (titleEl) titleEl.textContent = table.replace(/_/g, ' ');

        try {
            const res = await fetch(`/api/dashboard/data/${table}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401) { logout(); return; }

            const json = await res.json();
            renderTable(json.data);
        } catch (err) {
            console.error('Table fetch error:', err);
        }
    }

    function renderDashboard() {
        const sortSelect = document.getElementById('sort-select');
        if (!gridContainer || !sortSelect) return;

        const sortBy = sortSelect.value;
        const sortedData = [...dashboardData].sort((a, b) => {
            if (sortBy === 'count') return b.count - a.count;
            return a.table.localeCompare(b.table);
        });

        gridContainer.innerHTML = sortedData.map(item => `
            <div class="stat-card" data-table="${item.table}">
                <div class="card-header">
                    <span class="table-name">${item.table.replace('_', ' ')}</span>
                    <span class="pulse"></span>
                </div>
                <div class="row-count">${item.count}</div>
                <div class="card-footer">Rows active in ecosystem</div>
            </div>
        `).join('');
    }

    function renderTable(data) {
        const head = document.getElementById('table-head');
        const body = document.getElementById('table-body');
        if (!head || !body) return;

        if (!data || data.length === 0) {
            head.innerHTML = '<th>No data found</th>';
            body.innerHTML = '';
            return;
        }

        const keys = Object.keys(data[0]);
        head.innerHTML = keys.map(k => `<th>${k}</th>`).join('');
        body.innerHTML = data.map(row => `
            <tr>
                ${keys.map(k => `<td>${row[k] === null ? '<span class="null">null</span>' : row[k]}</td>`).join('')}
            </tr>
        `).join('');
    }

    function logout() {
        localStorage.removeItem('tl_token');
        window.location.href = '/';
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', renderDashboard);
    }

    window.addEventListener('popstate', checkRoute);
    checkRoute();

    setInterval(() => {
        if (window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/') {
            fetchStats();
        }
    }, 30000);
});
