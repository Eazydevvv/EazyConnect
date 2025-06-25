
import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (request, response, next) => {
    try {
        const { searchTerm } = request.body;

        if (searchTerm === undefined || searchTerm === null) {
            return response.satus(400).send("searchItem is required.")
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"

        );

        const regex = new RegExp(sanitizedSearchTerm, "i");

        const contacts = await User.find({
            $and: [
                { _id: { $ne: request.userId } },
                {
                    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
                },
            ],
        });

        return response.status(200).json({ contacts });

        return response.status(200).send("Logout successful");
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }

};

export const getContactForDmList = async (request, response, next) => {
    try {
        let { userId } = request;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([  // Fixed: aggregarte → aggregate
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },  // Added $ prefix
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" }
                }
            },
            {
                $lookup: {
                    from: "users",  // Removed $ prefix
                    localField: "_id",  // Fixed: localFiled → localField
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {  // Fixed: $projects → $project
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color"
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        return response.status(200).json({ contacts });
    } catch (error) {
        console.error("Aggregation error:", error);  // More detailed logging
        return response.status(500).json({ 
            error: "Failed to fetch contacts",
            details: error.message 
        });
    }
};