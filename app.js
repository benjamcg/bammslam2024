const weeklyData = [
    { date: "September 08, 2024", bennyWeight: 171.85, maggieWeight: 134 },
    { date: "September 15, 2024", bennyWeight: 170.70, maggieWeight: 133 },
    { date: "September 22, 2024", bennyWeight: 169.55, maggieWeight: 132 },
    { date: "September 29, 2024", bennyWeight: 168.40, maggieWeight: 131 },
    { date: "October 06, 2024", bennyWeight: 167.25, maggieWeight: 130 },
    { date: "October 13, 2024", bennyWeight: 166.10, maggieWeight: 129 },
    { date: "October 20, 2024", bennyWeight: 164.95, maggieWeight: 128 },
    { date: "October 27, 2024", bennyWeight: 163.80, maggieWeight: 127 },
    { date: "November 03, 2024", bennyWeight: 162.65, maggieWeight: 126 },
    { date: "November 10, 2024", bennyWeight: 161.50, maggieWeight: 125 },
    { date: "November 17, 2024", bennyWeight: 160.35, maggieWeight: 124 },
    { date: "November 24, 2024", bennyWeight: 159.20, maggieWeight: 123 },
    { date: "December 01, 2024", bennyWeight: 158.05, maggieWeight: 122 },
    { date: "December 08, 2024", bennyWeight: 156.90, maggieWeight: 121 },
    { date: "December 15, 2024", bennyWeight: 155.75, maggieWeight: 120 },
    { date: "December 22, 2024", bennyWeight: 154.60, maggieWeight: 119 },
    { date: "December 29, 2024", bennyWeight: 153.45, maggieWeight: 118 },
    { date: "January 05, 2025", bennyWeight: 152.30, maggieWeight: 117 },
    { date: "January 12, 2025", bennyWeight: 151.15, maggieWeight: 116 },
    { date: "January 19, 2025", bennyWeight: 150.00, maggieWeight: 115 }
];

let bennyScore = 0;
let maggieScore = 0;

function calculateScores() {
    bennyScore = 0;
    maggieScore = 0;

    weeklyData.forEach(({ date }) => {
        ['benny', 'maggie'].forEach(person => {
            ['weight', 'protein', 'carbs'].forEach(metric => {
                const checkbox = document.querySelector(`input[name="${date}-${person}-${metric}"]`);
                if (checkbox && checkbox.checked) {
                    if (person === 'benny') bennyScore += 5;
                    else maggieScore += 5;
                }
            });
        });
    });

    updateScores();
}

function updateScores() {
    const bennyBox = document.getElementById('benny-box');
    const maggieBox = document.getElementById('maggie-box');
    
    document.getElementById('benny-score').textContent = `$${bennyScore}`;
    document.getElementById('maggie-score').textContent = `$${maggieScore}`;

    // Save the scores to localStorage
    localStorage.setItem('bennyScore', bennyScore);
    localStorage.setItem('maggieScore', maggieScore);

    // Remove highlight and tie classes first
    bennyBox.classList.remove('highlight', 'tie');
    maggieBox.classList.remove('highlight', 'tie');

    // Compare scores and apply the appropriate class
    if (bennyScore > maggieScore) {
        bennyBox.classList.add('highlight');
    } else if (maggieScore > bennyScore) {
        maggieBox.classList.add('highlight');
    } else {
        // If both have the same score, apply the "tie" class
        bennyBox.classList.add('tie');
        maggieBox.classList.add('tie');
    }
}

function loadFromLocalStorage() {
    const savedBennyScore = localStorage.getItem('bennyScore');
    const savedMaggieScore = localStorage.getItem('maggieScore');
    if (savedBennyScore !== null) bennyScore = parseInt(savedBennyScore);
    if (savedMaggieScore !== null) maggieScore = parseInt(savedMaggieScore);

    weeklyData.forEach(({ date }) => {
        ['benny', 'maggie'].forEach(person => {
            ['weight', 'protein', 'carbs'].forEach(metric => {
                const savedValue = localStorage.getItem(`${date}-${person}-${metric}`);
                const checkbox = document.querySelector(`input[name="${date}-${person}-${metric}"]`);
                if (checkbox && savedValue === 'yes') {
                    checkbox.checked = true;
                }
            });

            const isCollapsed = localStorage.getItem(`${date}-collapsed`);
            const isHidden = localStorage.getItem(`${date}-hidden`);

            const entry = document.getElementById(`entry-${date}`);
            if (entry) {
                const triangle = entry.querySelector('.triangle');
                const weeklyDetails = entry.querySelector('.weekly-details');

                if (isCollapsed === 'true') {
                    weeklyDetails.style.display = 'none';
                    triangle.textContent = '▼';
                    entry.classList.add('collapsed');
                }

                if (isHidden === 'true') {
                    entry.style.display = 'none';
                }
            }
        });
    });

    calculateScores();
}

