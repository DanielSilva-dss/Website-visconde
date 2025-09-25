// Aguarda o conteúdo do HTML ser totalmente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- CÓDIGO EXISTENTE ---
    const db = firebase.firestore();
    const avisosGrid = document.querySelector('.avisos-grid');

    const carregarAvisos = async () => {
        // ... (toda a sua função carregarAvisos que já fizemos)
        try {
            avisosGrid.innerHTML = ''; 
            const snapshot = await db.collection('avisos').orderBy('dataPublicacao', 'desc').get();

            if (snapshot.empty) {
                avisosGrid.innerHTML = '<p>Nenhum aviso encontrado no momento.</p>';
                return;
            }

            snapshot.forEach(doc => {
                const aviso = doc.data();
                const data = aviso.dataPublicacao.toDate().toLocaleDateString('pt-BR');
                const avisoCardHTML = `
                    <article class="aviso-card">
                        <h3>${aviso.titulo}</h3>
                        <p>${aviso.mensagem}</p>
                        <span>Publicado em: ${data}</span>
                    </article>
                `;
                avisosGrid.innerHTML += avisoCardHTML;
            });

        } catch (error) {
            console.error("Erro ao carregar avisos: ", error);
            avisosGrid.innerHTML = '<p>Ocorreu um erro ao carregar os avisos.</p>';
        }
    };
    
    carregarAvisos();
    
    // --- NOVO CÓDIGO PARA O FORMULÁRIO DE SUGESTÕES ---

    // 1. Pega a referência do formulário no HTML
    const formSugestao = document.querySelector('#sugestoes form');

    // 2. Adiciona um "ouvinte" que espera pelo evento de 'submit' (envio) do formulário
    formSugestao.addEventListener('submit', async (event) => {
        // 3. Impede o comportamento padrão do navegador, que é recarregar a página
        event.preventDefault();

        // 4. Pega os valores que o usuário digitou nos campos
        const identificacao = document.querySelector('#identificacao').value;
        const sugestaoTexto = document.querySelector('#sugestao-texto').value;

        // Validação simples: não envia se a sugestão estiver vazia
        if (!sugestaoTexto.trim()) {
            alert('Por favor, escreva sua sugestão antes de enviar.');
            return;
        }

        try {
            // 5. Envia os dados para o Firestore, criando um novo documento na coleção 'sugestoes'
            await db.collection('sugestoes').add({
                identificacao: identificacao, // pode ser vazio
                sugestao: sugestaoTexto,
                dataEnvio: new Date() // Adiciona a data e hora exata do envio
            });

            // 6. Dá um feedback para o usuário e limpa o formulário
            alert('Sugestão enviada com sucesso! Obrigado por sua contribuição.');
            formSugestao.reset(); // Limpa todos os campos do formulário

        } catch (error) {
            console.error("Erro ao enviar sugestão: ", error);
            alert('Ocorreu um erro ao enviar sua sugestão. Tente novamente.');
        }
    });
    
});