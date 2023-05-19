import { db } from "../database/database.connection.js";

export async function searchUrlId(req, res, next) {
    const { id } = req.params;

    try {
        const urlId = await db.query(`SELECT * FROM urls WHERE id = $1;`, [id]);
        if (!urlId.rowCount) return res.status(404).send("Url não encontrada.");

        res.locals.url = urlId.rows[0];
        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function searchUrlShort(req, res, next) {
    const { shortUrl } = req.params;

    try {
        const urlShort = await db.query(`SELECT "trueUrl", "visitCount" FROM urls WHERE "shortUrl" = $1;`, [shortUrl]);
        if (!urlShort.rowCount) return res.status(404).send("Url não existente");

        res.locals.url = urlShort.rows[0];
        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
}