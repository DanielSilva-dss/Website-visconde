document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- VARIÁVEIS DE ESTADO ---
    let modoEdicao = false;
    let idEdicao = null;

    // --- REFERÊNCIAS AOS ELEMENTOS DO HTML ---
    const logoutButton = document.querySelector('#logout-button');
    const formAviso = document.querySelector('#form-aviso');
    const avisoTituloInput = document.querySelector('#aviso-titulo');
    const avisoMensagemInput = document.querySelector('#aviso-mensagem');
    const listaAvisosDiv = document.querySelector('#lista-avisos');
    const formButton = formAviso.querySelector('button');
    // NOVA REFERÊNCIA PARA A LISTA DE SUGESTÕES
    const listaSugestoesDiv = document.querySelector('#lista-sugestoes');

    // --- LÓGICA DE AUTENTICAÇÃO E LOGOUT ---
    logoutButton.addEventListener('click', () => {
        auth.signOut().then(() => alert('Você saiu da sua conta.'));
    });

    auth.onAuthStateChanged((user) => {
        if (user) {
            // Se o usuário está logado, carregamos TUDO
            renderAvisos();
            renderSugestoes(); // <-- CHAMADA DA NOVA FUNÇÃO
        } else {
            window.location.href = 'login.html';
        }
    });

    // --- FUNÇÕES DE GERENCIAMENTO DE AVISOS (CRUD) ---
    // (Todo o código para criar, renderizar e deletar/editar avisos que já fizemos continua aqui, sem alterações)
    
    // FUNÇÃO PRINCIPAL DO FORMULÁRIO (CRIAR OU ATUALIZAR)
    formAviso.addEventListener('submit', async (event) => {
        event.preventDefault();
        const titulo = avisoTituloInput.value;
        const mensagem = avisoMensagemInput.value;

        if (!titulo || !mensagem) return alert('Por favor, preencha todos os campos.');

        try {
            if (modoEdicao) {
                await db.collection('avisos').doc(idEdicao).update({ titulo, mensagem });
                alert('Aviso atualizado com sucesso!');
            } else {
                await db.collection('avisos').add({ titulo, mensagem, dataPublicacao: new Date() });
                alert('Aviso publicado com sucesso!');
            }
            resetarFormulario();
            renderAvisos();
        } catch (error) {
            console.error("Erro ao salvar aviso: ", error);
            alert('Falha ao salvar o aviso.');
        }
    });

    // FUNÇÃO PARA LER E EXIBIR OS AVISOS EXISTENTES
    const renderAvisos = async () => {
        listaAvisosDiv.innerHTML = 'Carregando avisos...';
        const snapshot = await db.collection('avisos').orderBy('dataPublicacao', 'desc').get();
        listaAvisosDiv.innerHTML = '';

        snapshot.forEach(doc => {
            const aviso = doc.data();
            const data = aviso.dataPublicacao.toDate().toLocaleDateString('pt-BR');
            const avisoDiv = document.createElement('div');
            avisoDiv.className = 'aviso-item';
            avisoDiv.innerHTML = `
                <h4>${aviso.titulo}</h4>
                <p>${aviso.mensagem}</p>
                <small>Publicado em: ${data}</small>
                <div class="botoes-admin">
                    <button class="edit-button" data-id="${doc.id}">Editar</button>
                    <button class="delete-button" data-id="${doc.id}">Excluir</button>
                </div>
            `;
            listaAvisosDiv.appendChild(avisoDiv);
        });
    };

    // FUNÇÃO PARA LIDAR COM CLIQUES (DELETAR E EDITAR AVISOS)
    listaAvisosDiv.addEventListener('click', async (event) => {
        const target = event.target;
        const id = target.dataset.id;
        if (!id) return;

        if (target.classList.contains('delete-button')) {
            if (confirm('Tem certeza que deseja excluir este aviso?')) {
                try {
                    await db.collection('avisos').doc(id).delete();
                    renderAvisos();
                } catch (error) { console.error("Erro ao excluir aviso: ", error); }
            }
        }

        if (target.classList.contains('edit-button')) {
            const doc = await db.collection('avisos').doc(id).get();
            const aviso = doc.data();
            avisoTituloInput.value = aviso.titulo;
            avisoMensagemInput.value = aviso.mensagem;
            formButton.textContent = 'Salvar Alterações';
            modoEdicao = true;
            idEdicao = id;
            window.scrollTo(0, 0);
        }
    });

    // FUNÇÃO AUXILIAR PARA RESETAR O FORMULÁRIO
    const resetarFormulario = () => {
        formAviso.reset();
        modoEdicao = false;
        idEdicao = null;
        formButton.textContent = 'Publicar Aviso';
    };

    // --- NOVAS FUNÇÕES PARA GERENCIAR SUGESTÕES ---

    // FUNÇÃO PARA LER E EXIBIR AS SUGESTÕES
    const renderSugestoes = async () => {
        listaSugestoesDiv.innerHTML = 'Carregando sugestões...';
        const snapshot = await db.collection('sugestoes').orderBy('dataEnvio', 'desc').get();
        listaSugestoesDiv.innerHTML = '';

        if (snapshot.empty) {
            listaSugestoesDiv.innerHTML = '<p>Nenhuma sugestão recebida.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const sugestao = doc.data();
            const data = sugestao.dataEnvio.toDate().toLocaleString('pt-BR');
            
            const sugestaoDiv = document.createElement('div');
            sugestaoDiv.className = 'sugestao-item aviso-item'; // Reutiliza o estilo do aviso-item
            sugestaoDiv.innerHTML = `
                <p><strong>De:</strong> ${sugestao.identificacao || 'Anônimo'}</p>
                <p>"${sugestao.sugestao}"</p>
                <small>Enviado em: ${data}</small>
                <div class="botoes-admin">
                    <button class="delete-sugestao-button" data-id="${doc.id}">Excluir</button>
                </div>
            `;
            listaSugestoesDiv.appendChild(sugestaoDiv);
        });
    };

    // FUNÇÃO PARA DELETAR SUGESTÕES (usando delegação de eventos)
    listaSugestoesDiv.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-sugestao-button')) {
            const id = event.target.dataset.id;
            if (confirm('Tem certeza que deseja excluir esta sugestão?')) {
                try {
                    await db.collection('sugestoes').doc(id).delete();
                    renderSugestoes(); // Atualiza a lista de sugestões
                } catch (error) {
                    console.error("Erro ao excluir sugestão: ", error);
                }
            }
        }
    });

});