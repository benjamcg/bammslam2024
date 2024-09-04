// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCstkXE_zP6mqmgvMd2uUW0AyCNXEsbnmo",
  authDomain: "bamm-slam.firebaseapp.com",
  databaseURL: "https://bamm-slam-default-rtdb.firebaseio.com",
  projectId: "bamm-slam",
  storageBucket: "bamm-slam.appspot.com",
  messagingSenderId: "254712095917",
  appId: "1:254712095917:web:6a5156c610fad0c5621224"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Basic score variables
let bennyScore = 0;
let maggieScore = 0;

// DOM Elements
const weeklyEntriesContainer = document.getElementById('weekly-entries');
const bennyScoreElement = document.getElementById('benny-score');
const maggieScoreElement = document.getElementById('maggie-score');
const totalScoreElement = document.getElementById('total-score');
const bennyBox = document.getElementById('benny-box');
const maggieBox = document.getElementById('maggie-box');

// Weekly data for dates and weights
const weeklyData = [
    { date: "September 08, 2024", bennyWeight: 171.85, maggieWeight: 134 },
    { date: "September 15, 2024", bennyWeight: 170.70, maggieWeight: 133 },
    { date: "September 22, 2024", bennyWeight: 169.55, maggieWeight: 132 },
    { date: "September 29, 2024", bennyWeight: 168.40, maggieWeight: 131 },
];

// Function to calculate scores dynamically
function calculateScores() {
    bennyScore = 0;
    maggieScore = 0;

    // Iterate over each weekly entry and update the scores
    weeklyEntriesContainer.querySelectorAll('.week-entry').forEach(entry => {
        const bennyCheckboxes = entry.querySelectorAll('input[name*="benny"]');
        const maggieCheckboxes = entry.querySelectorAll('input[name*="maggie"]');

        // Benny's checkboxes
        bennyCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                bennyScore += 5;
            }
        });

        // Maggie's checkboxes
        maggieCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                maggieScore += 5;
            }
        });
    });

    // Update the scores on the page
    bennyScoreElement.textContent = `$${bennyScore}`;
    maggieScoreElement.textContent = `$${maggieScore}`;
    totalScoreElement.textContent = `$${bennyScore + maggieScore}`;

    // Update colors based on score comparison
    if (bennyScore > maggieScore) {
        bennyBox.style.backgroundColor = 'yellow';
        maggieBox.style.backgroundColor = 'lightgrey';
    } else if (maggieScore > bennyScore) {
        maggieBox.style.backgroundColor = 'yellow';
        bennyBox.style.backgroundColor = 'lightgrey';
    } else {
        // If scores are equal, set both to pastel green
        bennyBox.style.backgroundColor = 'lightgreen';
        maggieBox.style.backgroundColor = 'lightgreen';
    }
}

// Function to update checkbox states in Firebase
function updateCheckboxState(week, name, checked) {
    const checkboxPath = `checkboxes/${week}/${name}`;
    database.ref(checkboxPath).set(checked);
}

// Function to create a weekly entry
function createWeeklyEntry(week, bennyWeight, maggieWeight) {
    const weekEntry = document.createElement('div');
    weekEntry.classList.add('week-entry');
    
    const dateHeader = document.createElement('div');
    dateHeader.classList.add('date-header');
    dateHeader.textContent = week;

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

    // Add event listeners to the checkboxes to recalculate scores when they change
    weeklyDetails.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            calculateScores();
            updateCheckboxState(week, checkbox.name, checkbox.checked);
        });
    });

    weekEntry.appendChild(dateHeader);
    weekEntry.appendChild(weeklyDetails);

    return weekEntry;
}

// Load the weekly entries into the DOM
weeklyData.forEach(({ date, bennyWeight, maggieWeight }) => {
    const entry = createWeeklyEntry(date, bennyWeight, maggieWeight);
    weeklyEntriesContainer.appendChild(entry);

    // Fetch stored checkbox states from Firebase and update UI
    const checkboxPath = `checkboxes/${date}`;
    database.ref(checkboxPath).once('value', snapshot => {
        const checkboxStates = snapshot.val();
        if (checkboxStates) {
            Object.keys(checkboxStates).forEach(key => {
                const checkbox = document.querySelector(`input[name="${key}"]`);
                if (checkbox) {
                    checkbox.checked = checkboxStates[key];
                }
            });
            calculateScores(); // Recalculate scores after restoring states
        }
    });
});

// Initialize scores on load
calculateScores();