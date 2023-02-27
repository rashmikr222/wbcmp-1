const { SQLQUERYSTRING, TABLE_NAME, queryExecutor, COLUMN_NAME } = require("../utils/common")

const getMasterData = async (req, res, next) => {
    console.log("inside mater data");
    try {

        // fetch all the data from master table
        const sqlSearch = `SELECT * FROM ${TABLE_NAME.ORDER_INDUSTRY};
        SELECT * FROM ${TABLE_NAME.ORDER_CONTENT_TYPE};
        SELECT * FROM  ${TABLE_NAME.ORDER_TYPE};
        SELECT * FROM ${TABLE_NAME.ORDER_CONTENT_CREATOR};
        SELECT * FROM ${TABLE_NAME.ORDER_WORDS};
        SELECT * FROM ${TABLE_NAME.ORDER_NUMBER_OF_IMAGES};
        SELECT * FROM ${TABLE_NAME.ORDER_PROJECT_GOAL};
        SELECT * FROM ${TABLE_NAME.POINT_OF_VIEW};
        SELECT * FROM ${TABLE_NAME.ORDER_TONE_OF_VOICE};
        SELECT * FROM ${TABLE_NAME.ORDER_STRUCTURE_PREFERENCE};
        SELECT * FROM ${TABLE_NAME.ORDER_IMAGE_RATIO};`

        // we pass sql query as parameter to the queryExecutor function
        const queryResponse = await queryExecutor(sqlSearch)

        // queryResponse will be in type array 
        // if queryResponse length is greater than zero data will be displayed else no data found
        if (queryResponse.length > 0) {
            return res.status(200).send({
                data: [
                    {
                        order_industry: queryResponse[0],
                        order_content_type: queryResponse[1],
                        order_type: queryResponse[2],
                        order_content_creator: queryResponse[3],
                        order_words: queryResponse[4],
                        order_number_of_images: queryResponse[5],
                        order_project_goal: queryResponse[6],
                        point_of_view: queryResponse[7],
                        order_tone_of_voice: queryResponse[8],
                        order_structure_preference: queryResponse[9],
                        order_image_ratio: queryResponse[10]

                    }
                ]

            })
        } else {
            return res.status(200).send({
                message: "Data not found",
                data: []
            })
        }

    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message })
    }
}


const createOrder = async (req, res, next) => {
    try {
        // destructure the data coming from req.body
        const { project_order_id, order_type_id,
            project_name, industry_id, user_id,
            project_goal_id,
            custom_project_goal, point_of_view_id,
            voice_tone_id, custom_voice, structure_preference_id,
            custom_structure_preference, dos, donts,
            reference_links, tell_about_readers, guidelines,
            meta_description,

            articles
        } = req.body
        console.log("🚀 ~ file: order_controller.js:71 ~ createOrder ~ req.body:", req.body)



        //   insert user entered data into table
        const sqlInsert = `INSERT INTO ORDER_INFO
            (PROJECT_ORDER_ID, ORDER_TYPE_ID, PROJECT_NAME,INDUSTRY_ID,USER_ID,
                ORDER_CREATED_DATE,PROJECT_GOAL_ID,CUSTOM_PROJECT_GOAL,
                POINT_OF_VIEW_ID,VOICE_TONE_ID,CUSTOM_VOICE,STRUCTURE_PREFERENCE_ID,
                CUSTOM_STRUCTURE_PREFERENCE,DOS,DONTS,REFERENCE_LINKS,TELL_ABOUT_READERS,GUIDELINES,META_DESCRIPTION)
        VALUES (${project_order_id}, ${order_type_id}, '${project_name}',
                ${industry_id}, ${user_id}, now()+1,
                ${project_goal_id}, '${custom_project_goal}', ${point_of_view_id}, 
                ${voice_tone_id}, '${custom_voice}', ${structure_preference_id},
                '${custom_structure_preference}','${dos}' ,'${donts}' ,'${reference_links}',
                '${tell_about_readers}' ,'${guidelines}' ,'${meta_description}'
        );`
        console.log("🚀 ~ file: order_controller.js:32 ~ createOrder ~ sqlInsert:", sqlInsert)

        // we pass sql query as parameter to the queryExecutor function
        const queryOrderResponse = await queryExecutor(sqlInsert)
        console.log("🚀 ~ file: order_controller.js:34 ~ createOrder ~ queryResponse:", queryOrderResponse)

        // get the last id of the order
        const order_id = queryOrderResponse.insertId
        console.log("🚀 ~ file: order_controller.js:39 ~ createOrder ~ order_id:", order_id)

        // insert to order requirement 
        // whatever data coming from articles we have to store it in order requirement table
        const orderRequirement = articles.forEach(async (value) => {

            const orderRequirementQuery = `INSERT INTO order_requirement (order_info_id,title,order_content_type_id,
                content_creator_id ,keywords,words_id ,images_id ,additional_comments 
                ) 
            values (${order_id},'${value.title}',${value.order_content_type_id},
            ${value.content_creator_id},'${value.keywords}',${value.words_id},${value.images_id},'${value.additional_comments}'
            )`

            const queryOrderRequirement = await queryExecutor(orderRequirementQuery)
            console.log("🚀 ~ file: order_controller.js:51 ~ orderRequirement ~ queryOrderRequirement:", queryOrderRequirement)
            console.log("🚀 ~ file: order_controller.js:49 ~ orderRequirement ~ orderRequirementQuery:", orderRequirementQuery)
        })

        console.log("🚀 ~ file: order_controller.js:42 ~ createOrder ~ orderRequirement:", orderRequirement)
        return res.status(200).send({
            message: "Order created successfully"
        })
    } catch (error) {
        console.log("🚀 ~ file: order_controller.js:36 ~ createOrder ~ error:", error)

    }

}

const getOrder = async (req, res, next) => {
    try {
        const orderId = req.params.orderId
        console.log("🚀 ~ file: order_controller.js:68 ~ getOrder ~ orderId:", orderId)
        const sqlSearch = `SELECT * from ${TABLE_NAME.ORDER_INFO} WHERE ${COLUMN_NAME.PROJECT_ORDER_ID} =${orderId}`
        const getOrderQuery = await queryExecutor(sqlSearch)
        console.log("🚀 ~ file: order_controller.js:71 ~ getOrder ~ getOrderQuery:", getOrderQuery)
        if (getOrderQuery.length > 0) {
            return res.status(200).send({
                data: getOrderQuery
            })
        } else {
            return res.status(404).send({
                message: "Data not found"
            })
        }

    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message });
    }
}


module.exports = { getMasterData, createOrder, getOrder }