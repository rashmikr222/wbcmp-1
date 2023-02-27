
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const jwtCheck = (req, res, next) => {
    
    jwt({
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://dev-15ib7nyew5oqpx7d.us.auth0.com/.well-known/jwks.json`,
        }),

        audience: 'auth-test',
        issuer: `https://dev-15ib7nyew5oqpx7d.us.auth0.com/`,
        algorithms: ["RS256"],
    });

    next()
}


module.exports = { jwtCheck }