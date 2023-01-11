/**
 ** SINDOOR Backend
 * @author Yousuf Kalim
 * @author Najam Ul Saqib
 */
require("dotenv").config();
const app = require("express")();
const port = process.env.PORT || 5000;

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let usr="yousuf"

require("./database");

//* Middleware
require("./middleware/common")(app);

//* API Routes
app.use("/api", require("./routes"));

//* Socket
require("./services/sockets")(io);

//* Server
server.listen(port, () => {
  console.log(`Server is running at port ${port} :)`);
});
