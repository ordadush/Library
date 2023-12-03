import { Router } from "express";
import Message from "../models/Message";
import Conversation, { IConversation } from "./../models/Conversation";

const router = Router();

router.get("/", async (req, res) => {
  const messages = await Message.find({
    deletedBy: { $ne: req.query.userMobile?.toString() },
  });
  res.json(messages);
});

router.put("/saveMessage", async (req, res) => {
  let { newMessage } = req.body;

  const conversationID = newMessage.conversationID;
  delete newMessage.conversationID;

  // First save new message to "messages" collection and then add it to conversation messages.
  const messageResult = await (await Message.create(newMessage)).save();
  if (messageResult) {
    const conversationResult = await Conversation.findOne({
      _id: conversationID,
    });

    if (conversationResult) {
      conversationResult.messages.push(messageResult._id.toString());
      await conversationResult.save();
    } else {
      res
        .status(500)
        .send("An error occured while trying add new message to conversation");
    }

    res.json(messageResult);
  } else {
    res.status(500).send("An error occured while trying to add a new message");
  }
});

router.put("/deleteMessage", async (req, res) => {
  const { messageID, userMobile } = req.body;

  let updateResult = await Message.updateOne(
    { _id: messageID },
    {
      $push: {
        deletedBy: userMobile,
      },
    }
  );

  if (updateResult) {
    res.json(updateResult);
  } else {
    res.status(500).send("An error occured while trying to delete a message");
  }
});

router.put("/updateMessage", async (req, res) => {
  let { message } = req.body;

  let updateResult = await Message.updateOne({ _id: message._id }, message);

  if (updateResult) {
    res.json(updateResult);
  } else {
    res.status(500).send("An error occured while trying to update a message");
  }
});

export default router;
