const mysql = require("mysql");

module.exports = (express, connectionPool) => {
    let gameAuthorsRouter = express.Router();

    gameAuthorsRouter.get("/", async (req, res) => {
        try {
            let connection = await connectionPool.getConnection();
            let rows = await connection.query(`SELECT * FROM gameAuthors`);
            connection.release();
            res.json({
                status: 200,
                gameAuthors: rows
            });
        } catch (err) {
            console.error(err);
            res.json({
                status: 400,
                description: "Select query error."
            });
        }
    });

    gameAuthorsRouter.post("/", async (req, res) => {
        let gameAuthor = {
            name: req.body.name,
        };

        try {
            let connection = await connectionPool.getConnection();
            let insertResult = await connection.query(
                `INSERT INTO gameAuthors (name) 
                    VALUES(${mysql.escape(gameAuthor.name)})`
            );

            connection.release();
            res.json({
                status: 200,
                insertId: insertResult.insertId
            });
        } catch (err) {
            console.error(err);
            res.json({
                status: 400,
                description: "Insert query error."
            });
        }
    });

    gameAuthorsRouter.put("/", async (req, res) => {
        let gameAuthor = {
            id: req.body.id,
            name: req.body.name,
        };

        try {
            let connection = await connectionPool.getConnection();
            let updateResult = await connection.query(
                `UPDATE gameAuthors 
                    SET name = ${mysql.escape(gameAuthor.name)}
                    WHERE id = ${mysql.escape(gameAuthor.id)}`
            );

            connection.release();
            res.json({
                status: 200,
                changedRows: updateResult.changedRows
            });
        } catch (err) {
            console.error(err);
            res.json({
                status: 400,
                description: "Update query error."
            });
        }
    });

    gameAuthorsRouter.delete("/", async (req, res) => {
        res.json({
            status: 400,
            description: "Body in DELETE request."
        });
    });

    gameAuthorsRouter.get("/:id", async (req, res) => {
        try {
            let id = req.params.id;

            let connection = await connectionPool.getConnection();
            let rows = await connectionPool.query(
                `SELECT * FROM gameAuthors 
                    WHERE id = ${mysql.escape(id)}`
            );

            connection.release();
            res.json({
                status: 200,
                gameAuthor: rows[0]
            });
        } catch (err) {
            console.error(err);
            return res.json({
                status: 400,
                description: "Select query error."
            });
        }
    });

    gameAuthorsRouter.delete("/:id", async (req, res) => {
        try {
            let id = req.params.id;

            let connection = await connectionPool.getConnection();
            let queryResult = await connectionPool.query(
                `DELETE FROM gameAuthors 
                    WHERE id = ${mysql.escape(id)}`
            );

            connection.release();
            res.json({
                status: 200,
                affectedRows: queryResult.affectedRows
            });
        } catch (err) {
            console.error(err);
            return res.json({
                status: 400,
                description: "Delete query error."
            });
        }
    });

    return gameAuthorsRouter;
};
