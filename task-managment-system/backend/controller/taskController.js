import Task from '../model/task.js';
export const createTask = async(req, res, next) => {
    try {
            const task = await Task.create({
              ...req.body,
              createdBy: req.user._id,
            });
        res.status(201).json(task);

    } catch (error) {
        next(error)
    }
}

export const getMyTask = async(req, res, next) => {
    try {
        const task = await Task.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        if (!task) return res.status(404).send("not found task");
        res.json(task);
    } catch (error) {
        next(error)
    }
}
export const updateTask = async(req, res, next) => {
    try {
        const task = await Task.findOneAndUpdate(
          { _id: req.params.id, createdBy: req.user._id },
          req.body,
          { returnDocument: true },
        );
        if(!task) return res.status(404).json({message:"Task not found"})
        res.json({message:"Updated successfully",task})
    } catch (error) {
        next(error)
    }
}

export const deleteTask = async (req, res, next) => {
    try {
            const task = await Task.findOneAndDelete({
              _id: req.params.id,
              createdBy: req.user._id,
            });
            if(!task) return res.status(404).json({message:"Task not found"})
   
             res.json({message:"Deleted Successfuly"})   
    } catch (error) {
        next(error)
    }
}