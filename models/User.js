const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role: {type: String, enum: ["superadmin", "principal", "staff"], default: "staff"},
        dob: { type: Date },
        phone: { type: String }
    },
    {timestamps: true}
);
module.exports = mongoose.model("User", userSchema);