document.addEventListener('DOMContentLoaded', function () {
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
        { date: "September 08, 2024", bennyWeight: 171.9, maggieWeight: 128.3 },
        { date: "September 15, 2024", bennyWeight: 170.7, maggieWeight: 127.6 },
        { date: "September 22, 2024", bennyWeight: 169.6, maggieWeight: 126.9 },
        { date: "September 29, 2024", bennyWeight: 168.4, maggieWeight: 126.2 },
        { date: "October 06, 2024", bennyWeight: 167.3, maggieWeight: 125.5 },
        { date: "October 13, 2024", bennyWeight: 166.1, maggieWeight: 124.8 },
        { date: "October 20, 2024", bennyWeight: 165, maggieWeight: 124.1 },
        { date: "October 27, 2024", bennyWeight: 163.8, maggieWeight: 123.4 },
        { date: "November 03, 2024", bennyWeight: 162.7, maggieWeight: 122.7 },
        { date: "November 10, 2024", bennyWeight: 161.5, maggieWeight: 122 },
        { date: "November 17, 2024", bennyWeight: 160.4, maggieWeight: 121.3 },
        { date: "November 24, 2024", bennyWeight: 159.2, maggieWeight: 120.6 },
        { date: "December 01, 2024", bennyWeight: 158.1, maggieWeight: 119.9 },
        { date: "December 08, 2024", bennyWeight: 156.9, maggieWeight: 119.2 },
        { date: "December 15, 2024", bennyWeight: 155.8, maggieWeight: 118.5 },
        { date: "December 22, 2024", bennyWeight: 154.6, maggieWeight: 117.8 },
        { date: "December 29, 2024", bennyWeight: 153.5, maggieWeight: 117.1 },
        { date: "January 05, 2025", bennyWeight: 152.3, maggieWeight: 116.4 },
        { date: "January 12, 2025", bennyWeight: 151.2, maggieWeight: 115.7 },
        { date: "January 19, 2025", bennyWeight: 150, maggieWeight: 115 }
    ];

    // Function to calculate scores dynamically
    function calculateScores() {
        bennyScore = 0;
        maggieScore = 0;

        weeklyEntriesContainer.querySelectorAll('.week-entry').forEach(entry => {
            const bennyCheckboxes = entry.querySelectorAll('input[name*="benny"]');
            const maggieCheckboxes = entry.querySelectorAll('input[name*="maggie"]');

            bennyCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    bennyScore += 5;
                }
            });

            maggieCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    maggieScore += 5;
                }
            });
        });

        bennyScoreElement.textContent = `$${bennyScore}`;
        maggieScoreElement.textContent = `$${maggieScore}`;
        totalScoreElement.textContent = `$${bennyScore + maggieScore}`;

        if (bennyScore > maggieScore) {
            bennyBox.style.backgroundColor = 'yellow';
            maggieBox.style.backgroundColor = 'lightgrey';
        } else if (maggieScore > bennyScore) {
            maggieBox.style.backgroundColor = 'yellow';
            bennyBox.style.backgroundColor = 'lightgrey';
        } else {
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
        dateHeader.innerHTML = `${week}`;

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
                calculateScores();
            }
        });
    });

    calculateScores();
});