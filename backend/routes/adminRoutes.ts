const express = require("express");
const adminRouter = express.Router();
import { UserDataFormat, DashboardDataFormat, LoginFormData, ApiResponse, User } from "../../utils/interface";
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

const organizeUserData = (rawUserData: UserDataFormat[]): DashboardDataFormat => {
    return rawUserData.reduce(
        (acc: DashboardDataFormat, user: UserDataFormat) => {
            if (user.admin_access == 1) {
                acc.admins.push(user);
                console.log('adminPush');
            } else if (user.contributor_access == 1) {
                acc.contributors.push(user);
                console.log('contribPush');
            } else if (user.viewer_access == 1) {
                acc.viewers.push(user);
                console.log('viewerPush');
            } else {
                acc.inactive.push(user);
            }
            return acc;
        },
        { admins: [], contributors: [], viewers: [], inactive: [] } as DashboardDataFormat
    );
};

adminRouter.post("/dashboard", authenticateAdmin, async (req: any, res: any) => {
    try {
        const response = await axios.get(backendURL + "/allUsersData");
        const rawDashboardData = response.data.data;
        console.log(rawDashboardData);

        const dashboardData = organizeUserData(rawDashboardData)
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

adminRouter.post("/editAccess", authenticateAdmin, async (req: any, res: any) => {
    try {
        let adminAccess = 0;
        let contributorAccess = 0;
        let viewerAccess = 0;
        const data = req.body;
        console.log(data);

        if (data.newAccess === 'admin') {
            adminAccess = 1;
            contributorAccess = 1;
            viewerAccess = 1;
        } else if (data.newAccess === 'contributor') {
            contributorAccess = 1;
            viewerAccess = 1;
        } else if (data.newAccess === 'viewer') {
            viewerAccess = 1;
        }
        // console.log(params)
        const params = [adminAccess, contributorAccess, viewerAccess, data.username];
        const editAccessSQL = "UPDATE users SET admin_access = ?, contributor_access = ?, viewer_access = ? WHERE username = ?";

        db.run(editAccessSQL, params, function (this: any, error: any) {
            if (error) {
                console.error(error);
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
                message: `User ${data.username} access changed to ${data.newAccess} successfully.`,
            };
            return res.status(successResponse.status).json(successResponse);
        });
    }
    catch (error: any) {
        console.log("error");
        const errorResponse: ApiResponse = {
            success: false,
            status: 500,
            message: "Internal Server Error",
        };
        return res.status(errorResponse.status).json(errorResponse);
    }
});

adminRouter.post("/relogin", authenticateToken, async (req: any, res: any) => {
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
            // console.log("success");
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

export default adminRouter;
