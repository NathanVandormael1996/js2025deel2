
export function createUserCard(user) {
    const label = user.getLabel();
    return `
<li class="list-group-item d-flex justify-content-between align-items-center">
    <span>${label}</span>
    <span class="badge bg-primary rounded-pill">Gebruiker</span>
</li>
    `;
}