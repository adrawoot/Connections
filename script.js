const allPossibleItems = [
    "Apple", "Banana", "Fig", "Grape", "Bull", "Crab", "Scales", "Twins", "Clef", "Note", "Rest", "Staff", "Cup", "Medal", "Trophy", "Ribbon"
];
const correctGroups = [
    { name: "Fruits", items: ["Apple", "Banana", "Fig", "Grape"] },
    { name: "Zodiac", items: ["Bull", "Crab", "Scales", "Twins"] },
    { name: "Music", items: ["Clef", "Note", "Rest", "Staff"] },
    { name: "Awards", items: ["Cup", "Medal","Trophy", "Ribbon"] }
];
let currentItems = [];
let selections = [];
let mistakes = 0;
const maxMistakes = 4;
let correctGroupCount = 0;
const totalGroups = 4;

function setupGame() {
    resetGame();
}

function populateItems() {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';
    currentItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = item;
        itemElement.className = 'item';
        itemElement.onclick = () => toggleSelection(item);
        container.appendChild(itemElement);
    });
}

function toggleSelection(item) {
    const index = selections.indexOf(item);
    if (index > -1) {
        selections.splice(index, 1);
    } else {
        if (selections.length < 4) {
            selections.push(item);
        }
    }
    updateSelections();
    checkSelectionCount(); // Check selection count after updating selections
}

function updateSelections() {
    const itemsDivs = document.querySelectorAll('.item');
    itemsDivs.forEach(div => {
        if (selections.includes(div.textContent)) {
            div.style.background = '#5A594F';
            div.style.color = '#FFFFFF';
        } else {
            div.style.background = '#EFEFE7';
            div.style.color = '#000000';
        }
    });
}

function checkSelectionCount() {
    // Display a message if the number of selected items is not exactly four
    if (selections.length !== 4) {
        document.getElementById('result').textContent = 'Please select exactly four items.';
    } else {
        document.getElementById('result').textContent = ''; // Clear message when four items are selected
    }
}

let successfullyIdentifiedGroups = [];

function enableButtons() {
    document.querySelectorAll('button').forEach(button => button.disabled = false);
}

function submitAnswer() {
    if (selections.length === 4) {
        const groupInfo = checkGroupCorrect(selections);
        if (groupInfo) {
            displayCorrectGroup(groupInfo);
            currentItems = currentItems.filter(item => !selections.includes(item));
            selections = [];
            populateItems();
            correctGroupCount++;
            successfullyIdentifiedGroups.push(groupInfo.name);
            if (correctGroupCount === totalGroups) {
                document.getElementById('gameTitle').textContent = "Congratulations, You Won!";
                document.querySelectorAll('button').forEach(button => button.disabled = false); 
            }
        } else {
            mistakes++;
            document.getElementById('mistakeCounter').textContent = `Mistakes remaining: ${'●'.repeat(maxMistakes - mistakes)}${'○'.repeat(mistakes)}`;
            document.getElementById('result').textContent = 'Wrong, Try Again';
            if (mistakes >= maxMistakes) {
                document.getElementById('gameTitle').textContent = "Next Time! Reset to Try Again";
                displayRemainingCorrectGroups();
                document.querySelectorAll('button').forEach(button => button.disabled = false); 
            }
        }
    } else {
        document.getElementById('result').textContent = 'Please select exactly four items.';
    }
}

// Function to display the remaining correct groups not already successfully identified
function displayRemainingCorrectGroups() {
    correctGroups.forEach(group => {
        if (!successfullyIdentifiedGroups.includes(group.name)) {
            displayCorrectGroup(group);
        }
    });
}

function checkGroupCorrect(selection) {
    return correctGroups.find(group =>
        group.items.length === selection.length &&
        group.items.every(item => selection.includes(item))
    );
}

function displayCorrectGroup(groupInfo) {
    const resultsContainer = document.getElementById('resultsContainer');
    const groupDiv = document.createElement('div');
    groupDiv.className = 'group ' + groupInfo.name.replace(/\s+/g, '_').toLowerCase();
    groupDiv.innerHTML = `<strong>${groupInfo.name.toUpperCase()}:</strong> ${groupInfo.items.join(', ')}`;
    resultsContainer.appendChild(groupDiv);
    resultsContainer.style.display = 'block';
}

function resetGame() {
    selections = [];
    mistakes = 0;
    correctGroupCount = 0;
    successfullyIdentifiedGroups = []; // Reset the list of successfully identified groups
    document.getElementById('mistakeCounter').textContent = 'Mistakes remaining: ●●●●';
    document.getElementById('gameTitle').textContent = "Create four groups of four!";
    document.getElementById('result').textContent = ''; // Clear any result message
    currentItems = selectRandomItems(16);
    populateItems();
    enableButtons(); // Ensure all buttons are re-enabled
    document.getElementById('resultsContainer').innerHTML = ''; // Clear previous results
    document.getElementById('resultsContainer').style.display = 'none';
}

function selectRandomItems(count) {
    const shuffled = [...allPossibleItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function shuffleItems() {
    currentItems = selectRandomItems(allPossibleItems.length);
    populateItems();
}

function deselectAll() {
    selections = [];
    updateSelections();
    document.getElementById('result').textContent = ''; 
}

window.onload = function(){
    setupGame();
    var currentDate = new Date();
    var formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('date').innerHTML = formattedDate;
}