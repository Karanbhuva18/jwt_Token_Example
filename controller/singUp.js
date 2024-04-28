const user = require('../model/userSchema');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken')
require("dotenv").config()
exports.signup = async (req, res) => {
    try {
        const { name, city, email, password } = req.body;
        const existingUser = await user.findOne({ email });

        if (existingUser) {
             res.status(401).json({
                success: false,
                message: "Email ID already exists. Please go to the login page."
            });
        }

        let hashPassword;
        try {
            hashPassword = await bcrypt.hash(password, 10);
        } catch (error) {
             res.status(500).json({
                success: false,
                message: "Error in hashing password."
            });
        }

        const response = await user.create({ name, city, email, password: hashPassword });

         res.status(201).json({
            success: true,
            userdata: response,
            message: "User signed up successfully."
        });
    } catch (error) {
        console.log(error);
         res.status(401).json({
            success: false,
            message: "Error in signup."
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const existinguser = await user.findOne({ email });
        if (!existinguser || existinguser === undefined) {
            return res.status(401).json({
                success: false,
                message: "You are not an existing user, go to the signup page."
            });
        }

        const payload = {
            email: existinguser.email,
            id: existinguser.id,
            city: existinguser.city
        };

        if (await bcrypt.compare(password, existinguser.password)) {
            const token = jwt.sign(payload, process.env.secret_key, {
                expiresIn: "2h"
            });

            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            let userToUpdate = existinguser.toObject();
            userToUpdate.token = token;
            userToUpdate.password = undefined;

            res.cookie("mytoken", token, option).status(201).json({
                success: true,
                user: userToUpdate,
                token,
                message: "User login successful"
            });
        } else {
            res.status(403).json({
                success: false,
                message: "Password incorrect"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({
            success: false,
            message: "Error in user login"
        });
    }
};
