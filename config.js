module.exports = {
    port: process.env.PORT || 8081,
    connectionPoolData: {
        connectionLimit: 100,
        host: "localhost",
        user: "username",
        password: "password",
        database: "ngarcade",
        insecureAuth: true
    },
    uploadPath: "./public/uploads/"
};
