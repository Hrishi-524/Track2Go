import mongoose from "mongoose"
import { Schema } from "mongoose"

const repositorySchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    }, 
    description: {
        type: String
    },
    content: [{
        path: { type: String, required: true },
        size: { type: Number, required: true },
        lastModified: { type: Date, required: true }
    }],
    visibility: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Public'
    },
    issues: [{
        type: Schema.Types.ObjectId,
        ref: 'Issue'
    }]
})

const Repository = mongoose.model('Repository', repositorySchema)
export default Repository