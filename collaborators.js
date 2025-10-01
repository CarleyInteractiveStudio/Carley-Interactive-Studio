document.addEventListener('DOMContentLoaded', async () => {
    // --- Supabase Integration ---
    const SUPABASE_URL = 'https://pufujgwkagbpvbkzbeiy.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZnVqZ3drYWdicHZia3piZWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTA1MDksImV4cCI6MjA3NDgyNjUwOX0.cdX3dzjH_KUHQ9SuUjnM6Tvel0LQOY6SnnVz82K1n_E';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const storageUrl = `${SUPABASE_URL}/storage/v1/object/public/media/`;

    const collaboratorsContainer = document.getElementById('collaborators-container');
    if (!collaboratorsContainer) {
        console.error('Collaborators container not found!');
        return;
    }

    const showLoading = () => {
        collaboratorsContainer.innerHTML = '<p>Cargando colaboradores...</p>';
    };

    const showError = (message) => {
        collaboratorsContainer.innerHTML = `<p style="color: #ff6b6b;">Error: ${message}</p>`;
    };

    const renderCollaborators = (collaborators) => {
        collaboratorsContainer.innerHTML = ''; // Clear loading message
        if (!collaborators || collaborators.length === 0) {
            collaboratorsContainer.innerHTML = '<p>Aún no hay colaboradores. ¡Sé el primero en unirte!</p>';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'collaborator-grid';

        collaborators.forEach(collab => {
            const card = document.createElement('div');
            card.className = 'collaborator-card';

            const photoUrl = collab.photo_url ? `${storageUrl}${collab.photo_url}` : 'carley_foto_web/Logo_C.png';

            card.innerHTML = `
                <div class="collaborator-photo">
                    <img src="${photoUrl}" alt="Foto de ${collab.name}">
                </div>
                <div class="collaborator-info">
                    <h3>${collab.name}</h3>
                    <p>${collab.description}</p>
                </div>
            `;
            grid.appendChild(card);
        });
        collaboratorsContainer.appendChild(grid);
    };

    try {
        showLoading();
        const { data, error } = await supabase
            .from('collaborators')
            .select('*')
            .order('name');

        if (error) {
            throw error;
        }

        renderCollaborators(data);

    } catch (error) {
        console.error('Error fetching collaborators:', error);
        showError(error.message);
    }
});