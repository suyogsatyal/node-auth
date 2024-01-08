const express = require("express");
const authRouter = express.Router();
import { error } from "console";
import { LoginFormData, ApiResponse, User } from "../../utils/interface";
const axios = require("axios");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcryptjs");
const dbPath = path.join(__dirname, "../../db", "database.db");
const db = new sqlite3.Database(dbPath);
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const backendURL = process.env.REACT_APP_BACKEND_URL;

const {
    authenticateToken,
    authenticateAdmin,
} = require("../middlewares/authMiddleware");

authRouter.post("/signup", async (req: any, res: any) => {
    console.log("try");
    try {
        const newUser: LoginFormData = req.body;

        // Fetch user data and admin count from external API
        const usersResponse = await axios.get(backendURL + "/users");
        const countResponse = await axios.get(backendURL + "/count");

        const adminsCount: number = countResponse.data.admins;
        const userList: User[] = usersResponse.data.users;

        // Check if the username already exists
        const usernameExists = userList.some(
            (user) => user.username === newUser.username
        );

        // Declare the SQL query outside of the if-else statement
        const insertUserSql =
            "INSERT INTO users (username, password_hash, admin_access, contributor_access, viewer_access) VALUES (?, ?, ?, ?, ?)";

        if (usernameExists) {
            const errorResponse: ApiResponse = {
                success: false,
                status: 400,
                message: "Username already exists",
            };
            console.log(errorResponse);
            return res.status(errorResponse.status).json(errorResponse);
        } else {
            // Username is unique, proceed with user creation
            const salt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(newUser.password, salt);

            // Determine admin access based on admin count
            const isAdmin = adminsCount === 0 ? 1 : 0;
            const isContributor = adminsCount === 0 ? 1 : 0;

            // Prepare parameters for SQL query
            const params = [
                newUser.username,
                passwordHash,
                isAdmin,
                isContributor,
                1,
            ];

            // Insert new user into the database
            db.run(insertUserSql, params, function (this: any, err: any) {
                if (err) {
                    console.error(`*****\nError: ${err}`);
                    const errorResponse: ApiResponse = {
                        success: false,
                        status: 500,
                        message: "Internal Server Error",
                    };
                    return res.status(errorResponse.status).json(errorResponse);
                }
                const successResponse: ApiResponse = {
                    success: true,
                    status: 201,
                    message: `User ${newUser.username} created successfully`,
                };
                return res.status(successResponse.status).json(successResponse);
            });
        }
    } catch (error: any) {
        console.error(error);
        const errorResponse: ApiResponse = {
            success: false,
            status: 500,
            message: "Internal Server Error",
        };
        return res.status(errorResponse.status).json(errorResponse);
    }
});

authRouter.post("/login", async (req: any, res: any) => {
    try {
        const loginAttempt: LoginFormData = req.body;
        const userDetailURL = backendURL + "/user/" + loginAttempt.username;
        const userResponse = await axios.get(userDetailURL);
        const userDetails = userResponse.data.data;
        const userData: LoginFormData = {
            username: userDetails.username,
            password: userDetails.password_hash,
        };

        const correctPassword: boolean = bcrypt.compareSync(
            loginAttempt.password,
            userData.password
        );

        if (correctPassword) {
            const isAdmin = userDetails ? userDetails.admin_access === 1 : false;
            const isContributor = userDetails
                ? userDetails.contributor_access === 1
                : false;
            const isViewer = userDetails ? userDetails.viewer_access === 1 : false;
            const tokenData = {
                username: userData.username,
                isAdmin,
                isContributor,
                isViewer,
            };
            const token = jwt.sign(tokenData, jwtSecret, { expiresIn: "1h" });
            const successResponse: ApiResponse = {
                success: true,
                status: 200,
                data: { token, userDetails },
            };
            return res.status(successResponse.status).json(successResponse);
        } else {
            const errorResponse: ApiResponse = {
                success: false,
                status: 401,
                message: "Invalid username or password",
            };
            console.log(errorResponse);
            return res.status(errorResponse.status).json(errorResponse);
        }
    } catch (error: any) {
        console.error(error);
        const errorResponse: ApiResponse = {
            success: false,
            status: 500,
            message: "Internal Server Error",
        };
        return res.status(errorResponse.status).json(errorResponse);
    }
});

authRouter.post("/dashboard", authenticateAdmin, async (req: any, res: any) => {
    try {
        const decoded = res.locals.user;
        const response = await axios.get(backendURL + "/allData");
        const dashboardData = response.data.data;
        

        console.log(dashboardData);
        const successResponse: ApiResponse = {
            success: true,
            status: 200,
            data: dashboardData,
        };
        return res.status(successResponse.status).json(successResponse);
    } catch (error: any) {
        console.error(error);
        const errorResponse: ApiResponse = {
            success: false,
            status: 500,
            message: "Internal Server Error",
        };
        return res.status(errorResponse.status).json(errorResponse);
    }
});

authRouter.post("/relogin", authenticateToken, async (req: any, res: any) => {
    try {
        const decoded = res.locals.user;
        const userDetailURL = backendURL + "/user/" + decoded.username;
        const userResponse = await axios.get(userDetailURL);
        const userDetails = userResponse.data.data;
        // console.log(userDetails)
        if (userDetails) {
            const successResponse: ApiResponse = {
                success: true,
                status: 200,
                data: userDetails,
            };
            console.log("success");
            return res.status(successResponse.status).json(successResponse);
        }
    } catch (error: any) {
        console.error(error);
        if (axios.isAxiosError(error)) {
            // Handle Axios-specific errors
            // You can access error.response for more details
        } else {
            console.error(error);
            const errorResponse: ApiResponse = {
                success: false,
                status: 500,
                message: "Internal Server Error",
            };
            return res.status(errorResponse.status).json(errorResponse);
        }
        const errorResponse: ApiResponse = {
            success: false,
            status: 500,
            message: "Internal Server Error",
        };
        console.log(errorResponse);
        return res.status(errorResponse.status).json(errorResponse);
    }
});

export default authRouter;
