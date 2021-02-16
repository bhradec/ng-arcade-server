const mysql = require("mysql");
const dateToMysql = require("../../util/date-to-mysql");

module.exports = (express, connectionPool) => {
    let commentsRouter = express.Router();

    commentsRouter.get("/", async (req, res) => {
        try {
            let connection = await connectionPool.getConnection();
            let rows = await connection.query(
                `SELECT comments.*, users.username 
                    FROM comments INNER JOIN 
                        users ON comments.userId = users.id`
            );

            connection.release();
            res.json({
                status: 200,
                comments: rows
            });
        } catch (err) {
            console.error(err);
            res.json({
                status: 400,
                description: "Select query error."
            });
        }
    });

    commentsRouter.post("/", async (req, res) => {
        let comment = {
            comment: req.body.comment,
            timestamp: dateToMysql(req.body.timestamp),
            userId: req.body.userId,
            gameId: req.body.gameId,
        };

        try {
            let connection = await connectionPool.getConnection();
            let insertResult = await connection.query(
                `INSERT INTO comments (comment, timestamp, userId, gameId) 
                    VALUES(${mysql.escape(comment.comment)}, 
                        ${mysql.escape(comment.timestamp)}, 
                        ${mysql.escape(comment.userId)},
                        ${mysql.escape(comment.gameId)})`
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

    commentsRouter.put("/", async (req, res) => {
        let comment = {
            id: req.body.id,
            comment: req.body.comment,
            timestamp: dateToMysql(req.body.timestamp),
            userId: req.body.userId,
            gameId: req.body.gameId,
        };

        try {
            let connection = await connectionPool.getConnection();
            let updateResult = await connection.query(
                `UPDATE comments 
                    SET comment = ${mysql.escape(comment.comment)},
                        timestamp = ${mysql.escape(comment.timestamp)},  
                        userId = ${mysql.escape(comment.userId)},
                        gameId = ${mysql.escape(comment.gameId)}
                    WHERE id = ${mysql.escape(comment.id)}`
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

    commentsRouter.delete("/", async (req, res) => {
        res.json({
            status: 400,
            description: "Body in DELETE request."
        });
    });

    commentsRouter.get("/:id", async (req, res) => {
        try {
            let id = req.params.id;

            let connection = await connectionPool.getConnection();
            let rows = await connectionPool.query(
                `SELECT comments.*, users.username 
                    FROM comments INNER JOIN
                        users ON comments.userId = users.id
                    WHERE comments.id = ${mysql.escape(id)}`
            );

            connection.release();
            res.json({
                status: 200,
                comment: rows[0]
            });
        } catch (err) {
            console.error(err);
            return res.json({
                status: 400,
                description: "Select query error."
            });
        }
    });

    commentsRouter.delete("/:id", async (req, res) => {
        try {
            let id = req.params.id;

            let connection = await connectionPool.getConnection();
            let queryResult = await connectionPool.query(
                `DELETE FROM comments 
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

    commentsRouter.get("/byGame/:gameId", async (req, res) => {
        try {
            let gameId = req.params.gameId;

            let connection = await connectionPool.getConnection();
            let rows = await connectionPool.query(
                `SELECT comments.*, users.username 
                    FROM comments INNER JOIN 
                        users ON comments.userId = users.id
                    WHERE comments.gameId = ${mysql.escape(gameId)}`
            );

            connection.release();
            res.json({
                status: 200,
                comments: rows
            });
        } catch (err) {
            console.error(err);
            return res.json({
                status: 400,
                description: "Select query error."
            });
        }
    });

    commentsRouter.get("/byUser/:userId", async (req, res) => {
        try {
            let userId = req.params.userId;

            let connection = await connectionPool.getConnection();
            let rows = await connectionPool.query(
                `SELECT comments.*, users.username 
                    FROM comments INNER JOIN 
                        users ON comments.userId = users.id
                    WHERE comments.userId = ${mysql.escape(userId)}`
            );

            connection.release();
            res.json({
                status: 200,
                comments: rows
            });
        } catch (err) {
            console.error(err);
            return res.json({
                status: 400,
                description: "Select query error."
            });
        }
    });

    return commentsRouter;
};
