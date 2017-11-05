const config = {
    env: process.env.NODE_ENV || 'production',
    logging: false,
    secrets: {
        jwtSecret: process.env.JWT_SECRET
    }
};