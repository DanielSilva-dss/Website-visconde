document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- ESTADO E REFERÊNCIAS ---
    let modoEdicaoAviso = false, idEdicaoAviso = null;
    let modoEdicaoDoc = false, idEdicaoDoc = null;
    
    const logoutButton = document.querySelector('#logout-button');
    // Avisos
    const formAviso = document.querySelector('#form-aviso'), avisoTituloInput = document.querySelector('#aviso-titulo'), avisoMensagemInput = document.querySelector('#aviso-mensagem'), listaAvisosDiv = document.querySelector('#lista-avisos'), formAvisoButton = formAviso.querySelector('button');
    // Documentos
    const formDocumento = document.querySelector('#form-documento'), docTituloInput = document.querySelector('#documento-titulo'), docUrlInput = document.querySelector('#documento-url'), listaDocumentosAdminDiv = document.querySelector('#lista-documentos-admin'), formDocButton = formDocumento.querySelector('button');
    // Sugestões
    const listaSugestoesDiv = document.querySelector('#lista-sugestoes');

    // --- AUTENTICAÇÃO ---
    auth.onAuthStateChanged((user) => {
        if (user) {
            renderAvisos();
            renderSugestoes();
            renderDocumentosAdmin();
        } else { window.location.href = 'login.html'; }
    });
    logoutButton.addEventListener('click', () => auth.signOut().then(() => alert('Você saiu.')));

    // --- CRUD DE AVISOS ---
    formAviso.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titulo = avisoTituloInput.value, mensagem = avisoMensagemInput.value;
        if (!titulo || !mensagem) return alert('Preencha todos os campos do aviso.');
        try {
            if (modoEdicaoAviso) await db.collection('avisos').doc(idEdicaoAviso).update({ titulo, mensagem });
            else await db.collection('avisos').add({ titulo, mensagem, dataPublicacao: new Date() });
            resetarFormularioAviso();
            renderAvisos();
        } catch (error) { console.error("Erro ao salvar aviso:", error); }
    });
    const renderAvisos = async () => {
        listaAvisosDiv.innerHTML = 'Carregando...';
        const snapshot = await db.collection('avisos').orderBy('dataPublicacao', 'desc').get();
        listaAvisosDiv.innerHTML = '';
        snapshot.forEach(doc => {
            const aviso = doc.data();
            const el = document.createElement('div'); el.className = 'aviso-item';
            el.innerHTML = `<h4>${aviso.titulo}</h4><p>${aviso.mensagem}</p><small>Publicado em: ${aviso.dataPublicacao.toDate().toLocaleDateString('pt-BR')}</small><div class="botoes-admin"><button class="edit-button" data-id="${doc.id}">Editar</button><button class="delete-button" data-id="${doc.id}">Excluir</button></div>`;
            listaAvisosDiv.appendChild(el);
        });
    };
    listaAvisosDiv.addEventListener('click', async (e) => {
        const target = e.target, id = target.dataset.id; if (!id) return;
        if (target.classList.contains('delete-button') && confirm('Excluir este aviso?')) await db.collection('avisos').doc(id).delete().then(renderAvisos);
        if (target.classList.contains('edit-button')) {
            const doc = await db.collection('avisos').doc(id).get(), aviso = doc.data();
            avisoTituloInput.value = aviso.titulo; avisoMensagemInput.value = aviso.mensagem;
            formAvisoButton.textContent = 'Salvar Alterações'; modoEdicaoAviso = true; idEdicaoAviso = id;
            formAviso.scrollIntoView({ behavior: 'smooth' });
        }
    });
    const resetarFormularioAviso = () => { formAviso.reset(); modoEdicaoAviso = false; idEdicaoAviso = null; formAvisoButton.textContent = 'Publicar Aviso'; };

    // --- CRUD DE DOCUMENTOS ---
    formDocumento.addEventListener('submit', async (e) => {
        e.preventDefault();
        const titulo = docTituloInput.value, url = docUrlInput.value;
        if (!titulo || !url) return alert('Preencha todos os campos do documento.');
        try {
            if (modoEdicaoDoc) await db.collection('documentos').doc(idEdicaoDoc).update({ titulo, url });
            else await db.collection('documentos').add({ titulo, url, dataPublicacao: new Date() });
            resetarFormularioDoc();
            renderDocumentosAdmin();
        } catch (error) { console.error("Erro ao salvar documento:", error); }
    });
    const renderDocumentosAdmin = async () => {
        listaDocumentosAdminDiv.innerHTML = 'Carregando...';
        const snapshot = await db.collection('documentos').orderBy('dataPublicacao', 'desc').get();
        listaDocumentosAdminDiv.innerHTML = '';
        snapshot.forEach(doc => {
            const docData = doc.data();
            const el = document.createElement('div'); el.className = 'aviso-item';
            el.innerHTML = `<h4>${docData.titulo}</h4><p><a href="${docData.url}" target="_blank" rel="noopener noreferrer">Ver Documento</a></p><div class="botoes-admin"><button class="edit-doc-button" data-id="${doc.id}">Editar</button><button class="delete-doc-button" data-id="${doc.id}">Excluir</button></div>`;
            listaDocumentosAdminDiv.appendChild(el);
        });
    };
    listaDocumentosAdminDiv.addEventListener('click', async (e) => {
        const target = e.target, id = target.dataset.id; if (!id) return;
        if (target.classList.contains('delete-doc-button') && confirm('Excluir este documento?')) await db.collection('documentos').doc(id).delete().then(renderDocumentosAdmin);
        if (target.classList.contains('edit-doc-button')) {
            const doc = await db.collection('documentos').doc(id).get(), docData = doc.data();
            docTituloInput.value = docData.titulo; docUrlInput.value = docData.url;
            formDocButton.textContent = 'Salvar Alterações'; modoEdicaoDoc = true; idEdicaoDoc = id;
            formDocumento.scrollIntoView({ behavior: 'smooth' });
        }
    });
    const resetarFormularioDoc = () => { formDocumento.reset(); modoEdicaoDoc = false; idEdicaoDoc = null; formDocButton.textContent = 'Publicar Documento'; };

    // --- GERENCIAMENTO DE SUGESTÕES ---
    const renderSugestoes = async () => {
        listaSugestoesDiv.innerHTML = 'Carregando...';
        const snapshot = await db.collection('sugestoes').orderBy('dataEnvio', 'desc').get();
        listaSugestoesDiv.innerHTML = '';
        if (snapshot.empty) { listaSugestoesDiv.innerHTML = '<p>Nenhuma sugestão recebida.</p>'; return; }
        snapshot.forEach(doc => {
            const sugestao = doc.data();
            const el = document.createElement('div'); el.className = 'sugestao-item aviso-item';
            el.innerHTML = `<p><strong>De:</strong> ${sugestao.identificacao}</p><p>"${sugestao.sugestao}"</p><small>Enviado em: ${sugestao.dataEnvio.toDate().toLocaleString('pt-BR')}</small><div class="botoes-admin"><button class="delete-sugestao-button" data-id="${doc.id}">Excluir</button></div>`;
            listaSugestoesDiv.appendChild(el);
        });
    };
    listaSugestoesDiv.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-sugestao-button') && confirm('Excluir esta sugestão?')) {
            await db.collection('sugestoes').doc(e.target.dataset.id).delete().then(renderSugestoes);
        }
    });
});