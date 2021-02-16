const crypto = require("crypto");
const mysql = require("mysql");

module.exports = (express, connectionPool) => {
    let usersRouter = express.Router();

    usersRouter.get("/", async (req, res) => {
        try {
            let connection = await connectionPool.getConnection();
            let rows = await connection.query(`SELECT * FROM users`);

            connection.release();
            res.json({
                status: 200,
                users: rows
            });
        } catch (err) {
            console.error(err);
            res.json({
                status: 400,
                description: "Select query error."
            });
        }
    });

    usersRouter.post("/", async (req, res) => {
        let password = req.body.password;
        let hashedPassword = crypto.createHash("sha512")
            .update(password)
            .digest("hex");

        let user = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            level: req.body.level,
        };

        try {
            let connection = await connectionPool.getConnection();

            let rows = await connection.query(
                `SELECT * FROM users
                    WHERE users.username = ${mysql.escape(user.username)}`
            );

            if (rows.length > 0) {
                connection.release();
                res.json({
                    status: 400,
                    description: "User with that username already exists."
                });
            } else {
                let insertResult = await connection.query(
                    `INSERT INTO users (username, email, password, level) 
                        VALUES(${mysql.escape(user.username)}, 
                            ${mysql.escape(user.email)}, 
                            ${mysql.escape(user.password)},
                            ${mysql.escape(user.level)})`
                );

                connection.release();
                res.json({
                    status: 200,
                    insertId: insertResult.insertId
                });
            }
        } catch (err) {
            res.json({
                status: 400,
                description: "Insert query error."
            });
        }
    });

    usersRouter.put("/", async (req, res) => {
        let password = req.body.password;
        let hashedPassword = crypto.createHash("sha512")
            .update(password)
            .digest("hex");

        let user = {
            id: req.body.id,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            level: req.body.level,
        };

        try {
            let connection = await connectionPool.getConnection();
            let updateResult = await connection.query(
                `UPDATE users 
                    SET username = ${mysql.escape(user.username)},  
                        email = ${mysql.escape(user.email)},
                        password = ${mysql.escape(user.password)},
                        level = ${mysql.escape(user.level)}
                    WHERE id = ${mysql.escape(user.id)}`
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

    usersRouter.delete("/", async (req, res) => {
        res.json({
            status: 400,
            description: "Body in DELETE request."
        });
    });

    usersRouter.get("/:id", async (req, res) => {
        try {
            let id = req.params.id;

            let connection = await connectionPool.getConnection();
            let rows = await connectionPool.query(
                `SELECT * FROM users WHERE id = ${mysql.escape(id)}`
            );

            connection.release();
            res.json({
                status: 200,
                user: rows[0]
            });
        } catch (err) {
            console.error(err);
            return res.json({
                status: 400,
                description: "Select query error."
            });
        }
    });

    usersRouter.delete("/:id", async (req, res) => {
        try {
            let id = req.params.id;

            let connection = await connectionPool.getConnection();
            let queryResult = await connectionPool.query(
                `DELETE FROM users WHERE id = ${mysql.escape(id)}`
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

    return usersRouter;
}
