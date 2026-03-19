const Todo = require("../models/Todo");
const mongoose = require('mongoose');

exports.deleteTodo = async(req,res) => {
    try{
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Invalid ID"
                }
            );
        }
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Todo not found"
                }
            );
        }
        res.status(200).json(
            {
                success:true,
                message:"Todo deleted successfully"
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
