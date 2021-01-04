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

/**
 * Add document-meta request type
 */
export type AddDocumentMetaRequestType = {
    docId: Mongoose.Types.ObjectId | string;
    metaId?: Mongoose.Types.ObjectId | string;
    key: string;
    value: object;
    createdBy: Mongoose.Types.ObjectId | string;
};
