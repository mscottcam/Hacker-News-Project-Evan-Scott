require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'postgresql://localhost/hacker-news-api';

// console.log(DATABASE_URL);

exports.DATABASE = {
  client: 'pg',
  connection: DATABASE_URL,
  pool: { min: 0, max: 3 },
  debug: false
};

exports.PORT = process.env.PORT || 8080;
