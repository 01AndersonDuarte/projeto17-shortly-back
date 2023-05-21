import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";

export async function userSignUp(req, res, next) {
    const { email } = req.body;
    try {
        const user = await db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
        if (user.rowCount) return res.sendStatus(409);
        next();
    } catch (error) {
        res.send(500).send(error.message);
    }
}

export async function userSignIn(req, res, next) {
    const { email, password } = req.body;
    try {
        const checkUser = await db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
        if (!checkUser.rowCount) return res.sendStatus(401);

        const checkPassword = bcrypt.compareSync(password, checkUser.rows[0].password);
        if (!checkPassword) return res.status(401).send("Senha incorreta");

        res.locals.idUser = checkUser.rows[0].id;

        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}