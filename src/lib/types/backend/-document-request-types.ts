import Mongoose from "mongoose";

/**
 * Create document request type
 */
export type CreateDocumentRequestType = {
    category: string;
    owner: Mongoose.Types.ObjectId;
};

/**
 * Archive document request type
 */
export type ArchiveDocumentRequestType = {
    id: string;
    userId: string;
};
