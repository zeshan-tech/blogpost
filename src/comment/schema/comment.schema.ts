import { Schema, model } from 'mongoose';
import { baseSchema } from "../../base/base.schema";

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    ...baseSchema
});

commentSchema.pre('findOneAndDelete', async function (next) {
    try {
        const currentCommentId = await this.getQuery()._id;

        const commentModel = this.model.db.model('Comment');
        await commentModel.deleteMany({ parentComment: currentCommentId });

        next();
    } catch (error) {
        throw new Error(error);
    }
});

const Comment = model('Comment', commentSchema);

export default Comment;
