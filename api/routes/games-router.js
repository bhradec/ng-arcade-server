const multer = require("multer");
const config = require("../../config");
const mysql = require("mysql");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        let fileExtension = file.mimetype.split("/")[1];
        cb(null, `${Date.now()}.${fileExtension}`);
    }
});

const multerUpload = multer({ 
    storage: multerStorage 
});

module.exports = (express, connectionPool) => {
    let gamesRouter = express.Router();

    gamesRouter.get("/", async (req, res) => {
        try {
            let connection = await connectionPool.getConnection();
            let rows = await connection.query(
                `SELECT games.*, 
                        gameAuthors.name AS gameAuthorName
                    FROM games INNER JOIN
                        gameAuthors ON games.gameAuthorId = gameAuthors.id`
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

    // Posting a game is done using a multipart form that contains an image.
    gamesRouter.post("/", multerUpload.single("image"), async (req, res, next) => {
        if (!req.file) {
            res.json({ 
                status: 400, 
                description: "File upload error." 
            });
        }

        let imagePath = req.file.destination + req.file.filename;
        imagePath = imagePath.replace("\\", "/");

        let game = {
            name: req.body.name,
            link: req.body.link,
            sourceLink: req.body.sourceLink,
            imagePath: imagePath,
            description: req.body.description,
            gameAuthorId: req.body.gameAuthorId,
        };

        try {
            let connection = await connectionPool.getConnection();
            let insertResult = await connection.query(
                `INSERT INTO games (name, link, sourceLink, imagePath, description, gameAuthorId) 
                    VALUES(${mysql.escape(game.name)}, 
                        ${mysql.escape(game.link)}, 
                        ${mysql.escape(game.sourceLink)},
                        ${mysql.escape(game.imagePath)},
                        ${mysql.escape(game.description)}, 
                        ${mysql.escape(game.gameAuthorId)})`
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

    // Editing a game is done using a multipart form that contains an image.
    gamesRouter.put("/", multerUpload.single("image"), async (req, res, next) => {
        try {
            // Image doesn't have to be provided.
            if (req.file) {
                let imagePath = req.file.destination + req.file.filename;
                imagePath = imagePath.replace("\\", "/");

                let game = {
                    id: req.body.id,
                    name: req.body.name,
                    link: req.body.link,
                    sourceLink: req.body.sourceLink,
                    imagePath: imagePath,
                    description: req.body.description,
                    gameAuthorId: req.body.gameAuthorId
                };

                let connection = await connectionPool.getConnection();
                let updateResult = await connection.query(
                    `UPDATE games 
                        SET name = ${mysql.escape(game.name)},  
                            link = ${mysql.escape(game.link)},
                            sourceLink = ${mysql.escape(game.sourceLink)},
                            imagePath = ${mysql.escape(game.imagePath)},
                            description = ${mysql.escape(game.description)},
                            gameAuthorId = ${mysql.escape(game.gameAuthorId)}
                        WHERE id = ${mysql.escape(game.id)}`
                );

                connection.release();
                res.json({ 
                    status: 200, 
                    changedRows: updateResult.changedRows 
                });
            } else {
                let game = {
                    id: req.body.id,
                    name: req.body.name,
                    link: req.body.link,
                    sourceLink: req.body.sourceLink,
                    description: req.body.description,
                    gameAuthorId: req.body.gameAuthorId
                };

                let connection = await connectionPool.getConnection();
                let updateResult = await connection.query(
                    `UPDATE games 
                        SET name = ${mysql.escape(game.name)},  
                            link = ${mysql.escape(game.link)},
                            sourceLink = ${mysql.escape(game.sourceLink)},
                            description = ${mysql.escape(game.description)},
                            gameAuthorId = ${mysql.escape(game.gameAuthorId)}
                        WHERE id = ${mysql.escape(game.id)}`
                );

                connection.release();
                res.json({ 
                    status: 200, 
                    changedRows: updateResult.changedRows 
                });
            }
        } catch (err) {
            console.error(err);
            res.json({ 
                status: 400, 
                description: "Update query error." 
            });
        }
    });

    gamesRouter.delete("/", async (req, res) => {
        res.json({ 
            status: 400, 
            description: "Body in DELETE request."
        });
    });

    gamesRouter.get("/:id", async (req, res) => {
        try {
            let id = req.params.id;

            let connection = await connectionPool.getConnection();
            let rows = await connectionPool.query(
                `SELECT games.*,
                        gameAuthors.name AS gameAuthorName
                    FROM games INNER JOIN 
                        gameAuthors ON games.gameAuthorId = gameAuthors.id
                    WHERE games.id = ${mysql.escape(id)}`
            );

            connection.release();
            res.json({ 
                status: 200, 
                game: rows[0] 
            });
        } catch (err) {
            console.error(err);
            return res.json({ 
                status: 400, 
                description: "Select query error." 
            });
        }
    });

    gamesRouter.delete("/:id", async (req, res) => {
        try {
            let id = req.params.id;
            let connection = await connectionPool.getConnection();

            await connectionPool.query(
                `DELETE FROM comments 
                    WHERE gameId = ${mysql.escape(id)}`
            );

            let queryResult = await connectionPool.query(
                `DELETE FROM games 
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

    gamesRouter.get("/byGameAuthor/:gameAuthorId", async (req, res) => {
        try {
            let gameAuthorId = req.params.gameAuthorId;

            let connection = await connectionPool.getConnection();
            let rows = await connectionPool.query(
                `SELECT games.*, gameAuthors.name 
                    FROM games INNER JOIN
                        gameAuthors ON games.gameAuthorId = gameAuthors.id
                    WHERE games.gameAuthorId = ${mysql.escape(gameAuthorId)}`
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

    return gamesRouter;
};
