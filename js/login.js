document.addEventListener('DOMContentLoaded', () => {

    const auth = firebase.auth();

    const loginForm = document.querySelector('#login-form');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const errorMessage = document.querySelector('#error-message');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o recarregamento da página
        errorMessage.textContent = ''; // Limpa mensagens de erro antigas

        const email = emailInput.value;
        const password = passwordInput.value;

        // Função do Firebase para fazer login com email e senha
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Login bem-sucedido!
                console.log('Login bem-sucedido!', userCredential.user);
                alert('Login efetuado com sucesso!');
                // Redireciona o usuário para a futura página de administração
                window.location.href = 'admin.html';
            })
            .catch((error) => {
                // Ocorreu um erro no login
                console.error('Erro de autenticação:', error);
                // Exibe uma mensagem de erro amigável para o usuário
                errorMessage.textContent = 'Email ou senha inválidos. Por favor, tente novamente.';
            });
    });

});