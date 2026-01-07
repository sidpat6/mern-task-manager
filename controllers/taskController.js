const Task = require("../models/Task");
const AppError = require("../utils/AppError");

exports.createTask = async (req, res, next) => {
    try{
        const task = new Task({title: req.body.title, userId: req.userId});
        await task.save();
        res.status(201).json(task);
    } catch(err){
        next(err);
    }
};

exports.getTasks = async(req, res, next) => {
    try{
        const page = Number(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        const tasks = await Task.find({userId: req.userId,isDeleted: false})
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
        
        res.json(tasks);
    }
    catch(err) {
        next(err);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) throw new AppError("Task not found", 404);
        if (task.userId.toString() !== req.userId)
            throw new AppError("Unauthorized access", 403);
        task.status = req.body.status || task.status;
        await task.save();
        res.json(task);
    } catch (err) {
        next(err);
    }
};

exports.deleteTask = async(req, res, next) => {
    try{
        const task = await Task.findById(req.params.id);

        if (!task) throw new AppError("Task not found", 404);
        if (task.userId.toString() !== req.userId)
            throw new AppError("Unauthorized access", 403);
        task.isDeleted = true;
        await task.save();

        res.json({ message: "Task deleted" });
    } catch (err) {
        next(err);
    }
};
