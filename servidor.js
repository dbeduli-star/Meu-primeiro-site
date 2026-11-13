const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

// Faz o Express servir o index.html e arquivos estáticos da pasta raiz
app.use(express.static(__dirname));

// Garante que a página inicial '/' entregue o index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Conecta ao banco de dados SQLite (cria o arquivo visitas.db sozinho)
const db = new Database("visitas.db");

// Cria a tabela no banco usando linguagem SQL
db.exec(`
    CREATE TABLE IF NOT EXISTS visitas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        data TEXT NOT NULL
    )
`);

// Rota GET: Busca todos os registros no banco SQL
app.get("/visitas", (req, res) => {
    const lista = db.prepare("SELECT * FROM visitas ORDER BY id DESC").all();
    res.json(lista);
});

// Rota POST: Insere um novo visitante no banco SQL
app.post("/visita", (req, res) => {
    const { nome } = req.body;
    const dataAtual = new Date().toLocaleString("pt-BR");

    const inserir = db.prepare("INSERT INTO visitas (nome, data) VALUES (?, ?)");
    inserir.run(nome, dataAtual);

    res.json({ mensagem: "Salvo no Banco de Dados SQL!" });
});

// Rota PUT: Atualiza o nome de um visitante específico pelo ID
app.put("/visita/:id", (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    const atualizar = db.prepare("UPDATE visitas SET nome = ? WHERE id = ?");
    atualizar.run(nome, id);

    res.json({ mensagem: "Registro atualizado!" });
});

// Rota DELETE: Apaga um visitante específico pelo ID
app.delete("/visita/:id", (req, res) => {
    const { id } = req.params;
    const deletar = db.prepare("DELETE FROM visitas WHERE id = ?");
    deletar.run(id);

    res.json({ mensagem: "Registro removido!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express + Banco SQL rodando na porta ${PORT}!`);
});