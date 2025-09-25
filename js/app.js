document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.firestore();

    // Referências do HTML
    const avisosGrid = document.querySelector('.avisos-grid');
    const documentosLista = document.querySelector('.documentos-lista');
    const formSugestao = document.querySelector('#form-sugestao');

    // Função para carregar avisos
    const carregarAvisos = async () => {
        try {
            avisosGrid.innerHTML = 'Carregando avisos...';
            const snapshot = await db.collection('avisos').orderBy('dataPublicacao', 'desc').get();
            avisosGrid.innerHTML = '';

            if (snapshot.empty) {
                avisosGrid.innerHTML = '<p>Nenhum aviso encontrado no momento.</p>';
                return;
            }

            snapshot.forEach(doc => {
                const aviso = doc.data();
                const data = aviso.dataPublicacao.toDate().toLocaleDateString('pt-BR');
                const avisoCard = document.createElement('article');
                avisoCard.className = 'aviso-card';
                avisoCard.innerHTML = `
                    <h3>${aviso.titulo}</h3>
                    <p>${aviso.mensagem}</p>
                    <span>Publicado em: ${data}</span>
                `;
                avisosGrid.appendChild(avisoCard);
            });
        } catch (error) {
            console.error("Erro ao carregar avisos: ", error);
            avisosGrid.innerHTML = '<p>Ocorreu um erro ao carregar os avisos.</p>';
        }
    };

    // Função para carregar documentos
    const carregarDocumentos = async () => {
        try {
            documentosLista.innerHTML = '<li>Carregando documentos...</li>';
            const snapshot = await db.collection('documentos').orderBy('dataPublicacao', 'desc').get();
            documentosLista.innerHTML = '';

            if (snapshot.empty) {
                documentosLista.innerHTML = '<li>Nenhum documento disponível no momento.</li>';
                return;
            }

            snapshot.forEach(doc => {
                const docData = doc.data();
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="${docData.url}" target="_blank" rel="noopener noreferrer">${docData.titulo}</a>
                    <span class="documento-meta">Disponibilizado em: ${docData.dataPublicacao.toDate().toLocaleDateString('pt-BR')}</span>
                `;
                documentosLista.appendChild(li);
            });
        } catch (error) {
            console.error("Erro ao carregar documentos:", error);
            documentosLista.innerHTML = '<li>Erro ao carregar documentos.</li>';
        }
    };

    // Lógica do formulário de sugestão
    formSugestao.addEventListener('submit', async (event) => {
        event.preventDefault();
        const identificacao = document.querySelector('#identificacao').value;
        const sugestaoTexto = document.querySelector('#sugestao-texto').value;

        if (!sugestaoTexto.trim()) {
            return alert('Por favor, escreva sua sugestão antes de enviar.');
        }

        try {
            await db.collection('sugestoes').add({
                identificacao: identificacao || 'Anônimo',
                sugestao: sugestaoTexto,
                dataEnvio: new Date()
            });
            alert('Sugestão enviada com sucesso! Obrigado.');
            formSugestao.reset();
        } catch (error) {
            console.error("Erro ao enviar sugestão: ", error);
            alert('Ocorreu um erro ao enviar sua sugestão.');
        }
    });
    
    // Inicia o carregamento de tudo
    carregarAvisos();
    carregarDocumentos();
});