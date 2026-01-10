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
    }]
})

const Issue = mongoose.model('Issue', issueSchema)
export default Issue