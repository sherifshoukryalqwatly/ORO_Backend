import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from "cookie-parser";
import routes from './routes/index.js';
import { requestLogger } from "./middlewares/logger.middleware.js";
// import { swaggerSetup } from "./config/swagger.config.js";
import ApiError from './utils/ApiError.js';
import "./config/google_passport.js";       
const app = express();

// Security Middlewares
app.use(cors());
// ✅ Parse JSON bodies
app.use(express.json());

// ✅ Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(requestLogger);

//cookie-parser
app.use(cookieParser());

// Passport
app.use(passport.initialize());
 
// Routes
app.use("/api", routes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ status: "fail", message: "Route not found" });
});

// Global error handler (must be **last**)
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: err.httpStatusText,
            message: err.message
        });
    }

    console.error(err); // Unexpected errors
    res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    });
});

// Swagger Docs
// swaggerSetup(app);


export default app;