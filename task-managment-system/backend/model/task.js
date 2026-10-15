import mongoose from "mongoose";
const { Schema } = mongoose;
const taskSchema = Schema({
    title: { type: String, required: true },
    description: String,
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed'],
        default :'pending'
    },
    dueDate: Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
        
    },
}, { timestamps: true })

export default mongoose.model('Task', taskSchema);