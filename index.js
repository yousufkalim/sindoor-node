/**
 * SINDOOOR Project
 * @author Yousuf Kalim
 * @codeBY Shuja Naqvi
 */
require("dotenv").config();
const app = require("express")();
const server = require("http").createServer(app);
const Chats = require("./models/chats");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
module.exports=io;

const port = process.env.PORT || 5000;
require("./database");

// Middleware
require("./middleware/common")(app);

// API Routes
app.use("/api", require("./routes"));

// Server
server.listen(port, () => {
  console.log(`Server is running at port ${port} :)`);
});

io.on("connection", (socket) => {
  try {
    console.log("Connection created", socket.id);
    socket.on("send-chat-message", async (data) => {
      let chat_info = data.chat_info;
      let id = data.id;
      console.log(id);
      let findchat = await Chats.findByIdAndUpdate(id, {
        $push: { chat_info: chat_info },
      });
      if (findchat) {
        console.log(findchat, "CHAT INFO");
        socket.broadcast.emit(`listener${data.to}`, {
          Message: chat_info,
        });
        console.log(chat_info.Text);
      } else {
        console.log("invalid chat key");
      }
    });
  } catch (error) {
    console.log(error.message);
  }
});
