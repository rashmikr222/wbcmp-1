const { con } = require('../database/connection')

const queryExecutor = (query) => {
    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err)
            }
            return resolve(result)
        })
    })
}

const TABLE_NAME = {
    ORDER_INFO: 'order_info',
    ORDER_TYPE: 'order_type',
    ORDER_INDUSTRY: "order_industry",
    ORDER_CONTENT_TYPE: "order_content_type",
    ORDER_CONTENT_CREATOR: "order_content_creator",
    ORDER_WORDS: "order_words",
    ORDER_NUMBER_OF_IMAGES: "order_number_of_images",
    ORDER_DELIVERY_TIMELINE: "order_delivery_timeline",
    COST_DELIVERY_MASTER: "cost_delivery_master",
    ORDER_PROJECT_GOAL: "order_project_goal",
    POINT_OF_VIEW: "order_point_of_view",
    ORDER_TONE_OF_VOICE: "order_tone_of_voice",
    ORDER_STRUCTURE_PREFERENCE: "order_structure_preference",
    ORDER_IMAGE_RATIO: "order_image_type"
}

const COLUMN_NAME = {
    PROJECT_ORDER_ID: "project_order_id",
    ORDER_TYPE_ID: "order_type_id",
    PROJECT_NAME: "project_name",
    INDUSTRY_ID: "industry_id",
    USER_ID: "user_id",
    ORDER_CREATED_DATE: "order_created_date",
    PROJECT_GOAL_ID: "project_goal_id",
    CUSTOM_PROJECT_GOAL: "custom_project_goal",
    POINT_OF_VIEW_ID: "point_of_view_id",
    VOICE_TONE_ID: "voice_tone_id",
    CUSTOM_VOICE: "custom_voice",
    STRUCTURE_PREFERENCE_ID: "structure_preference_id",
    CUSTOM_STRUCTURE_PREFERENCE: "custom_structure_preference",
    DOS: "dos",
    DONTS: "donts",
    REFERENCE_LINKS: "reference_links",
    TELL_ABOUT_READERS: "tell_about_readers",
    GUIDELINES: "guidelines",
    META_DESCRIPTION: "meta_description"
}
const SQLQUERYSTRING = {
    SELECT_MASTER_DATA: `SELECT * from :table_name1,:table_name2,:table_name3
    :table_name4, :table_name5, :table_name6,:table_name7,:table_name8,:table_name9,:table_name10,:table_name11;`,
    // INSERT_ORDER_INFO: `INSERT INTO :table_name
    //  (:column1 , :column2 , :column3,:column4,:column5,
    //     :column6,:column7,:column8,:column9,
    //     :column10,:column11,:column12,:column13,
    //     :column14,:column15,:column16,:column17,:column18,:column19)
    // VALUES (value1, value2, value3,value4, value5, value6,value7, value8, value9,value10, value11, value12,
    //     value13, value14, value15,value16, value17, value18,value19
    //     );`
}

module.exports = { queryExecutor, SQLQUERYSTRING, TABLE_NAME, COLUMN_NAME }