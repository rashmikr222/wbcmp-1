const amqplib = require("amqplib")
const { v4: uuid4 } = require("uuid")
// const { env } = require("../utils/common")
const productModel = require('../database/models/product')
const lotModel = require('../database/models/lots')
const inventoryProduct = require("../database/models/inventoryProduct")
const sellerModel = require("../database/models/seller")
const varietyModel = require("../database/models/variety")
const regionModel = require("../database/models/region")
const originModel = require("../database/models/origins")
let amqplibConnection = null

// create channel
// establish connect to rabbitmq server
const getChannel = async () => {
    try {
        // connect to rabbitmq server
        // amqplibConnection is null, then make connection to rabbitmq
        if (amqplibConnection == null) {
            amqplibConnection = await amqplib.connect("amqp://localhost")
        }
        // create a channel
        const channel = await amqplibConnection.createChannel()
        // return the channel
        return channel
    } catch (error) {
        console.log("🚀  file: rabbitmq.js  line 111  getChannel  error", error)
    }
}

const getProductDetails = async (data) => {
    // let samptest = []
    console.log("========================================> ", data)
    if (Array.isArray(data)) {
        const samptest = data?.map(async (element) => {
            const prodData = await productModel.findOne({ _id: element.product_id, status: "active" }, { images: 1, _id: 1, farm_name: 1, origin: { name: 1 }, variety: { name: 1 } })
            // samptest.push(prodData)
            const productData = { ...prodData._doc, images: prodData._doc.images[0] }
            // return { ...element, product_id: prodData }
            return { ...element, product_id: productData }
        });
        try {
            const respData = await Promise.all(samptest)
            // console.log("===========================> d", d)
            return respData
        } catch (error) {
            return null
        }
    }

    // return productDetails


}
const getProductInventoryDetails = async (productData) => {
    console.log('product data---->', productData)

    try {
        const prodData = await productModel.findOne({ _id: productData._id, status: "active" })
        console.log("prodData===========>", prodData)

        const varietyDetail = await varietyModel.findOne({ _id: prodData.variety })
        const originDetail = await originModel.findOne({ _id: prodData.origin })
        const regionDetail = await regionModel.findOne({ _id: productData.region })
        const productDetails = { ...prodData._doc, variety: varietyDetail, origin: originDetail, region: regionDetail }
        console.log("productData", productDetails)

        if (productDetails) {
            const isProductExist = await inventoryProduct.find({ product_id: productData._id })
            const microData = isProductExist[0]
            const nanoData = isProductExist[1]
            console.log("inventory data", isProductExist)
            console.log("seller data", productDetails.seller_id)
            const sellerData = await sellerModel.findOne({ _id: productDetails.seller_id, status: "active" })
            console.log("sellerData", sellerData)
            return {
                ...productDetails,
                seller_profile_id: sellerData.seller_profile_id,
                microData: { lot_id: microData.lot_id, unitPrice: microData.unitPrice, availableStock: microData.availableStock },
                nanoData: { lot_id: nanoData.lot_id, unitPrice: nanoData.unitPrice, availableStock: nanoData.availableStock }
            }
        } else {
            return []
        }
    } catch (error) {
        console.log("error from product inventory details", error)
        return false
    }

}

