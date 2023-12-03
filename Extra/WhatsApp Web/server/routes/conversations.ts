import { Router } from "express";
import Conversation from "../models/Conversation";

const router = Router();

router.get("/", async (req, res) => {
  const conversations = await Conversation.find({});
  res.json(conversations);
});

router.put("/add", async (req, res) => {
  const { newConversation } = req.body;
  const conversationResult = await (
    await Conversation.create(newConversation)
  ).save();

  if (conversationResult) {
    res.json(conversationResult);
  } else {
    res
      .status(500)
      .send("An error occured while trying to add a new conversation");
  }
});

router.put("/cleanMessages", async (req, res) => {
  const { conversationID } = req.body;
  let updateResult = await Conversation.updateOne(
    { _id: conversationID },
    {
      $set: {
        messages: [],
      },
    }
  );

  if (updateResult) {
    res.json(updateResult);
  } else {
    res
      .status(500)
      .send("An error occured while trying to clean conversation messages");
  }
});

router.put("/delete", async (req, res) => {
  const { conversationID } = req.body;
  let deleteResult = await Conversation.deleteOne({ _id: conversationID });

  if (deleteResult) {
    res.json(deleteResult);
  } else {
    res
      .status(500)
      .send("An error occured while trying to delete conversation");
  }
});

export default router;
