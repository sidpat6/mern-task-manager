const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

exports.register = async(req, res, next) =>{
    try{
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            throw new AppError("User already exists", 400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({name, email, password: hashedPassword});
        await user.save();
        res.status(201).json({message: "User registered successfully"});
    }
    catch(err){
        next(err);
    }
};

exports.login = async(req, res, next) =>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            throw new AppError("Invalid credentials", 401);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            throw new AppError("Invalid credentials", 401);
        }
        const token = jwt.sign(
            { id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" }
        );
        res.json({ token });
    }
    catch(err){
        next(err);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user){
            throw new AppError("User not found", 404);
        } res.json(user);
    }
    catch(err){
        next(err);
    }
};

exports.changePassword = async(req, res, next) =>{
    try {
        const {oldPassword, newPassword} = req.body;
        const user = await User.findById(req.userId);
        if (!user){
            throw new AppError("User not found", 404);
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch){
            throw new AppError("Old password is incorrect", 400);
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password updated successfully" });
    } 
    catch(err){
        next(err);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({name, email, password: hashedPassword, role});
        await user.save();
        res.status(201).json({ message: "User created" });
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.userId, {dob: req.body.dob, phone: req.body.phone
        });
        res.json({ message: "Profile updated" });
    } catch (err) {
        next(err);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        next(err);
    }
};