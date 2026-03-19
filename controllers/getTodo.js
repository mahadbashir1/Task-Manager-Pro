const Todo = require("../models/Todo");

exports.getTodo = async(req,res) => {
    try{
        const todos = await Todo.find({});
        res.status(200).json(
            {
                success:true,
                data:todos,
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