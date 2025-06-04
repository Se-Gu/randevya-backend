export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'randevya',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-here',
    expiresIn: process.env.JWT_EXPIRATION || '1d',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  },
});
