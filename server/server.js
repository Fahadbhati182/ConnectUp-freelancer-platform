import express, { urlencoded } from "express";
import "dotenv/config.js";
import http from "http";
import cors from "cors";
import connectDB from "./src/lib/connectDB.js";
import userRouter from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import gigRouter from "./src/routes/gig.routes.js";
import orderRouter from "./src/routes/order.route.js";
import reviewRouter from "./src/routes/review.routes.js";
import { Server } from "socket.io";
import messageRouter from "./src/routes/message.routes.js";




await connectDB();

const app = express();
const server = http.createServer(app);



//? socket.io for chatting
export const io = new Server(server, {
  cors: { origin: "*" },
});

export const userSocketMap = {}; //* {userId:socketId}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", socket.id);

  if (userId) userSocketMap[userId] = socket.id;

  socket.on("disconnect", () => {
    console.log("User Disconnected");
    delete userSocketMap[userId];
  });
});



app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(cors({ origin: ["https://connectup-freelancer-platform-2.onrender.com","https://connectup-freelancer-platform-4.onrender.com"], credentials: true }));

app.use("/api/user", userRouter);
app.use("/api/gig", gigRouter);
app.use("/api/orders", orderRouter);
app.use("/api/review", reviewRouter);
app.use("/api/message", messageRouter);



app.use((req, res, next) => {
  res.status(404).json({ message: "Server is down" });
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});


const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port${PORT}`);
});
