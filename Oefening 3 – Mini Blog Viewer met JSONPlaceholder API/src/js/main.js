// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'

//eigen js

const UI = {
    postIdInput: document.getElementById('ex3_post_id'),
    loadButton: document.getElementById('ex3_btn'),
    status: document.getElementById('ex3_status'),
    postCard: document.getElementById('ex3_post_card'),
    postTitle: document.getElementById('ex3_title'),
    postBody: document.getElementById('ex3_body'),
    commentsCard: document.getElementById('ex3_comments_card'),
    commentsList: document.getElementById('ex3_comments_list'),
    commentsEmpty: document.getElementById('ex3_comments_empty')
};

const BASE = 'https://jsonplaceholder.typicode.com';

function setStatus(message, type = 'secondary') {
    UI.status.className = `alert alert-${type} mb-3`;
    UI.status.textContent = message;
}

function resetView() {
    UI.postCard.classList.add('d-none');
    UI.commentsCard.classList.add('d-none');
    UI.commentsList.innerHTML = '';
    UI.commentsEmpty.classList.remove('d-none');
}

function showPost(post) {
    UI.postTitle.textContent = post.title;
    UI.postBody.textContent = post.body;
    UI.postCard.classList.remove('d-none');
}

function showComments(comments) {
    UI.commentsList.innerHTML = '';
    UI.commentsCard.classList.remove('d-none');

    if (comments.length === 0) {
        UI.commentsEmpty.classList.remove('d-none');
        return;
    }

    UI.commentsEmpty.classList.add('d-none');

    const frag = document.createDocumentFragment();

    for (const c of comments) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <p class="mb-1"><strong>${c.name}</strong> (${c.email})</p>
            <p class="mb-0 small">${c.body}</p>
        `;
        frag.appendChild(li);
    }

    UI.commentsList.appendChild(frag);
}

async function fetchJSON(url, errorMsg) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${errorMsg} (status ${res.status})`);
    return res.json();
}

async function getPost(id) {
    return fetchJSON(`${BASE}/posts/${id}`, `Post met ID ${id} niet gevonden`);
}

async function getComments(id) {
    return fetchJSON(`${BASE}/comments?postId=${id}`, `Comments konden niet geladen worden`);
}

// ------------------------------------
// Main controller
// ------------------------------------
async function loadPostAndComments() {
    const raw = UI.postIdInput.value.trim();
    const postId = Number(raw);

    if (!raw || !Number.isInteger(postId) || postId < 1) {
        setStatus('❌ Gelieve een geldig post ID in te vullen.', 'danger');
        resetView();
        return;
    }

    resetView();
    setStatus('🟡 Bezig met laden...', 'warning');

    try {
        const [post, comments] = await Promise.all([
            getPost(postId),
            getComments(postId)
        ]);

        showPost(post);
        showComments(comments);

        setStatus(`✅ Post #${postId} succesvol geladen! (${comments.length} comments)`, 'success');
    } catch (err) {
        console.error(err);
        setStatus(`🔴 Fout: ${err.message}`, 'danger');
        resetView();
    }
}

UI.loadButton.addEventListener('click', loadPostAndComments);
