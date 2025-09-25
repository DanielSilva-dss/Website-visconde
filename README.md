# Desenvolvendo Comunidade: Um Sistema Web para a Associação de Moradores

Este projeto é um sistema web completo desenvolvido para a Associação de Moradores da Rua Visconde de Itabaiana, no Rio de Janeiro, com o objetivo de modernizar a comunicação, otimizar a gestão de informações e promover a interação entre os 210 moradores e a diretoria.

<img src="images/logo.png" alt="Logo da Associação de Moradores Visconde de Itabaiana" width="300" height="200">

## 🚀 Funcionalidades Principais

Este projeto conta com três funcionalidades centrais que compõem um sistema de gerenciamento de conteúdo (CMS) robusto e seguro:

1.  **Gestão de Avisos (CRUD Completo):**
    * **Painel Administrativo Seguro:** Uma área protegida por login e senha onde a diretoria pode gerenciar o conteúdo do site.
    * **Criação, Edição e Exclusão:** Administradores podem publicar novos avisos, editar informações existentes e remover avisos antigos, com as atualizações sendo refletidas em tempo real na página inicial.

2.  **Sistema de Sugestões e Contato:**
    * **Canal Aberto com a Comunidade:** Moradores podem enviar sugestões, dúvidas ou mensagens diretamente pelo site.
    * **Visualização para Admin:** As mensagens são salvas e organizadas em uma seção no painel administrativo, permitindo que a diretoria visualize e gerencie o feedback recebido.

3.  **Gerenciamento de Documentos (CRUD de Links):**
    * **Centralização de Informações:** Administradores podem publicar links para documentos importantes (atas de reunião, regimentos, prestações de conta), centralizando o acesso à informação.
    * **Controle Total:** Assim como os avisos, os links dos documentos podem ser adicionados, editados e removidos facilmente pelo painel administrativo.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído do zero, utilizando uma arquitetura moderna e escalável, com foco em boas práticas de desenvolvimento web.

* **Frontend:**
    * **HTML5 Semântico:** Estrutura organizada e acessível.
    * **CSS3 Moderno:** Design responsivo e atraente, utilizando Flexbox, Grid Layout e Variáveis CSS para uma identidade visual coesa.
    * **JavaScript (Vanilla JS):** Toda a interatividade, manipulação do DOM e comunicação com o backend foram construídas com JavaScript puro, demonstrando um domínio profundo dos fundamentos da web.

* **Backend (Backend-as-a-Service):**
    * **Firebase:** Plataforma do Google utilizada para todas as necessidades de backend.
        * **Firestore:** Banco de dados NoSQL em tempo real para armazenar todos os dados da aplicação (avisos, documentos, sugestões).
        * **Firebase Authentication:** Sistema seguro para o login e gerenciamento de usuários administradores.
        * **Firebase Hosting:** Hospedagem rápida, segura e com CDN global para o deploy da aplicação.

---

## ⚙️ Como Executar o Projeto Localmente

1.  Clone este repositório.
2.  Crie um projeto no [Firebase](https://firebase.google.com/) e ative os serviços de **Firestore** e **Authentication** (com provedor de E-mail/Senha).
3.  Crie um arquivo `js/firebase-config.js` na raiz do projeto (utilize o `js/firebase-config.example.js` como modelo).
4.  Cole as suas chaves de configuração do Firebase no arquivo `firebase-config.js`.
5.  Abra o arquivo `index.html` em seu navegador (recomenda-se o uso da extensão Live Server no VS Code).

---

## 💡 Futuro (Próximos Passos)

Este projeto foi projetado para ser escalável. As próximas funcionalidades planejadas incluem:

* Sistema de login para moradores, com acesso a conteúdo exclusivo.
* Uma seção de classificados para que moradores possam divulgar produtos e serviços.
* Implementação de upload de arquivos (fotos, PDFs) diretamente para o Firebase Storage.