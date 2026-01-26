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
        required: true
    }, 
    description: {
        type: String
    },
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

repositorySchema.index({ owner: 1, name: 1 }, { unique: true })

const Repository = mongoose.model('Repository', repositorySchema)
export default Repository