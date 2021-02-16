module.exports = {
    port: process.env.PORT || 8081,
    connectionPoolData: {
        connectionLimit: 100,
        host: "localhost",
        user: "root",
        password: "",
        database: "ngarcade",
    },
    uploadPath: "./public/uploads/"
};
