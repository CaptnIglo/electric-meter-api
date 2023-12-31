const env = process.env;

const config = {
  db: {
    /* do not put password or any sensitive info here, done only for demo */
    host: env.DB_HOST || "localhost",
    port: env.DB_PORT || "8812",
    user: env.DB_USER || "admin",
    password: env.DB_PASSWORD || "quest",
    database: env.DB_NAME || "qdp",
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};

module.exports = config;
