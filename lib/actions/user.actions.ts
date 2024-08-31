"use server"

import { revalidatePath } from "next/cache"

import User from "../database/models/user.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"

// CREATE
export async function createUser(user: CreateUserParams) {
    try {
        // Connect to the database, as we are in a serverless architecture
        await connectToDatabase();

        // Create a new user : we use the .creat() method on the User model, passing the user params as props coming from front-end
        const newUser = await User.create(user);

        return JSON.parse(JSON.stringify(newUser))
    } catch (error) {
        handleError(error)
    }
}

// READ USER DETAILS
export async function getUserById (userId: string) {
    try {
        await connectToDatabase();

        // Find the user w/ the clerkId
        const user = await User.findOne({clerkId: userId});
        // If user doesn't exist
        if (!user) throw new Error("User not found")
        
        return JSON.parse(JSON.stringify(user))
    } catch (error) {
        handleError(error)
    }
}

// DELETE
export async function deleteUser(clerkId: string) {
    try {
        await connectToDatabase();

        // Find user to delete
        const userToDelete = await User.findOne({clerkId});

        if(!userToDelete) throw new Error('User not found')

        const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        revalidatePath('/')

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
    } catch (error) {
        handleError(error)
    }
}