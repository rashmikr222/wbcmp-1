const yup = require('yup')


const createOrderSchema = yup.object({
    
    body: yup.object({
        project_order_id: yup.number().required('project order id required'),
        order_type_id: yup.number().required('order type required'),
        project_name: yup.string().required('project name required'),
        industry_id: yup.number().required('industry id required'),
        user_id: yup.number().required('user id required'),
        project_goal_id: yup.number().required('please select project goal'),
        custom_project_goal: yup.string(),
        point_of_view_id: yup.number().required('point of view required'),
        voice_tone_id: yup.number().required('voice of tone required'),
        custom_voice: yup.string(),
        structure_preference_id: yup.number().required('structure_preference_id required'),
        custom_structure_preference: yup.string(),
        articles: yup.array().of(
            yup.object({
                title: yup.string().required('article title'),
                order_content_type_id: yup.number().required('order content type required'),
                content_creator_id: yup.number().required('please select content creator type'),
                words_id: yup.number().required('please select number of words')
            })
        )
    })
})


module.exports = { createOrderSchema }