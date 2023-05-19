import { db } from "../database/database.connection.js";

export async function searchUrl(req, res, next){
    const { id } = req.params;

    try{
        const urlId = await db.query(`SELECT id, "shortUrl", "trueUrl" FROM urls WHERE id = $1;`, [id]);
        if(!urlId.rowCount) return res.status(404).send("Url não encontrada.");

        res.locals.url = urlId.rows[0];
        next();
    }catch(error){
        res.status(500).send(error.message);
    }
}