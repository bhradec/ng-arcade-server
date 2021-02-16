const mysql = require("mysql");
const dateToMysql = require("../../util/date-to-mysql");

module.exports = (express, connectionPool) => {
    let gamesUsersRouter = express.Router();

    gamesUsersRouter.get("/", async (req, res) => {
        try {
            let connection = await connectionPool.getConnection();
            let rows = await connection.query(
                `SELECT gamesUsers.userId, 
                        gamesUsers.timestamp,
                        games.* 
                    FROM gamesUsers INNER JOIN
                        games ON games.id = gamesUsers.gameId
                    ORDER BY gamesUsers.timestamp`
            );

            connection.release();
            res.json({
                status: 200,
                gamesUsers: rows
            });
        } catch (err) {
            console.error(err);
            res.json({
                status: 400,
                description: "Select query error."
            });
        }
    });

    gamesUsersRouter.post("/", async (req, res) => {
        try {
            let userId = req.body.userId;
            let gameId = req.body.gameId;
            let timestamp = dateToMysql(req.body.timestamp);

            let connection = await connectionPool.getConnection();
            let insertResult = await connection.query(
                `INSERT INTO gamesUsers (userId, gameId, timestamp)
                    VALUES(${mysql.escape(userId)}, 
                        ${mysql.escape(gameId)},
                        ${mysql.escape(timestamp)})`
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

    gamesUsersRouter.get("/byUser/:id", async (req, res) => {
        try {
            let id = req.params.id;
            let connection = await connectionPool.getConnection();
            let rows = await connection.query(
                `SELECT games.* FROM
                        gamesUsers INNER JOIN
                        games ON gamesUsers.gameId = games.id
                    WHERE gamesUsers.userId = ${id}`
            );

            connection.release();
            res.json({
                status: 200,
                games: rows
            });
        } catch (err) {
            console.error(err);
            res.json({
                status: 400,
                description: "Select query error."
            });
        }
    });

    return gamesUsersRouter;
};
