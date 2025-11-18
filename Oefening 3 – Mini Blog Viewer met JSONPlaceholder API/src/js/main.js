// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'

//eigen js
document.addEventListener('DOMContentLoaded', () => {
    const postIdInput = document.getElementById('ex3_post_id');
    const loadButton = document.getElementById('ex3_btn');
    const statusDiv = document.getElementById('ex3_status');
    const postCard = document.getElementById('ex3_post_card');
    const postTitle = document.getElementById('ex3_title');
    const postBody = document.getElementById('ex3_body');
    const commentsCard = document.getElementById('ex3_comments_card');
    const commentsList = document.getElementById('ex3_comments_list');
    const commentsEmpty = document.getElementById('ex3_comments_empty');

    // API-basis URL
    const BASE_URL = 'https://jsonplaceholder.typicode.com';

    /**
     * Stelt de statusmelding in de UI in.
     * @param {string} message - De tekst van de melding.
     * @param {string} type - De alert-klasse (bijv. 'secondary', 'warning', 'success', 'danger').
     */
    function setStatus(message, type = 'secondary') {
        // Reset alle alert-klassen en stel de nieuwe in
        statusDiv.className = `alert alert-${type} mb-3`;
        statusDiv.textContent = message;
    }

    /**
     * Verbergt de post- en commentaarsecties.
     */
    function hideSections() {
        postCard.classList.add('d-none');
        commentsCard.classList.add('d-none');
        commentsList.innerHTML = ''; // Maak de lijst leeg
        commentsEmpty.classList.remove('d-none'); // Toon 'Nog geen comments'
    }

    /**
     * Haalt een blogpost op via de API.
     * @param {number} id - De ID van de post.
     * @returns {Promise<Object>} - De postgegevens.
     */
    async function fetchPost(id) {
        const response = await fetch(`${BASE_URL}/posts/${id}`);
        if (!response.ok) {
            // Gooi een error als de status geen 2xx is (bijv. 404)
            throw new Error(`Post met ID ${id} niet gevonden (Status: ${response.status})`);
        }
        return response.json();
    }

    /**
     * Haalt de comments voor een post op via de API.
     * @param {number} postId - De ID van de post.
     * @returns {Promise<Array<Object>>} - De lijst met comments.
     */
    async function fetchComments(postId) {
        const response = await fetch(`${BASE_URL}/comments?postId=${postId}`);
        if (!response.ok) {
            throw new Error(`Fout bij het ophalen van comments (Status: ${response.status})`);
        }
        return response.json();
    }

    /**
     * Toont de postgegevens in de UI.
     * @param {Object} post - Het postobject.
     */
    function displayPost(post) {
        postTitle.textContent = post.title;
        postBody.textContent = post.body;
        postCard.classList.remove('d-none');
    }

    /**
     * Toont de comments in de UI.
     * @param {Array<Object>} comments - De lijst met commentobjecten.
     */
    function displayComments(comments) {
        commentsList.innerHTML = ''; // Zorg ervoor dat de lijst leeg is
        commentsCard.classList.remove('d-none');

        if (comments.length === 0) {
            commentsEmpty.classList.remove('d-none');
            return;
        }

        commentsEmpty.classList.add('d-none'); // Verberg de 'Geen comments' melding

        comments.forEach(comment => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            // Gebruik Markdown/HTML in de li voor de opmaak
            li.innerHTML = `
                <p class="mb-1"><strong>${comment.name}</strong> (${comment.email})</p>
                <p class="mb-0 small">${comment.body}</p>
            `;
            commentsList.appendChild(li);
        });
    }

    /**
     * De hoofdfunctie die wordt uitgevoerd bij het klikken op de knop.
     */
    async function loadPostAndComments() {
        const postIdValue = postIdInput.value.trim();
        const postId = parseInt(postIdValue, 10);

        // 1. Validatie
        if (!postIdValue || isNaN(postId) || postId < 1) {
            setStatus('❌ Gelieve een geldig Post ID (een getal groter dan 0) in te vullen.', 'danger');
            hideSections();
            return;
        }

        // Reset UI en toon laadstatus
        hideSections();
        setStatus('🟡 Bezig met laden van post en comments...', 'warning');

        try {
            // Gebruik Promise.all om de post en de comments tegelijkertijd op te halen
            // dit maakt de applicatie sneller!
            const [post, comments] = await Promise.all([
                fetchPost(postId),
                fetchComments(postId)
            ]);

            // 3. Toon Post
            displayPost(post);

            // 4. Toon Comments
            displayComments(comments);

            // 5. Succesmelding
            setStatus(`✅ Post #${postId} en ${comments.length} comments succesvol geladen!`, 'success');

        } catch (error) {
            // Vang fouten op van zowel fetchPost als fetchComments
            console.error('Laadfout:', error);
            setStatus(`🔴 Fout bij het laden: ${error.message}`, 'danger');
            hideSections(); // Zorg ervoor dat bij fout de secties verborgen zijn
        }
    }

    // Event Listener voor de knop
    loadButton.addEventListener('click', loadPostAndComments);
});