const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Faz o Express servir o index.html e arquivos estáticos da pasta raiz
app.use(express.static(__dirname));

// Garante que a página inicial '/' entregue o index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Conecta ao banco de dados PostgreSQL na nuvem usando a variável DATABASE_URL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Cria a tabela no PostgreSQL se ela ainda não existir
pool.query(`
    CREATE TABLE IF NOT EXISTS visitas (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        data TEXT NOT NULL
    )
`).catch(err => console.error("Erro ao criar tabela:", err));

// Rota GET: Busca todos os registros no banco PostgreSQL
app.get("/visitas", async (req, res) => {
    try {
        const resultado = await pool.query("SELECT * FROM visitas ORDER BY id DESC");
        res.json(resultado.rows);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar visitas" });
    }
});

// Rota POST: Insere um novo visitante no banco PostgreSQL
app.post("/visita", async (req, res) => {
    try {
        const { nome } = req.body;
        const dataAtual = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

        await pool.query("INSERT INTO visitas (nome, data) VALUES ($1, $2)", [nome, dataAtual]);
        res.json({ mensagem: "Salvo na nuvem (PostgreSQL)!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao salvar visita" });
    }
});

// Rota PUT: Atualiza o nome de um visitante específico pelo ID
app.put("/visita/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome } = req.body;

        await pool.query("UPDATE visitas SET nome = $1 WHERE id = $2", [nome, id]);
        res.json({ mensagem: "Registro atualizado!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar visita" });
    }
});

// Rota DELETE: Apaga um visitante específico pelo ID
app.delete("/visita/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM visitas WHERE id = $1", [id]);
        res.json({ mensagem: "Registro removido!" });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao apagar visita" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express + PostgreSQL rodando na porta ${PORT}!`);
});