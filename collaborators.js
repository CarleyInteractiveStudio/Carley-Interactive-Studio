document.addEventListener('DOMContentLoaded', async () => {
    // Check if the global Supabase client from supabase-config.js exists
    if (typeof window.supabaseClient === 'undefined') {
        console.error('Supabase client not found. Make sure supabase-config.js is loaded correctly before this script.');
        return;
    }
    const supabase = window.supabaseClient;

    // Use the global SUPABASE_URL constant for constructing media paths
    const storageUrl = `${window.SUPABASE_URL}/storage/v1/object/public/media/`;

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