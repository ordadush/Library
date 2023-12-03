import mongoose from "mongoose";
import keys from "../config/dev";

export default () => {
  const connect = () => {
    mongoose
      .connect(keys.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        return console.info(`Successfully connected to mongo`);
      })
      .catch((err) => {
        console.error(`Error connecting to database :`, err);
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on("disconnected", connect);

  return mongoose.connection;
};