const getOrderItems = async (requestedData) => {
    try {
        console.log("requestedData", requestedData)
        requestedData.items.forEach(async (itemData) => {
            // lot name - lot id
            // const lotName = itemData.
            // product id - inventory 
            const lotID = await lotModel.findOne({ lotName: itemData.lot })
            // get the existing product inventory value
            const productData = await inventoryProduct.findOne({ product_id: itemData.productId, lot_id: lotID })
            // convert unit to number
            const unit = parseInt(itemData.unit)
            // quantity
            const quantity = itemData.productQuantity
            // outstock = unit * quantity
            const orderOutStock = unit * quantity
            console.log("orderOutStock", orderOutStock)
            // outStock
            const outStock = productData.outStock + orderOutStock
            console.log("outStock", outStock)
            const availableStock = productData.totalStock - outStock
            console.log("availableStock", availableStock)
            await inventoryProduct.findOneAndUpdate({ product_id: itemData.productId, lot_id: lotID }, { outStock: outStock, availableStock: availableStock })

        })
        return true
    } catch (error) {

    }

}
const functionResponse = async (requestData) => {
    console.log("requested data", requestData)
    const { event, data } = requestData;
    switch (event) {
        case "GET_PRODUCT_DETAILS":
            const responseBack = await getProductDetails(data)
            console.log("response back from product", responseBack)
            return responseBack
        case "GET_PRODUCT_INVENTORY":
            const productResponse = await getProductInventoryDetails(data)
            return productResponse
        case "GET_ORDER_DATA":
            const orderResponse = await getOrderItems(data)
            console.log("orderResponse", orderResponse)
            return orderResponse

    }

}
// here write the logic
const observerConsumeCallback = async (msg, channel) => {
    // console.log("🚀  file: rabbitmq.js  line 128  channel.consume  msg received from other service", msg)
    // if we have content in msg object
    if (msg.content) {


        // receiving data from other service
        // data is in string formate, so convert it into javascript object
        const convertedData = JSON.parse(msg.content)
        console.log("data from other service ", convertedData);
        // convertedData object contains {event,payload}
        const { event, payload } = convertedData
        const responseData = await functionResponse(convertedData)
        console.log("response back to request", responseData)
        let data = null



        // response payload
        // convert the payload to string
        const responsePayload = JSON.stringify({ payload: responseData })
        // send response to same client/queue who request.
        channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(responsePayload),
            {
                correlationId: msg.properties.correlationId
            }
        )
        // acknowledge
        channel.ack(msg)
    }
}

// observe
// other service will send request
const RPCObserver = async (RPC_QUEUE_NAME) => {
    try {
        console.log("inside product rpc observer", RPC_QUEUE_NAME)
        // get channel
        const channel = await getChannel();
        // assertQueue is an declaration of queue
        channel.assertQueue(RPC_QUEUE_NAME, { durable: false })
        // prefetch value is used to specify how many messages are being sent at the same time.
        // Messages in RabbitMQ are pushed from the broker to the consumers. 
        channel.prefetch(1)
        // consume
        channel.consume(
            RPC_QUEUE_NAME,
            (msg) => { observerConsumeCallback(msg, channel) },
            { noAck: false }
        )
    } catch (error) {
        console.log("🚀  file: rabbitmq.js  line 156  RPCObserver  error", error)
    }
}

// request
// send data to other services
const RPCRequest = async (RPC_QUEUE_NAME, payload) => {
    try {
        // generate a random uniqueID
        const uuid = uuid4()
        // get channel
        const channel = await getChannel()
        console.log("---------------->")
        // assert queue
        const q = await channel.assertQueue("", { exclusive: true })
        // convert payload to string
        const convertedPayload = JSON.stringify(payload)
        // send data to other service
        channel.sendToQueue(
            RPC_QUEUE_NAME,
            Buffer.from(convertedPayload),
            {
                replyTo: q.queue,
                correlationId: uuid
            }
        )
        // get the reponse
        return new Promise((reslove, reject) => {
            // consume
            channel.consume(
                q.queue,
                (msg) => {
                    if (msg.properties.correlationId == uuid) {
                        // console.log("=== ", JSON.parse(msg.content.toString()))
                        const responseData = JSON.parse(msg.content.toString())
                        console.log("response data ", JSON.parse(msg.content.toString()))
                        reslove(responseData)
                        // const responseData = JSON.parse(msg.content.toString());
                        // reslove(responseData)
                        // reslove(JSON.parse(msg.content.toString()))
                    } else {
                        reject("data not found")
                    }
                },
                {
                    noAck: true
                }
            )
        })
    } catch (error) {
        console.log("🚀  file: rabbitmq.js  line 202  RPCRequest  error", error)
    }
}

module.exports = {
    RPCObserver,
    RPCRequest
}










