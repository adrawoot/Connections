const allPossibleItems = [
    "Apple", "Banana", "Cucumber", "Dog", "Elephant", "Fig", "Grape", "Horse",
    "Carrot", "Lion", "Melon", "Cat", "Tiger", "Peach", "Strawberry", "Rabbit"
];
const correctGroups = [
    { name: "fruits", items: ["Apple", "Banana", "Fig", "Grape"] },
    { name: "animals", items: ["Dog", "Elephant", "Horse", "Strawberry"] },
    { name: "vegetables", items: ["Carrot", "Cucumber", "Melon", "Peach"] },
    { name: "more_animals", items: ["Cat", "Tiger", "Rabbit", "Lion"] }
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
}

function updateSelections() {
    const itemsDivs = document.querySelectorAll('.item');
    itemsDivs.forEach(div => {
        if (selections.includes(div.textContent)) {
            div.style.background = 'lightgreen';
        } else {
            div.style.background = '#e0e0e0';
        }
    });
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
            if (correctGroupCount === totalGroups) {
                document.getElementById('gameTitle').textContent = "Congratulations, You Won!";
                document.querySelectorAll('button').forEach(button => button.disabled = true);
            }
        } else {
            mistakes++;
            document.getElementById('mistakeCounter').textContent = `Mistakes remaining: ${'●'.repeat(maxMistakes - mistakes)}${'○'.repeat(mistakes)}`;
            if (mistakes >= maxMistakes) {
                document.querySelectorAll('button').forEach(button => button.disabled = true);
            }
        }
    } else {
        document.getElementById('result').textContent = 'Please select exactly four items.';
    }
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
    groupDiv.innerHTML = `<strong>${groupInfo.name.toUpperCase()}</strong>: ${groupInfo.items.join(', ')}`;
    resultsContainer.appendChild(groupDiv);
    resultsContainer.style.display = 'block';
}

function resetGame() {
    selections = [];
    mistakes = 0;
    correctGroupCount = 0;
    document.getElementById('mistakeCounter').textContent = 'Mistakes remaining: ●●●●';
    currentItems = selectRandomItems(16);
    populateItems();
}

function selectRandomItems(count) {
    const shuffled = [...allPossibleItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

window.onload = setupGame;