document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('simForm');
    const resultsPanel = document.querySelector('.results-panel');
    const metricsDiv = document.getElementById('metricsTable');
    const movementChartCtx = document.getElementById('movementChart').getContext('2d');
    const energyChartCtx = document.getElementById('energyChart').getContext('2d');
    const waitingChartCtx = document.getElementById('waitingChart').getContext('2d');
    const darkToggle = document.getElementById('darkModeToggle');
    const exportBtn = document.getElementById('exportCsvBtn');

    let movementChart, energyChart, waitingChart;

    darkToggle.addEventListener('click', () => {
        const html = document.documentElement;
        if (html.dataset.theme === 'light') {
            html.dataset.theme = 'dark';
            darkToggle.textContent = '?? Light Mode';
        } else {
            html.dataset.theme = 'light';
            darkToggle.textContent = '?? Dark Mode';
        }
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        form.reset();
        resultsPanel.style.display = 'none';
        if (movementChart) movementChart.destroy();
        if (energyChart) energyChart.destroy();
        if (waitingChart) waitingChart.destroy();
    });

    document.getElementById('randomBtn').addEventListener('click', () => {
        const diskSize = parseInt(document.getElementById('diskSize').value) || 200;
        const count = Math.min(20, diskSize);
        const arr = [];
        while (arr.length < count) {
            const val = Math.floor(Math.random() * diskSize);
            if (!arr.includes(val)) arr.push(val);
        }
        document.getElementById('requestQueue').value = arr.join(',');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            diskSize: document.getElementById('diskSize').value,
            headPosition: document.getElementById('headPosition').value,
            direction: document.getElementById('direction').value,
            requestQueue: document.getElementById('requestQueue').value,
            alpha: document.getElementById('alpha').value,
            beta: document.getElementById('beta').value,
            baseEnergy: document.getElementById('baseEnergy').value,
            energyFactor: document.getElementById('energyFactor').value,
        };
        const res = await fetch('/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.error) {
            alert(data.error);
            return;
        }
        // Build metrics table
        let html = '<table><thead><tr><th>Algorithm</th><th>Total Movement</th><th>Avg Seek</th><th>Avg Waiting</th><th>Energy</th><th>Throughput</th></tr></thead><tbody>';
        let bestAlgo = null;
        let bestScore = Infinity;
        const movementData = {labels: [], values: []};
        const energyData = {labels: [], values: []};
        const waitingData = {labels: [], values: []};
        for (const [algo, m] of Object.entries(data)) {
            html += <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>;
            const score = m.total_movement; // simple ranking by movement
            if (score < bestScore) { bestScore = score; bestAlgo = algo; }
            movementData.labels.push(algo);
            movementData.values.push(m.total_movement);
            energyData.labels.push(algo);
            energyData.values.push(m.energy);
            waitingData.labels.push(algo);
            waitingData.values.push(m.avg_waiting);
        }
        html += '</tbody></table>';
        html += <p><strong>Best algorithm (least movement): </strong></p>;
        metricsDiv.innerHTML = html;
        // Charts
        if (movementChart) movementChart.destroy();
        movementChart = new Chart(movementChartCtx, {
            type: 'bar',
            data: { labels: movementData.labels, datasets: [{ label: 'Total Head Movement', data: movementData.values, backgroundColor: 'rgba(54,162,235,0.6)' }] },
            options: { responsive: true }
        });
        if (energyChart) energyChart.destroy();
        energyChart = new Chart(energyChartCtx, {
            type: 'bar',
            data: { labels: energyData.labels, datasets: [{ label: 'Energy Consumption', data: energyData.values, backgroundColor: 'rgba(255,99,132,0.6)' }] },
            options: { responsive: true }
        });
        if (waitingChart) waitingChart.destroy();
        waitingChart = new Chart(waitingChartCtx, {
            type: 'bar',
            data: { labels: waitingData.labels, datasets: [{ label: 'Avg Waiting Time', data: waitingData.values, backgroundColor: 'rgba(75,192,192,0.6)' }] },
            options: { responsive: true }
        });
        resultsPanel.style.display = 'block';
        // Export CSV handler
        exportBtn.onclick = async () => {
            const resp = await fetch('/export_csv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const blob = await resp.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'results.csv'; a.click();
            window.URL.revokeObjectURL(url);
        };
    });
});
