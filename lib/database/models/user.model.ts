// clerkId, email, username, photo, firstName, lastName, planId, creditBalance
import {Schema, models, model, Document} from "mongoose";

export interface IUser extends Document {
    clerkId: string;
    email: string;
    username: string;
    photo?: string; // facultatif
    firstName: string;
    lastName: string;
    planId?: string; // facultatif
    creditBalance?: number; // facultatif
}

const UserSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        required: true
    },
    firstName: {type: String},
    lastName: {type: String},
    planId: {type: Number},
    creditBalance: {
        type: Number,
        default: 10
    },
})

const User = models?.User || model('User', UserSchema);

export default User