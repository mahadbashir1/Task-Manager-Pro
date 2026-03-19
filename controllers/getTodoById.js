const Todo = require("../models/Todo");
const mongoose = require('mongoose');

exports.getTodoById = async(req,res) => {
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
        const todo = await Todo.findById({_id: req.params.id});
        res.status(200).json(
            {
                success:true,
                data:todo,
                message:"Data fetched successfully"
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