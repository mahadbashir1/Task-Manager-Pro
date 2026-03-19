const Todo = require("../models/Todo");
const mongoose = require('mongoose');

exports.updateTodo = async(req,res) => {
    try{
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json
            (
                {
                    success: false,
                    message: "Invalid ID"
                }
            );
        }
        const todo = await Todo.findByIdAndUpdate({_id: req.params.id}, {title: req.body.title, description: req.body.description, updatedAt: Date.now()}, {new: true, runValidators: true});
        res.status(200).json(
            {
                success:true,
                data:todo,
                message:"Data updated successfully"
            }
        );
    }
    catch(err){
        console.error(err);
        res.status(500).json(
            {
                success:false,
                data:"Internal server error",
                message:err.message
            }
        )
    }
}