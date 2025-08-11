const {getAiGeneratedMessage} = require("../utils/ai.js");


module.exports.generateMessage = async (req, res) => {
    const {currUserName, toUserName, messages, tone, request} = req.body;

    const formatChatHistory = (messages) => {
        return messages.map(msg => `${(msg.from == req.user_id) ? currUserName : toUserName}: ${msg.message}`).join("\n");
    }

    const previousMessages = formatChatHistory(messages);

    const content = `Recent messages: \n${previousMessages} \n\nRequesting user: ${currUserName} \n\nTone: ${tone} \n\nIntent: ${request}`

    try {
        const generatedMessage =  await getAiGeneratedMessage(content, "llama-3.3-70b-versatile");

        res.status(200).json({message: generatedMessage});
    } catch(err) {
        res.status(500).json({message: "Internal Server Error!"});
    }
}