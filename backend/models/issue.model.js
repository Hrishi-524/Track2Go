import mongoose from "mongoose"
import { Schema } from "mongoose"

const issueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: 'Repository',
        required: true
    },
    assignees: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    labels: [{
        type: String,
    }],
    milestone: [{//future implementataion not intended right now
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const Issue = mongoose.model('Issue', issueSchema)
export default Issue