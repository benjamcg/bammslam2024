// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCstkXE_zP6mqmgvMd2uUW0AyCNXEsbnmo",
  authDomain: "bamm-slam.firebaseapp.com",
  databaseURL: "https://bamm-slam-default-rtdb.firebaseio.com/",
  projectId: "bamm-slam",
  storageBucket: "bamm-slam.appspot.com",
  messagingSenderId: "254712095917",
  appId: "1:254712095917:web:6a5156c610fad0c5621224",
  measurementId: "G-STYFKBJ67N"
};

// Initialize Firebase App
firebase.initializeApp(firebaseConfig);

// Initialize Analytics (optional)
firebase.analytics();

// Initialize Realtime Database
const database = firebase.database();

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
    document.getElementById('benny-score').textContent = `$${bennyScore}`;
    document.getElementById('maggie-score').textContent = `$${maggieScore}`;

    const totalScore = bennyScore + maggieScore;
    document.getElementById('total-score').textContent = `$${totalScore}`;

    // Save scores to Firebase
    database.ref('scores').set({
        bennyScore,
        maggieScore,
        totalScore
    });
}

// Load saved data from Firebase
function loadFromFirebase() {
    database.ref('scores').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            bennyScore = data.bennyScore || 0;
            maggieScore = data.maggieScore || 0;
            document.getElementById('benny-score').textContent = `$${bennyScore}`;
            document.getElementById('maggie-score').textContent = `$${maggieScore}`;
            document.getElementById('total-score').textContent = `$${data.totalScore || 0}`;
        }
    });

    // Load checked boxes
    weeklyData.forEach(({ date }) => {
        ['benny', 'maggie'].forEach(person => {
            ['weight', 'protein', 'carbs'].forEach(metric => {
                database.ref(`checkboxes/${date}/${person}/${metric}`).on('value', (snapshot) => {
                    const checkbox = document.querySelector(`input[name="${date}-${person}-${metric}"]`);
                    if (checkbox) {
                        checkbox.checked = snapshot.val() === true;
                    }
                });
            });
        });
    });
}

function handleCheckboxChange(checkbox, date, person, metric) {
    const isChecked = checkbox.checked;
    database.ref(`checkboxes/${date}/${person}/${metric}`).set(isChecked);
    calculateScores();
}

// Set up weekly entries and attach event listeners for checkbox changes
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

    // Event listener for checkbox changes
    weeklyDetails.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        const [_, person, metric] = checkbox.name.split('-');
        checkbox.addEventListener('change', () => handleCheckboxChange(checkbox, week, person, metric));
    });

    return weekEntry;
}

// Initialize weekly entries and load from Firebase
const weeklyEntriesContainer = document.getElementById('weekly-entries');
weeklyData.forEach(({ date, bennyWeight, maggieWeight }) => {
    const entry = createWeeklyEntry(date, bennyWeight, maggieWeight);
    weeklyEntriesContainer.appendChild(entry);
});

loadFromFirebase();