function createWeeklyEntry(week, bennyWeight, maggieWeight) {
    const weekEntry = document.createElement('div');
    weekEntry.classList.add('week-entry');
    weekEntry.id = `entry-${week}`;

    const dateHeader = document.createElement('div');
    dateHeader.classList.add('date-header');
    dateHeader.innerHTML = `
        <span class="half-circle">◡</span>
        <span>${week}</span>
        <span class="triangle">▲</span>
    `;

    const weeklyDetails = document.createElement('div');
    weeklyDetails.classList.add('weekly-details');
    weeklyDetails.innerHTML = `
        <div class="weekly-columns">
            <div class="weekly-column">
                <strong>Maggie</strong>
                <p>Goal: ${maggieWeight} lbs</p>
                <div class="checkbox-group">
                    <label><input type="checkbox" name="${week}-maggie-weight" /> Weight Reached</label>
                </div>
                <div class="checkbox-group">
                    <label><input type="checkbox" name="${week}-maggie-protein" /> Protein ≥ 30%</label>
                </div>
                <div class="checkbox-group">
                    <label><input type="checkbox" name="${week}-maggie-carbs" /> Carbs ≤ 30%</label>
                </div>
            </div>
            <div class="vertical-line"></div>
            <div class="weekly-column">
                <strong>Benny</strong>
                <p>Goal: ${bennyWeight} lbs</p>
                <div class="checkbox-group">
                    <label><input type="checkbox" name="${week}-benny-weight" /> Weight Reached</label>
                </div>
                <div class="checkbox-group">
                    <label><input type="checkbox" name="${week}-benny-protein" /> Protein ≥ 30%</label>
                </div>
                <div class="checkbox-group">
                    <label><input type="checkbox" name="${week}-benny-carbs" /> Carbs ≤ 30%</label>
                </div>
            </div>
        </div>
    `;

    weekEntry.appendChild(dateHeader);
    weekEntry.appendChild(weeklyDetails);

    // Toggle content visibility and rotate triangle
    dateHeader.addEventListener('click', () => {
        weekEntry.classList.toggle('collapsed');
        const triangle = dateHeader.querySelector('.triangle');
        const isCollapsed = weekEntry.classList.contains('collapsed');
        weeklyDetails.style.display = isCollapsed ? 'none' : 'block';
        triangle.textContent = isCollapsed ? '▼' : '▲';

        localStorage.setItem(`${week}-collapsed`, isCollapsed);
    });

    // Add event listener for half-circle ◡ to hide heading
    dateHeader.querySelector('.half-circle').addEventListener('click', (e) => {
        weekEntry.style.display = 'none';
        localStorage.setItem(`${week}-hidden`, true);
    });

    // Add event listeners to recalculate the scores dynamically when a checkbox changes
    weeklyDetails.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const [_, person, metric] = e.target.name.split('-');
            const value = e.target.checked ? 'yes' : 'no';

            // Save the checkbox state in localStorage
            localStorage.setItem(`${week}-${person}-${metric}`, value);

            // Recalculate the score every time a checkbox is changed
            calculateScores();
        });
    });

    return weekEntry;
}

// Show all hidden entries when "Show all dates" is clicked
document.getElementById('show-all-dates').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.week-entry').forEach(entry => {
        entry.style.display = 'block';
        const week = entry.id.replace('entry-', '');
        localStorage.removeItem(`${week}-hidden`);
    });
});

// Collapse all date content when "Collapse all dates" is clicked
document.getElementById('collapse-all-dates').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.week-entry').forEach(entry => {
        const weeklyDetails = entry.querySelector('.weekly-details');
        const triangle = entry.querySelector('.triangle');
        weeklyDetails.style.display = 'none';
        triangle.textContent = '▼';
        entry.classList.add('collapsed');
        const week = entry.id.replace('entry-', '');
        localStorage.setItem(`${week}-collapsed`, true);
    });
});

// Initialize weekly entries
const weeklyEntriesContainer = document.getElementById('weekly-entries');
weeklyData.forEach(({ date, bennyWeight, maggieWeight }) => {
    const entry = createWeeklyEntry(date, bennyWeight, maggieWeight);
    weeklyEntriesContainer.appendChild(entry);
});

loadFromLocalStorage();