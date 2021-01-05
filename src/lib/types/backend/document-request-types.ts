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
    deletedBy: Mongoose.Types.ObjectId | string;
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

/**
 * Upload attachment request type
 */
export type UploadAtatchmentRequestType = {
    docId: Mongoose.Types.ObjectId | string;
    createdBy: Mongoose.Types.ObjectId | string;
    file: Express.Multer.File | null;
    category: string;
    tags: Array<string>;
    description?: string;
    fileData?: {
        originalName: string;
        fileName: string;
        size: number;
    };
};
