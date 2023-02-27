const express = require('express')
const cors = require('cors')

const session = require('express-session')
const authRoutes = require('../src/routes/auth_routes')
const { CONSTANT_VARIABLES } = require('./config/config')

console.log("====CONSTANT_VARIABLES=====", CONSTANT_VARIABLES.SESSION_LIFETIME);
// ip address 
const expressip = require('express-ip');
const expressApp = (app) => {

    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use(expressip().getIpInfoMiddleware)
    console.log("🚀 ~ file: express-app.js:18 ~ expressApp ~ expressip().getIpInfo", expressip().getIpInfo)

    // app.get('/', function (req, res) {
    //     res.send(req.ipInfo);
    // });

    // app.use(cookieParser())
    // app.use(session({
    //     resave: true,
    //     saveUninitialized: true,
    //     secret: 'SOMERANDOMSECRETHERE',
    //     cookie: { maxAge: 60000 }
    // }));
    // const checkJwt = expressjwt({
    //     secret: jwks.expressJwtSecret({
    //         cache: true,
    //         rateLimit: true,
    //         jwksRequestsPerMinute: 5,
    //         jwksUri: "https://dev-15ib7nyew5oqpx7d.us.auth0.com/.well-known/jwks.json",
    //     }),
    //     client_secret: "QuqfnMJnF6b8lLkBKihs0xs_roJ1HVATrH5mkeg-cIjZd1kdl_yX43_mx4nL-YFh",
    //     audience: "auth-test",
    //     issuerBaseURL: "https://dev-15ib7nyew5oqpx7d.us.auth0.com/",
    //     algorithms: ["RS256"],
    // })

    // app.use(checkJwt)
    // session
    // app.use(session({
    //     secret: 'keyboard cat',
    //     name: 'test', // Customise the name to 'test'
    //     resave: false,
    //     saveUninitialized: false,
    //   }))
    // app.use(session({
    //     resave: false, //if any changes made to this session
    //     secret: CONSTANT_VARIABLES.SESSION_SECRET,
    //     // cookie: {
    //     //     maxAge: CONSTANT_VARIABLES.SESSION_LIFETIME,
    //     //     sameSite: 'strict', //or true,
    //     //     secure: false
    //     // },
    //     saveUninitialized:true
    // }))
    // app.get('/', (req, res) => {
    //     req.session.foo = 'foo'
    //     console.log(req)
    //     res.send('Hello World!')
    // })
    // authRoutes
    app.use('/api',authRoutes)
    // error middleware
    app.use((error, req, res, next) => {
        let status = error.status || 500
        let message = error.message || "Internal Server Error"
        console.log("🚀 ~ file: express-app.js:12 ~ app.use ~ message", status, message)
        res.send({
            status: status,
            message: message
        })

    })

    // import requestIp from 'request-ip';

    // app.use(requestIp.mw())

    // app.use((req, res) => {
    //   const ip = req.clientIp;
    // });

}

module.exports = { expressApp }
