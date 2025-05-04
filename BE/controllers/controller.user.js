const userRepository = require("../repositories/repository.user.js");
const baseResponse = require("../utils/baseResponse.js");
const {validateUserInput} = require('../utils/validator.js');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        baseResponse(res, true, 200, "Retrieving all users success", users);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Internal server error", null);
    }
};

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.query;
    
    if (!name || !email || !password) {
        return baseResponse(res, false, 400, "Bad request, missing parameters", null);
    }

    const validation = validateUserInput(name, email, password);
    if (!validation.valid) return baseResponse(res, false, 400, validation.message, null);
    
    try {
        const existingUser = await userRepository.getUserbyEmail(email);
        if (existingUser) {
            return baseResponse(res, false, 400, "Email already used", null);
        }

        const user = await userRepository.registerUser({ name, email, password });
        baseResponse(res, true, 201, "User created successfully", user);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Internal server error", null);
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.query;

    if (!email || !password) {
        return baseResponse(res, false, 400, "Bad request, email and password are required", null);
    }

    try {
        const user = await userRepository.getUserbyEmail(email);

        if (!user) {
            return baseResponse(res, false, 400, "Invalid email or password", null);
        }
        console.log("Input password:", password);
        console.log("Password from DB:", user.password);
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return baseResponse(res, false, 401, "Incorrect password", null);

        return baseResponse(res, true, 200, "Login success", user);
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Internal server error", null);
    }
};

exports.updateUserbyID = async (req, res) => {
    const { id, name, email, password } = req.body;

    if (!id || !name || !email || !password) {
        return baseResponse(res, false, 400, "Bad request, missing parameters", null);
    }

    try {
        const updatedUser = await userRepository.updateUserbyID({ id, name, email, password });
        if (!updatedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "User updated successfully", updatedUser);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Internal server error", null);
    }
};

exports.deleteUserID = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return baseResponse(res, false, 400, "Bad request, ID is required", null);
    }

    try {
        const deletedUser = await userRepository.deleteUserID(id);
        if (!deletedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "User deleted successfully", deletedUser);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Internal server error", null);
    }
};

exports.getUserbyEmail = async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return baseResponse(res, false, 400, "Bad request, email is required", null);
    }

    try {
        const user = await userRepository.getUserbyEmail(email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        baseResponse(res, true, 200, "User found", user);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Internal server error", null);
    }
};

exports.topUpBalance = async (req, res) => {
    const { id, amount } = req.query;

    if (!id || !amount) {
        return baseResponse(res, false, 400, "Missing id or amount", null);
    }

    try {
        const updatedUser = await userRepository.topUpBalance(id, parseInt(amount));
        if (!updatedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        return baseResponse(res, true, 200, "Top up successful", updatedUser);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, "Internal server error", null);
    }
};