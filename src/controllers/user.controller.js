import { db } from "../database/database.connection.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

export async function signUp(req, res) {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    try {
        await db.query(`
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3);`,
            [name, email, hash]
        );
        res.send("Usuário cadastrado");
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function signIn(req, res) {
    const token = uuid();
    const { idUser } = res.locals;
    try {
        await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2);`, [idUser, token]);
        res.send("Login efetuado com sucesso.");
    } catch (error) {
        res.status(500).send(error.message);
    }
}