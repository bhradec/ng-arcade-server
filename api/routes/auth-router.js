const crypto = require("crypto");
const mysql = require("mysql");

module.exports = (express, connectionPool) => {
    let authRouter = express.Router();

    authRouter.post("/", async (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let hashedPassword = crypto.createHash("sha512")
            .update(password)
            .digest("hex");

        let connection = await connectionPool.getConnection();
        let rows = await connection.query(
            `SELECT * FROM users
                WHERE username = ${mysql.escape(username)}`
        );

        if (rows.length > 0 && rows[0].password == hashedPassword) {
            res.json({
                status: 200,
                user: rows[0]
            });
        } else if (rows.length > 0) {
            res.json({
                status: 403,
                description: "Wrong password"
            });
        } else {
            res.json({
                status: 404,
                description: "User with that username does not exist",
            });
        }
    });

    return authRouter;
};
