"use server"

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"
import User from "../database/models/user.model";
import Image from "../database/models/image.model";

// Add image to DB
export async function addImage({image, userId, path}: AddImageParams) {
    try {
        await connectToDatabase();

        // Get the image's author
        const author = await User.findById(userId)

        if(!author) {
            throw new Error("User not found")
        }

        const newImage = await Image.create({
            ...image,
            author: author._id
        })

        // Allow us to show new image that was created
        revalidatePath(path)

        return JSON.parse(JSON.stringify(newImage))
    } catch (error) {
        handleError(error)
    }
}

// Update image
export async function updateImage({image, userId, path}: UpdateImageParams) {
    try {
        await connectToDatabase();

        // Allow us to show new image that was created
        revalidatePath(path)

        return JSON.parse(JSON.stringify(image))
    } catch (error) {
        handleError(error)
    }
}

// Delete image
export async function deleteImage(imageid: string) {
    try {
        await connectToDatabase();

        // Allow us to show new image that was created
        revalidatePath(path)

        return JSON.parse(JSON.stringify(image))
    } catch (error) {
        handleError(error)
    }
}

// Get image by ID
export async function getImageById(imageId: string) {
    try {
        await connectToDatabase();

        // Allow us to show new image that was created
        revalidatePath(path)

        return JSON.parse(JSON.stringify(image))
    } catch (error) {
        handleError(error)
    }
}