module.exports = {
    mongoUrl:  process.env.MONGODB_URI ||  'mongodb://127.0.0.1:27017/reclaim',
    mongoRetry: process.env.MONGODB_RECONNECT_INTERVAL || 2000,
    httpPort: process.env.PORT || 3000,
    https: process.env.HTTPS || 'false',
    emailAPIKey: process.env.EMAIL_API_KEY,
    emailAPISecret: process.env.EMAIL_API_SECRET,
    emailFrom: process.env.EMAIL_FROM,
    emailName: process.env.EMAIL_NAME,
}