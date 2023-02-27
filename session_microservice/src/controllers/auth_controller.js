const createErrors = require('http-errors')
const axios = require('axios')

const { queryExecutor, SQLQUERYSTRING } = require('../utils/common')
const { CONSTANT_VARIABLES } = require('../config/config')

// once the user login he is calling this endpoint
const getUserInformation = async (req, res, next) => {

    // console.log(req)
    // console.log("🚀 ~ file: auth_controller.js:9 ~ getUserInformation ~ res", res.socket.parser.incoming.sessionID)
    // const sessionID = res.socket.parser.incoming.sessionID

    try {
        // let session = req.session;
        // console.log("🚀 ~ file: auth_controller.js:14 ~ getUserInformation ~ session", session)
        // // const accessToken = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9kZXYtMTVpYjdueWV3NW9xcHg3ZC51cy5hdXRoMC5jb20vIn0..Sc-njMRKOGdkSI3S.Exq1QcNOiz1cEsUOlv7u1h_HNAbuEKyPFkrC80wkLiSbypoYKnI4jhX-ham7QDJIizlibupjJWWUEiH-HCOJU7KX3ThIC_4Hd9TFOaizubJyzjDkMNs2e2G-QPdKHCmgvpVpu-OWtkuoKVvfHu7c0rVaZ-o8hjyGNxzlDrgHbH4r1CPzM35O7LiKAUjRSKXYf29vg4s6Y3ufqg3FV-gc-fhLu2TWUbwAhK-JmpBr28Xqes__8NxQmiWs6hVeUPm9N0atVH92QY75ePWdr9aVo7sZpubATsUa4xzs1zI6htXvk5HKAOy4oja2PbfjUQn1xyPDiEbN7Wo6K2Qyzd8FNwwo.ISIOsXUQkJrOLXYm8rf_YA"
        // we get the accessToken by auth0
        // accessToken is sent by front-end in headers
        const accessToken = req.headers.authorization.split(' ')[1]
        console.log("🚀 ~ file: auth_controller.js:8 ~ getUserInformation ~ accessToken", accessToken)

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
        console.log("🚀 ~ file: auth_controller.js:34 ~ getUserInformation ~ userinfo", userinfo)

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
        console.log("🚀 ~ file: auth_controller.js:30 ~ getUserInformation ~ searchData", searchData)

        // if the user email is present in the user data base 
        // store the session start time
        if (searchData.length > 0) {
            console.log("call session while login");
            console.log("searchData.id", searchData[0].id); //user id

            // const sqlSessionInsert = `INSERT INTO user_session_info(session_id,user_info_id,session_start_time) values('${sessionID}',,now()+1)`
            const sqlSessionInsert = `INSERT INTO user_session_info(user_info_id,device_ip_address,session_start_time) values(${searchData[0].id},'127.0.0.1',now()+1)`
            const sessionResponse = await queryExecutor(sqlSessionInsert)
            console.log("🚀 ~ file: auth_controller.js:48 ~ getUserInformation ~ sessionResponse", sessionResponse)
            return res.status(209).send("data already exist")
        } else {
            console.log("call session while inserting")
            console.log("insert the data");
            // return res.status(201).send("insert the data")

            // once the user signup - user data is stored in the user table
            const sqlinsert = `INSERT INTO user_info (fullName,email,phoneNumber,role_name) VALUES('${fullName}','${email}','${phoneNumber}','${user_role}')`
            console.log("🚀 ~ file: auth_controller.js:36 ~ getUserInformation ~ sqlinsert", sqlinsert)
            const insertResponse = await queryExecutor(sqlinsert)
            console.log("🚀 ~ file: auth_controller.js:35 ~ getUserInformation ~ insertResponse", insertResponse)

            // fetch the last inserted id of the user 
            const user_id = insertResponse.insertId
            // console.log("🚀 ~ file: auth_controller.js:41 ~ getUserInformation ~ user_id", user_id)

            const sqlSessionInsert = `INSERT INTO user_session_info(user_info_id,device_ip_address,session_start_time) values(${user_id},'127.0.0.1',now()+1)`
            const sessionResponse = await queryExecutor(sqlSessionInsert)
            console.log("🚀 ~ file: auth_controller.js:48 ~ getUserInformation ~ sessionResponse", sessionResponse)
            if (insertResponse) {
                console.log("🚀 ~ file: auth_controller.js:48 ~ getUserInformation ~ sqlSessionInsert", sqlSessionInsert)

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
        //     console.log("🚀 ~ file: auth_controller.js:16 ~ getUserInformation ~ userinfo", userinfo)
        //     // console.log(req.user);
        //     const user_id = userinfo.sub.split('|')[1]
        //     console.log("🚀 ~ file: auth_controller.js:21 ~ getUserInformation ~ user_id", user_id)
        //     const fullName = userinfo.userData.fullName
        //     const email = userinfo.email;
        //     console.log("🚀 ~ file: auth_controller.js:27 ~ getUserInformation ~ email", email)
        //     const phoneNumber = userinfo.userData.phoneNumber
        //     const role_id = 1

        //     //const user ip addres 


        //     // search if the user already exist in the table
        //     const sqlSearch = SQLQUERYSTRING.SELECT_USER.replace(':email', email)
        //     const searchData = await queryExecutor(sqlSearch)
        //     // console.log("🚀 ~ file: auth_controller.js:36 ~ getUserInformation ~ searchData", searchData[0].email)
        //     if (searchData > 0) {
        //         console.log("========true");
        //     }

        //     // console.log("🚀 ~ file: auth_controller.js:31 ~ getUserInformation ~ searchData", searchData[0].email)
        //     // if (searchData.length > 0) {
        //     //     console.log("searchData[0].email===",searchData[0].email);
        //     //     if (searchData[0].email === email) {
        //     //         return next(createErrors[409]('user already exist'))
        //     //     }

        //     // } else {
        //     //     const sqlInsert = SQLQUERYSTRING.INSERT_USER.replace(':fullName', fullName).replace(':email', email).replace(':phoneNumber', phoneNumber).replace(':role_id', role_id)
        //     //     const data = await queryExecutor(sqlInsert)
        //     //     if (data) {
        //     //         console.log("🚀 ~ file: auth_controller.js:30 ~ getUserInformation ~ data", data)

        //     //         return res.status(200).send({
        //     //             message: "user data stored!",
        //     //             data: userinfo
        //     //         })
        //     //     }
        //     // }

        // }
        // return next(createErrors.InternalServerError('Error storing user!'))

    } catch (error) {
        console.log("🚀 ~ file: auth_controller.js:40 ~ getUserInformation ~ error", error)

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

module.exports = { getUserInformation, userLogout, testapi, testSession }