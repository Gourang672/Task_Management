import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/config.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import UserRouter from "./src/routes/User.route.js";
import TaskRouter from "./src/routes/Task.route.js";
import { errorHandler } from "./src/middleware/error.middleware.js";

dotenv.config();

const app = express();
connectDB(process.env.MONGODB_URI);


const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});


app.use(helmet());
app.use(rateLimiter);

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.ORIGIN;
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/users", UserRouter);
app.use("/tasks", TaskRouter);



app.get("/", (req, res) => {
  res.send("Welcome to the Task Management API!");
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
