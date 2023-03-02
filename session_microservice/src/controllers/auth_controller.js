const createErrors = require('http-errors')
const axios = require('axios')

const { queryExecutor, SQLQUERYSTRING } = require('../utils/common')
const { CONSTANT_VARIABLES } = require('../config/config')
var request = require("request");


var AuthenticationClient = require('auth0').AuthenticationClient


var ManagementClient = require('auth0').ManagementClient;

var management = new ManagementClient({
    token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJFcWpOYzJKM2Y2X3kxOUw2SmttaCJ9.eyJpc3MiOiJodHRwczovL2Rldi1lZ2pydTJoZ2E2M3I2YzU1LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJwMFVWaXRXT1I3dDdOSVpFeHNSdXpyUGJMUURhMUdnUUBjbGllbnRzIiwiYXVkIjoidGVzdEFQSSIsImlhdCI6MTY3NzY2OTc1NCwiZXhwIjoxNjc3NzU2MTU0LCJhenAiOiJwMFVWaXRXT1I3dDdOSVpFeHNSdXpyUGJMUURhMUdnUSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.GSMMkUJFyINFtiYPRjHJXdQDb5aWHCIH4Y_Q-x29mgqHZCRUrT-UNfzUApx14r58h8AacJdCbUvJN_YvsUV1B9HmJ0317N6rousKBs8bDbb7HRJGW6eWVq0nR3MzoUxvl8YgOi5tnmrMnozDwRnNwC_PQ3NMskRXcD1nvBeV5nZCOIaA8ARTDIuS1VzLpmfGRL7MzWqLrAD9lMDa1T65NiaA68bQHzDVtF6oG-dce07uYkIm3R3i8A6qaaMKfGAIfGdBMorVVSA2xPHOOYiqNM5YzGCPHxIykHjctJd2YEk5RD9n4bpRJLl_KeMPI_YEOvi19DJ8OkNHdNtdICRLiw",
    domain: "dev-egjru2hga63r6c55.us.auth0.com"
});
var auth0 = new AuthenticationClient({
    domain: "dev-egjru2hga63r6c55.us.auth0.com",
    clientId: "6Mz5dqxyCOKSWe0Y1nfir81k7i62xNku",
    clientSecret: "pG52cFmh1f0YPh2zie_McNotmG8QhmOKKLPfe8FmZyM7hBZkBl5oQIq4TJ5GGU_P"
})

// ---------------------------------------------------------------------------------
const userSignup = async (req, res, next) => {
    try {

        const { fullName, email, phoneNumber, password } = req.body
        console.log("🚀 ~ file: auth_controller.js:29 ~ userSignup ~ fullName, email, phoneNumber, password:", fullName, email, phoneNumber, password)

        var data = {
            client_id: "6Mz5dqxyCOKSWe0Y1nfir81k7i62xNku",
            fullName: fullName,
            email: email,
            phoneNumber: phoneNumber,
            password: password,
            // connection: "Username-Password-Authentication",
            connection: "testdb",
        }
        //     auth0.database.signUp(
        //         data, async (err, userData) => {
        //         if (err) {
        //             console.log("🚀 ~ file: auth_controller.js:48 ~ auth0.database.signUp ~ err:", err)
        //             return res.status(400).send({
        //                 data: JSON.parse(err.message),
        //                 message: "Please verify the email or User already exist!"
        //             })
        //         }
        //         console.log("🚀 ~ file: auth_controller.js:41 ~ auth0.database.signUp ~ userData:", userData)
        //         // insert to our database
        //         const sqlInsert = `INSERT INTO user_info (fullName,email,phoneNumber,isEmailVerified) VALUES (
        // '${fullName}','${email}',${phoneNumber},'false')`

        //         const userInsertResp = await queryExecutor(sqlInsert)

        //         return res.status(201).send({
        //             message: "An email sent to you.Please verify the email!",
        //             data: userData
        //         })
        //     })

        const userData = await auth0.database.signUp(data)

        console.log("🚀 ~ file: auth_controller.js:41 ~ auth0.database.signUp ~ userData:", userData)
        // insert to our database
        const sqlInsert = `INSERT INTO user_info (fullName,email,phoneNumber,isEmailVerified) VALUES ('${fullName}','${email}',${phoneNumber},'false')`

        const userInsertResp = await queryExecutor(sqlInsert)

        return res.status(201).send({
            message: "An email sent to you.Please verify the email!",
            data: userData
        })

        // async (err, userData) => {
        //     if (err) {
        //         console.log("🚀 ~ file: auth_controller.js:48 ~ auth0.database.signUp ~ err:", err)
        //         return res.status(400).send({
        //             data: JSON.parse(err.message),
        //             message: "Please verify the email or User already exist!"
        //         })
        //     }

        // }


    } catch (error) {
        console.log("🚀 ~ file: auth_controller.js:27 ~ userSignup ~ error:", error)

    }
}

