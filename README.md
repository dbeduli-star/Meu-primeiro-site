# 💻 Cartão Dev Full Stack - Douglas Beduli

Aplicação web full stack desenvolvida para exibir meu perfil profissional, habilidades técnicas e um mural interativo de visitantes com persistência em banco de dados.

## 🚀 Tecnologias Utilizadas
* **Front-end:** HTML5, CSS3 e JavaScript (Fetch API)
* **Back-end:** Node.js e Express
* **Banco de Dados:** SQLite (`better-sqlite3`)

## ⚙️ Funcionalidades (CRUD Completo)
* **Create (`POST`):** Cadastro de novos visitantes com data e hora automática.
* **Read (`GET`):** Listagem em tempo real dos últimos visitantes salvos no banco.
* **Update (`PUT`):** Edição rápida do nome de qualquer visitante cadastrado.
* **Delete (`DELETE`):** Remoção individual de registros do mural.

## 🛠️ Como rodar o projeto na sua máquina
1. Clone este repositório:
   ```bash
   git clone https://github.com
   ```
2. Instale as dependências do servidor:
   ```bash
   npm install
   ```
3. Inicie o servidor back-end:
   ```bash
   node servidor.js
   ```
4. Abra o arquivo `index.html` no seu navegador.
