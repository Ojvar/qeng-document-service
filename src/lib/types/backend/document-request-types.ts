import Mongoose from "mongoose";

/**
 * Create document request type
 */
export type CreateDocumentRequestType = {
    category: string;
    owner: Mongoose.Types.ObjectId | string;
};

/**
 * Archive document request type
 */
export type ArchiveDocumentRequestType = {
    id: string;
    userId: Mongoose.Types.ObjectId | string;
};

/**
 * ArchiveMeta document request type
 */
export type ArchiveDocumentMetaRequestType = {
    docId: Mongoose.Types.ObjectId | string;
    metaId: Mongoose.Types.ObjectId | string;
    userId: Mongoose.Types.ObjectId | string;
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