const userLogin = async (req, res, next) => {
    try {
        const { email, password, email_verified } = req.body;

        // const auth = new AuthenticationClient({
        //     domain: "dev-j7x42d7nyiq4nuhu.us.auth0.com",
        //     clientId: "COi9PDRbhbyvHa47pRjumFuAG4VenjIB",
        //     clientSecret:
        //         "ifdj7BqlydoSI5kpZsfKAY-49p3w7_eDYOxQ3hL3eM-vmZN_14cdSVfJOVZfy-Ee",
        // });
        if (email_verified === "true") {


            // update isEmailVerified to true
            const sqlUpdate = `UPDATE user_info
            SET isEmailVerified = true
            WHERE email = '${email}'`;
            const updateResponse = await queryExecutor(sqlUpdate)

            var data = {
                client_id: "6Mz5dqxyCOKSWe0Y1nfir81k7i62xNku", // Optional field.
                username: email,
                password: password,
                realm: "testdb", // Optional field.
                // scope: 'openid'  // Optional field.
            };

            auth0.oauth.passwordGrant(data, function (err, userData) {
                if (err) {
                    // Handle error.
                    console.log("error-----", err);
                    return res.status(403).send({
                        error: JSON.parse(err.message),

                    })
                }

                console.log(userData);
                return res.send({
                    data: userData,
                    message: "login successful"
                })
            });
        } else {
            return res.send({
                message: "Please verify the email sent to you!"
            })
        }

    } catch (error) {
        console.log("🚀 ~ file: auth_controller.js:101 ~ userLogin ~ error:", error)

    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body

        // check if the email is exist and verified

        const sqlSearch = `SELECT * FROM user_info WHERE email= '${email}'`
        const searchResponse = await queryExecutor(sqlSearch)
        if (searchResponse.length > 0) {
            var options = {
                method: "POST",
                url: "https://dev-egjru2hga63r6c55.us.auth0.com/dbconnections/change_password",
                headers: { "Content-Type": "application/json" },
                data: {
                    client_id: "6Mz5dqxyCOKSWe0Y1nfir81k7i62xNku",
                    email: "rashmi.kr@dollarbirdinc.com",
                    connection: "testdb",
                },
            };


            axios
                .request(options)
                .then(function (response) {
                    console.log(response.data);
                    return res.status(200).send({
                        message: response.data
                    })

                })
                .catch(function (error) {
                    console.log("🚀 ~ file: auth_controller.js:158 ~ forgotPassword ~ error:", error)
                    return res.status(500).send({
                        message: "Internal server error"
                    })
                });
        } else {
            return res.status(404).send({
                message: "Please enter valid email id"
            })
        }





    } catch (error) {
        console.log("🚀 ~ file: auth_controller.js:182 ~ forgotPassword ~ error:", error)

    }
}



