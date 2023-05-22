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
        res.status(201).send("Usuário cadastrado");
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function signIn(req, res) {
    const token = uuid();
    const { idUser } = res.locals;
    try {
        await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2);`, [idUser, token]);
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function userData(req, res) {
    const { userId } = res.locals.session;

    try {
        const userData = await db.query(`
        SELECT u.id, u.name, SUM(l."visitCount") AS "visitCount",
        json_agg(json_build_object(
            'id', l.id, 'shortUrl', l."shortUrl", 'url', l."trueUrl",
            'visitCount', l."visitCount")) 
        AS "shortenedUrls"
        FROM users u JOIN urls l
        ON u.id = l."userId" WHERE u.id = $1 GROUP BY u.id;`, [userId]);

        res.send(userData.rows[0])
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function ranking(req, res) {
    try {
        const userData = await db.query(`
        SELECT u.id, u.name, COUNT(l.id) AS "linksCount", SUM(l."visitCount") AS "visitCount"
        FROM users u JOIN urls l
        ON u.id = l."userId" GROUP BY u.id  ORDER BY "visitCount" DESC LIMIT 10;`);

        res.send(userData.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}