import { db } from "../database/database.connection.js";
import { nanoid } from 'nanoid'

export async function addUrl(req, res) {
    const { url } = req.body;
    const { userId } = res.locals.session;
    const shortUrl = nanoid(8);
    try {
        await db.query(`
            INSERT INTO urls ("userId", "shortUrl", "trueUrl")
            VALUES ($1, $2, $3);`,
            [userId, shortUrl, url]
        );
        const urlCreated = await db.query(`
            SELECT id, "shortUrl" FROM urls
            WHERE "shortUrl" = $1;`,
            [shortUrl]
        );
        res.status(201).send({ id: urlCreated.rows[0].id, shortUrl: urlCreated.rows[0].shortUrl });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getUrlId(req, res) {
    const { id, shortUrl, trueUrl } = res.locals.url;
    res.status(200).send({ id, shortUrl, url: trueUrl })
}

export async function openUrl(req, res) {
    const { shortUrl } = req.params;
    try {
        const url = await db.query(`SELECT "trueUrl", "visitCount" FROM urls WHERE "shortUrl" = $1;`, [shortUrl]);
        if (!url.rowCount) return res.status(404).send("Url não existente");

        const { trueUrl, visitCount } = url.rows[0];
        await db.query(`UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2;`, [visitCount + 1, shortUrl]);

        res.redirect(trueUrl);
    } catch (error) {
        res.status(500).send(error.message);
    }
}