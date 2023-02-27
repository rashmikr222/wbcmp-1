const { default: axios } = require("axios")
const { queryExecutor } = require("../utils/common")

const getVettingDashboard = async (req, res) => {
    try {


        const sqlSearch = `SELECT * FROM ORDER_INFO WHERE order_status='Assign'`
        const orderResponse = await queryExecutor(sqlSearch)

        // data.orderResponse.order_type_id
        if (orderResponse.length > 0) {
            const resp = orderResponse.map(async (val) => {
                const order_type =
                    `SELECT * from order_content_type where order_type_id=${val.order_type_id}`

                const ordertypeResponse = await queryExecutor(order_type)
                console.log("🚀 ~ file: vetting-controllers.js:14 ~ res ~ ordertyperesponse:", ordertypeResponse)

                const industry = `SELECT * from order_industry where industry_id=${val.industry_id}`
                const industryResponse = await queryExecutor(industry)
                // const user_id get the user details 
                const userResponse = await axios.get(`http://localhost:8001/api/userinformation/${val.user_id}`)


                return { ...val, order_type_details: ordertypeResponse, industry_details: industryResponse, user_details: userResponse }
            })
            console.log("🚀 ~ file: vetting-controllers.js:18 ~ resp ~ resp:", resp)
            const vettingResponse = await Promise.all(resp)
            console.log("🚀 ~ file: vetting-controllers.js:20 ~ getVettingDashboard ~ vettingResponse:", vettingResponse)
            return res.send({
                data: vettingResponse
            })
        } else {
            return res.send({
                data: [],
                message: "data not found"
            })
        }

        console.log("🚀 ~ file: vetting-controllers.js:7 ~ getVettingDashboard ~ orderResponse:", orderResponse)
    } catch (error) {
        console.log("error======", error);
    }
}

module.exports = { getVettingDashboard }