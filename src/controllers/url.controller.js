import { db } from "../database/database.connection.js";
import { nanoid } from 'nanoid'

export async function addUrl(req, res) {
    const { url } = req.body;
    const { userId } = res.locals.session;
    const newShortUrl = nanoid(8);
    try {
        await db.query(`
            INSERT INTO urls ("userId", "shortUrl", "trueUrl")
            VALUES ($1, $2, $3);`,
            [userId, newShortUrl, url]
        );

        const urlCreated = await db.query(`
            SELECT id, "shortUrl" FROM urls
            WHERE "shortUrl" = $1;`,
            [newShortUrl]
        );
        const { id, shortUrl } = urlCreated.rows[0];

        res.status(201).send({ id, shortUrl });
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
        const { trueUrl, visitCount } = res.locals.url;
        await db.query(`UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2;`, [visitCount + 1, shortUrl]);

        res.redirect(trueUrl);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function deleteUrl(req, res) {
    const { id } = req.params;
    const { userId } = res.locals.session;

    try {
        if(userId!==res.locals.url.userId) return res.sendStatus(401);
        
        await db.query(`DELETE FROM urls WHERE id = $1;`, [id]);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
}