export const JWT_CONFIG = {
  jwtSecret: "@QEGTUI",
  token_expiration: 3600,
};

export const DB_CONFIG = {
  port: process.env.PORT || 8000,
  mongoUrl: "mongodb://localhost:27017/nb-filter-configgi",
  bodyLimit: "40kb",
};
