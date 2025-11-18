// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'

// eigen js
import User from './userModel.js';
import { createUserCard } from './userCard.js';

const nameInput = document.getElementById('ex4_name');
const ageInput = document.getElementById('ex4_age');
const addButton = document.getElementById('ex4_btn');
const statusDiv = document.getElementById('ex4_status');
const userList = document.getElementById('ex4_list');

const users = [];

function validateInput(name, ageNum) {
    if (!name) {
        return "Naam mag niet leeg zijn.";
    }
    if (isNaN(ageNum)) {
        return "Leeftijd moet een geldig nummer zijn.";
    }
    if (ageNum <= 0) {
        return "Leeftijd moet een positief getal zijn en boven 0.";
    }
    return null;
}

function renderUsers() {
    const userHtml = users.map(user => createUserCard(user)).join('');
    userList.innerHTML = userHtml;

    if (users.length === 0) {
        statusDiv.textContent = "Nog geen gebruikers toegevoegd.";
        statusDiv.className = "alert alert-secondary mb-3";
    } else {
        statusDiv.textContent = `${users.length} gebruiker(s) in de lijst.`;
        statusDiv.className = "alert alert-success mb-3";
    }
}
function handleAddUser() {
    const rawName = nameInput.value.trim();
    const rawAge = Number(ageInput.value.trim());

    const error = validateInput(rawName, rawAge);

    if (error) {
        statusDiv.textContent = `Fout: ${error}`;
        statusDiv.className = "alert alert-danger mb-3";
        return;
    }

    const newUser = new User(rawName, rawAge);
    users.push(newUser);

    renderUsers();

    nameInput.value = '';
    ageInput.value = '';
    nameInput.focus();
}

addButton.addEventListener('click', handleAddUser);

renderUsers();