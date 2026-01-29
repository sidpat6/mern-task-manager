const Task = require("../models/Task");
const AppError = require("../utils/AppError");

exports.createTask = async (req, res, next) => {
    try {
        const task = new Task({
            title: req.body.title,
            userId: req.user.role === "superadmin" && req.body.userId? req.body.userId: req.userId
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
};

exports.getTasks = async (req, res, next) => {
    try {
        const filter = { isDeleted: false };
        if (req.user.role === "staff") {
            filter.userId = req.userId;
        }
        const tasks = await Task.find(filter).populate("userId", "name email").sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        next(err);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) throw new AppError("Task not found", 404);
        if (
            task.userId.toString() !== req.userId.toString() &&
            req.user.role === "staff"
        ) {
            throw new AppError("Unauthorized", 403);
        }
        if (req.body.status) {
            task.status = req.body.status;
        }
        await task.save();
        res.json(task);
    } catch (err) {
        next(err);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) throw new AppError("Task not found", 404);
        task.isDeleted = true;
        await task.save();
        res.json({ message: "Task deleted" });
    } catch (err) {
        next(err);
    }
};