// -------------------------------------------------------------------------------------
// once the user login he is calling this endpoint
const getUserInformation = async (req, res, next) => {

    // console.log(req)
    // const sessionID = res.socket.parser.incoming.sessionID

    try {
        // let session = req.session;
        // // const accessToken = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9kZXYtMTVpYjdueWV3NW9xcHg3ZC51cy5hdXRoMC5jb20vIn0..Sc-njMRKOGdkSI3S.Exq1QcNOiz1cEsUOlv7u1h_HNAbuEKyPFkrC80wkLiSbypoYKnI4jhX-ham7QDJIizlibupjJWWUEiH-HCOJU7KX3ThIC_4Hd9TFOaizubJyzjDkMNs2e2G-QPdKHCmgvpVpu-OWtkuoKVvfHu7c0rVaZ-o8hjyGNxzlDrgHbH4r1CPzM35O7LiKAUjRSKXYf29vg4s6Y3ufqg3FV-gc-fhLu2TWUbwAhK-JmpBr28Xqes__8NxQmiWs6hVeUPm9N0atVH92QY75ePWdr9aVo7sZpubATsUa4xzs1zI6htXvk5HKAOy4oja2PbfjUQn1xyPDiEbN7Wo6K2Qyzd8FNwwo.ISIOsXUQkJrOLXYm8rf_YA"
        // we get the accessToken by auth0
        // accessToken is sent by front-end in headers
        const accessToken = req.headers.authorization.split(' ')[1]
        // auth0 provides a end point to fetch user information we need to hit that end point using axios
        // inorder to fetch the user information
        const response = await axios.get(CONSTANT_VARIABLES.URL_FETCH_USERINFO,
            {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            })

        // from the response coming from axios 
        const userinfo = response.data
        // user data needs to be stored in the database
        const email = userinfo.email
        const fullName = userinfo.userData.fullName
        const phoneNumber = userinfo.userData.phoneNumber
        const user_role = userinfo.user_roles.roles[0]
        // console.log("🚀 ~ file: auth_controller.js:41 ~ getUserInformation ~ uses_role", uses_role)
        // const user_role = 'client'
        // const token   

        const sqlSearch = `SELECT * FROM user_info WHERE email = '${email}'`

        const searchData = await queryExecutor(sqlSearch)
        // if the user email is present in the user data base 
        // store the session start time
        if (searchData.length > 0) {
            console.log("call session while login");
            console.log("searchData.id", searchData[0].id); //user id

            // const sqlSessionInsert = `INSERT INTO user_session_info(session_id,user_info_id,session_start_time) values('${sessionID}',,now()+1)`
            const sqlSessionInsert = `INSERT INTO user_session_info(user_info_id,device_ip_address,session_start_time) values(${searchData[0].id},'127.0.0.1',now()+1)`
            const sessionResponse = await queryExecutor(sqlSessionInsert)
            return res.status(209).send("data already exist")
        } else {
            console.log("call session while inserting")
            console.log("insert the data");
            // return res.status(201).send("insert the data")

            // once the user signup - user data is stored in the user table
            const sqlinsert = `INSERT INTO user_info (fullName,email,phoneNumber,role_name) VALUES('${fullName}','${email}','${phoneNumber}','${user_role}')`
            const insertResponse = await queryExecutor(sqlinsert)
            // fetch the last inserted id of the user 
            const user_id = insertResponse.insertId
            // console.log("🚀 ~ file: auth_controller.js:41 ~ getUserInformation ~ user_id", user_id)

            const sqlSessionInsert = `INSERT INTO user_session_info(user_info_id,device_ip_address,session_start_time) values(${user_id},'127.0.0.1',now()+1)`
            const sessionResponse = await queryExecutor(sqlSessionInsert)
            if (insertResponse) {
                return res.status(200).send({
                    message: "data inserted successfully",
                    data: {
                        email: email
                    }

                })
            }
        }

        //     return next(createErrors.Unauthorized)
        // } else {
        //     const userinfo = response.data
        //     // console.log(req.user);
        //     const user_id = userinfo.sub.split('|')[1]
        //     console.log("🚀 ~ file: auth_controller.js:21 ~ getUserInformation ~ user_id", user_id)
        //     const fullName = userinfo.userData.fullName
        //     const email = userinfo.email;
        //     const phoneNumber = userinfo.userData.phoneNumber
        //     const role_id = 1

        //     //const user ip addres 


        //     // search if the user already exist in the table
        //     const sqlSearch = SQLQUERYSTRING.SELECT_USER.replace(':email', email)
        //     const searchData = await queryExecutor(sqlSearch)
        //     if (searchData > 0) {
        //         console.log("========true");
        //     }
        //     // if (searchData.length > 0) {
        //     //     console.log("searchData[0].email===",searchData[0].email);
        //     //     if (searchData[0].email === email) {
        //     //         return next(createErrors[409]('user already exist'))
        //     //     }

        //     // } else {
        //     //     const sqlInsert = SQLQUERYSTRING.INSERT_USER.replace(':fullName', fullName).replace(':email', email).replace(':phoneNumber', phoneNumber).replace(':role_id', role_id)
        //     //     const data = await queryExecutor(sqlInsert)
        //     //     if (data) {
        //     //         return res.status(200).send({
        //     //             message: "user data stored!",
        //     //             data: userinfo
        //     //         })
        //     //     }
        //     // }

        // }
        // return next(createErrors.InternalServerError('Error storing user!'))

    } catch (error) {
    }
}

const userLogout = async (req, res, next) => {
    console.log("logout api called.......");
    console.log(req.session)
    try {
        const user_info_id = req.params.id
        // console.log("======================> req", req.session.views)
        console.log("🚀 ~ file: auth_controller.js:121 ~ userLogout ~ user_info_id", user_info_id)
        const sqlUpdate = `  UPDATE user_session_info
SET session_end_time = now()+1,status = 0
WHERE user_info_id = ${user_info_id} and status = 1`
        const updateResponse = await queryExecutor(sqlUpdate)
        if (updateResponse) {
            return res.status(200).send({ message: "session updated" })
        } else {
            return next(createErrors.InternalServerError('unable to update session'))
        }
    } catch (error) {
        console.log("==error from logout", error);
    }
}

const testapi = async (req, res) => {
    try {
        return res.status(200).send({ message: "this is from protected route" })
    } catch (error) {

    }
}
const testSession = async (req, res, next) => {
    try {
        return res.status(200).send({ message: " route without token" })
    } catch (error) {

    }
}

const getUser = async (req, res, next) => {
    try {
        const { userID } = req.params
        const userInformation = `SELECT * FROM user_info WHERE `
    } catch (error) {

    }
}

module.exports = { userSignup, userLogin, forgotPassword, getUserInformation, userLogout, testapi, testSession }