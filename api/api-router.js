const usersRouter = require("./routes/users-router");
const gamesRouter = require("./routes/games-router");
const gameAuthorsRouter = require("./routes/game-authors-router");
const commentsRouter = require("./routes/comments-router");
const authRouter = require("./routes/auth-router");
const gamesUsersRouter = require("./routes/games-users-router");

module.exports = (express, connectionPool) => {
    let apiRouter = express.Router();

    apiRouter.use("/users", usersRouter(express, connectionPool));
    apiRouter.use("/gameAuthors", gameAuthorsRouter(express, connectionPool));
    apiRouter.use("/games", gamesRouter(express, connectionPool));
    apiRouter.use("/gamesUsers", gamesUsersRouter(express, connectionPool));
    apiRouter.use("/comments", commentsRouter(express, connectionPool));
    apiRouter.use("/auth", authRouter(express, connectionPool));

    apiRouter.route("/").get((req, res) => {
        res.json({ status: 200, message: "Welcome to ngArcade API!" });
    });

    return apiRouter;
};
