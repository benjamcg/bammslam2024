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

function updateScores() {
    const bennyBox = document.getElementById('benny-box');
    const maggieBox = document.getElementById('maggie-box');
    
    document.getElementById('benny-score').textContent = `$${bennyScore}`;
    document.getElementById('maggie-score').textContent = `$${maggieScore}`;

    if (bennyScore > maggieScore) {
        bennyBox.style.backgroundColor = 'lightyellow';
        maggieBox.style.backgroundColor = '#f0f0f0';
    } else if (maggieScore > bennyScore) {
        maggieBox.style.backgroundColor = 'lightyellow';
        bennyBox.style.backgroundColor = '#f0f0f0';
    } else {
        bennyBox.style.backgroundColor = 'lightgreen';
        maggieBox.style.backgroundColor = 'lightgreen';
    }
}

function createWeeklyEntry(week, bennyWeight, maggieWeight) {
    const weekEntry = document.createElement('div');
    weekEntry.classList.add('week-entry');

    const dateHeader = document.createElement('div');
    dateHeader.classList.add('date-header');
    dateHeader.innerHTML = `
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
                <div class="radio-group">
                    <label>Weight Reached: <input type="radio" name="${week}-maggie-weight" value="yes" /> Yes <input type="radio" name="${week}-maggie-weight" value="no" /> No</label>
                    <label>Protein ≥ 30%: <input type="radio" name="${week}-maggie-protein" value="yes" /> Yes <input type="radio" name="${week}-maggie-protein" value="no" /> No</label>
                    <label>Carbs ≤ 30%: <input type="radio" name="${week}-maggie-carbs" value="yes" /> Yes <input type="radio" name="${week}-maggie-carbs" value="no" /> No</label>
                </div>
            </div>
            <div class="vertical-line"></div>
            <div class="weekly-column">
                <strong>Benny</strong>
                <p>Goal: ${bennyWeight} lbs</p>
                <div class="radio-group">
                    <label>Weight Reached: <input type="radio" name="${week}-benny-weight" value="yes" /> Yes <input type="radio" name="${week}-benny-weight" value="no" /> No</label>
                    <label>Protein ≥ 30%: <input type="radio" name="${week}-benny-protein" value="yes" /> Yes <input type="radio" name="${week}-benny-protein" value="no" /> No</label>
                    <label>Carbs ≤ 30%: <input type="radio" name="${week}-benny-carbs" value="yes" /> Yes <input type="radio" name="${week}-benny-carbs" value="no" /> No</label>
                </div>
            </div>
        </div>
    `;

    weekEntry.appendChild(dateHeader);
    weekEntry.appendChild(weeklyDetails);

    // Collapse/Expand functionality
    dateHeader.addEventListener('click', () => {
        weekEntry.classList.toggle('collapsed');
    });

    // Add scoring logic for radio buttons
    weeklyDetails.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const [_, person, metric] = e.target.name.split('-');
            if (person === 'benny') {
                if (e.target.value === 'yes') bennyScore += 5;
                else bennyScore -= 5;
            } else {
                if (e.target.value === 'yes') maggieScore += 5;
                else maggieScore -= 5;
            }
            updateScores();
        });
    });

    return weekEntry;
}

// Initialize weekly entries
const weeklyEntriesContainer = document.getElementById('weekly-entries');
weeklyData.forEach(({ date, bennyWeight, maggieWeight }) => {
    const entry = createWeeklyEntry(date, bennyWeight, maggieWeight);
    weeklyEntriesContainer.appendChild(entry);
});

// Initialize scores
updateScores();