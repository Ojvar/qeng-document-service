import * as Mongoose from "mongoose";
import {
    DocumentAttachmentType,
    DocumentMetaType,
    DocumentModelType,
    IDocumentModel,
} from "@BE/models/document-model";
import GlobalData from "@Core/Global/global-data";
import {
    AddDocumentMetaRequestType,
    ArchiveAtatchmentRequestType,
    ArchiveDocumentMetaRequestType,
    ArchiveDocumentRequestType,
    CreateDocumentRequestType,
    DownloadAttachmentRequestType,
    UploadAtatchmentRequestType,
} from "@Lib/types/backend/document-request-types";

/**
 * Document Helper class
 */
export default class DocumentHelper {
    private static _documentModel = null;
    public static get DocumentModel(): any {
        if (!this._documentModel) {
            this._documentModel = GlobalData.dbEngine.model("Document");
        }

        return this._documentModel;
    }

    /**
     * Create a new document
     * @param doc CreateDocumentRequestType newDocument data
     */
    public static async createDocument(
        doc: CreateDocumentRequestType
    ): Promise<IDocumentModel> {
        const newDoc = {
            owner: new Mongoose.Types.ObjectId(doc.owner),
            category: doc.category,
            tag: doc.tag,
        } as IDocumentModel;

        const result: IDocumentModel = await this.DocumentModel.create(newDoc);

        return result;
    }

    /**
     * Get document data (Search by doc-data)
     * @param doc CreateDocumentRequestType old-document data
     */
    public static async getDocumentByData(
        doc: CreateDocumentRequestType
    ): Promise<IDocumentModel | null> {
        const condition = {
            owner: new Mongoose.Types.ObjectId(doc.owner),
            category: doc.category,
            tag: doc.tag,
        };

        /* Fetch data */
        const result: IDocumentModel | null = await this.DocumentModel.findOne(
            condition
        );

        return result;
    }

    /**
     * Get document data (Search by id)
     * @param doc (Mongoose.Types.ObjectId | string) DocuemtnId
     */
    public static async getDocumentById(
        docId: Mongoose.Types.ObjectId | string
    ): Promise<IDocumentModel | null> {
        const codition = {
            _id: Mongoose.Types.ObjectId(docId.toString()),
        };
        const result: IDocumentModel | null = await this.DocumentModel.findOne(
            codition
        );

        return result;
    }

    /**
     * Archive an existing document
     * @param doc ArchiveDocumentRequestType newDocument data
     */
    public static async archiveDocument(
        doc: ArchiveDocumentRequestType
    ): Promise<IDocumentModel | null> {
        doc.userId = Mongoose.Types.ObjectId(doc.userId.toString());

<<<<<<< HEAD
        await Document.updateOne(
            {
                _id: Mongoose.Types.ObjectId(doc.id),
            },
            {
                $set: {
                    is_deleted: {
                        deleted_at: new Date(),
                        deleted_by: doc.userId,
                    },
=======
        const condition = {
            _id: Mongoose.Types.ObjectId(doc.id),
        };

        /* Update data */
        await this.DocumentModel.updateOne(condition, {
            $set: {
                is_deleted: {
                    deleted_at: new Date(),
                    deleted_by: doc.userId,
>>>>>>> core_dev
                },
            },
        });

        /* Fetch document data */
        let result: IDocumentModel | null = await this.DocumentModel.findOne(
            condition
        );

        /* Fetch updated data */
        let result = await Document.findOne({
            _id: Mongoose.Types.ObjectId(doc.id),
        });

        return result as IDocumentModel;
    }

    /**
     * Add new-meta data to an existing document
     * @param doc AddDocumentMetaRequestType newDocument data
     */
    public static async addMeta(
        doc: AddDocumentMetaRequestType
    ): Promise<IDocumentModel | null> {
        /* Ensuring of ObjectId data type */
        doc.docId = Mongoose.Types.ObjectId(doc.docId.toString());
        doc.createdBy = Mongoose.Types.ObjectId(doc.createdBy.toString());

<<<<<<< HEAD
        await Document.updateOne(
=======
        /* Update */
        await this.DocumentModel.updateOne(
>>>>>>> core_dev
            {
                _id: doc.docId,
                "meta.key": {
                    $nin: [doc.key],
                },
            },
            {
                $push: {
                    meta: {
                        key: doc.key,
                        value: doc.value,
                        created_by: doc.createdBy,
                        created_at: new Date(),
                    } as DocumentMetaType,
                },
            }
        );

<<<<<<< HEAD
        /* Fetch updated data */
        let result = await Document.findOne({
            _id: Mongoose.Types.ObjectId(doc.docId.toHexString()),
        });

        return result as IDocumentModel;
=======
        /* Fetch document data */
        let result: IDocumentModel | null = await this.DocumentModel.findOne({
            _id: doc.docId,
        });

        return result;
>>>>>>> core_dev
    }

    /**
     * Update meta data of an existing document
     * @param doc AddDocumentMetaRequestType newDocument data
     */
    public static async updateMeta(
        doc: AddDocumentMetaRequestType
    ): Promise<IDocumentModel | null> {
        let result: IDocumentModel | null = null;

        /* Ensuring of ObjectId data type */
        doc.docId = Mongoose.Types.ObjectId(doc.docId.toString());
        doc.metaId = Mongoose.Types.ObjectId(doc.metaId?.toString());
        doc.createdBy = Mongoose.Types.ObjectId(doc.createdBy.toString());

        const curDocument: IDocumentModel | null = (await this.DocumentModel.findOne(
            {
                _id: doc.docId,
                meta: {
                    $elemMatch: {
                        _id: doc.metaId,
                        is_deleted: null,
                    },
                },
            }
        )) as IDocumentModel;

        if (curDocument != null) {
            const index: number = curDocument.meta.findIndex((x: any) =>
                x._id.equals(doc.metaId?.toString())
            );
            const metaKey: DocumentMetaType = curDocument.meta[index];

            /* Add to history list */
            const historyItem: DocumentMetaType = {
                _id: metaKey._id,
                created_at: metaKey.created_at,
                created_by: metaKey.created_by,
                key: metaKey.key,
                value: metaKey.value,
                is_deleted: {
                    deleted_at: new Date(),
                    deleted_by: doc.createdBy,
                },
            } as DocumentMetaType;

            const metaHistory = curDocument?.meta_history || [];
            metaHistory.push(historyItem);

            /* Delete old key */
            curDocument?.meta.splice(index, 1);
            curDocument?.meta.push({
                created_at: new Date(),
                created_by: doc.createdBy,
                key: doc.key,
                value: doc.value,
            } as DocumentMetaType);

            curDocument.meta_history = metaHistory;
            result = await curDocument?.save();
        }

        return result;
    }

    /**
     * Archive meta data of an existing document
     * @param doc AddDocumentMetaRequestType newDocument data
     */
    public static async archiveDocumentMeta(
        doc: ArchiveDocumentMetaRequestType
    ): Promise<IDocumentModel | null> {
        let result: IDocumentModel | null = null;

        /* Ensuring of ObjectId data type */
        doc.docId = Mongoose.Types.ObjectId(doc.docId.toString());
        doc.metaId = Mongoose.Types.ObjectId(doc.metaId?.toString());
        doc.deletedBy = Mongoose.Types.ObjectId(doc.deletedBy?.toString());

        const curDocument: IDocumentModel | null = (await this.DocumentModel.findOne(
            {
                _id: doc.docId,
                meta: {
                    $elemMatch: {
                        _id: doc.metaId,
                        is_deleted: null,
                    },
                },
            }
        )) as IDocumentModel;

        if (curDocument != null) {
            const index: number = curDocument.meta.findIndex((x: any) =>
                x._id.equals(doc.metaId?.toString())
            );
            const metaKey: DocumentMetaType = curDocument.meta[index];

            /* Add to history list */
            const historyItem: DocumentMetaType = {
                _id: metaKey._id,
                created_at: metaKey.created_at,
                created_by: metaKey.created_by,
                key: metaKey.key,
                value: metaKey.value,
                is_deleted: {
                    deleted_at: new Date(),
                    deleted_by: doc.deletedBy,
                },
            } as DocumentMetaType;

            const metaHistory = curDocument?.meta_history || [];
            metaHistory.push(historyItem);
            curDocument.meta_history = metaHistory;

            /* Delete old key */
            curDocument?.meta.splice(index, 1);

            result = await curDocument?.save();
        }

        return result;
    }

    /**
     * Upload an attachment to an existing document
     * @param doc UploadAtatchmentRequestType newDocument data
     */
    public static async uploadAttachment(
        doc: UploadAtatchmentRequestType
    ): Promise<IDocumentModel | null> {
        let result: IDocumentModel | null = null;

        /* Ensuring of ObjectId data type */
        doc.docId = Mongoose.Types.ObjectId(doc.docId.toString());
        doc.createdBy = Mongoose.Types.ObjectId(doc.createdBy.toString());

        const curDocument: IDocumentModel | null = (await this.DocumentModel.findOne(
            {
                _id: doc.docId,
            }
        )) as IDocumentModel;

        if (curDocument != null) {
            const attachments: DocumentAttachmentType[] =
                curDocument.attachments || [];

            /* Push uploaded file to attachments */
            const newAttachment: DocumentAttachmentType = {
                category: doc.category,
                created_at: new Date(),
                created_by: doc.createdBy,
                tags: doc.tags,
                size: doc.file?.size || -1,
                mime_type: doc.file?.mimetype || "",
                filename: doc.file?.filename || "",
                original_name: doc.file?.originalname || "",
            };
            attachments.push(newAttachment);

            /* Try to save */
            result = await curDocument?.save();
        }

        return result;
    }

    /**
     * Update an existing attachment of a document
     * @param doc UploadAtatchmentRequestType newDocument data
     */
    public static async updateAttachment(
        doc: UploadAtatchmentRequestType
    ): Promise<IDocumentModel | null> {
        let result: IDocumentModel | null = null;

        /* Ensuring of ObjectId data type */
        doc.docId = Mongoose.Types.ObjectId(doc.docId.toString());
        doc.attachmentId = Mongoose.Types.ObjectId(
            doc.attachmentId?.toString()
        );
        doc.createdBy = Mongoose.Types.ObjectId(doc.createdBy.toString());

        const curDocument: IDocumentModel | null = (await this.DocumentModel.findOne(
            {
                _id: doc.docId,
                attachments: {
                    $elemMatch: {
                        _id: doc.attachmentId,
                        is_deleted: null,
                    },
                },
            }
        )) as IDocumentModel;

        if (curDocument != null) {
            const attachments: DocumentAttachmentType[] =
                curDocument.attachments;

            /* Find and update old attachment */
            const oldAttachment: DocumentAttachmentType = attachments.find(
                (x) =>
                    x._id?.equals(doc.attachmentId as Mongoose.Types.ObjectId)
            ) as DocumentAttachmentType;
            oldAttachment.is_deleted = {
                deleted_at: new Date(),
                deleted_by: doc.createdBy,
            };

            /* Create new attachment item */
            const newAttachment: DocumentAttachmentType = {
                category: doc.category || oldAttachment.category,
                created_at: new Date(),
                created_by: doc.createdBy,
                tags: doc.tags || oldAttachment.tags,
                filename: doc.file?.filename || oldAttachment.filename,
                size: doc.file?.size || -1,
                mime_type: doc.file?.mimetype || "",
                original_name:
                    doc.file?.originalname || oldAttachment.original_name,
            };
            attachments.push(newAttachment);

            /* Try to save */
            result = await curDocument?.save();
        }

        return result;
    }

    /**
     * Archive an existing attachment of a document
     * @param doc ArchiveAtatchmentRequestType newDocument data
     */
    public static async archiveAttachment(
        doc: ArchiveAtatchmentRequestType
    ): Promise<IDocumentModel | null> {
        let result: IDocumentModel | null = null;

        /* Ensuring of ObjectId data type */
        doc.docId = Mongoose.Types.ObjectId(doc.docId.toString());
        doc.attachmentId = Mongoose.Types.ObjectId(
            doc.attachmentId?.toString()
        );
        doc.deletedBy = Mongoose.Types.ObjectId(doc.deletedBy.toString());

        const curDocument: IDocumentModel | null = (await this.DocumentModel.findOne(
            {
                _id: doc.docId,
                attachments: {
                    $elemMatch: {
                        _id: doc.attachmentId,
                        is_deleted: null,
                    },
                },
            }
        )) as IDocumentModel;

        if (curDocument != null) {
            const attachments: DocumentAttachmentType[] =
                curDocument.attachments;

            /* Find and update old attachment */
            const oldAttachment: DocumentAttachmentType = attachments.find(
                (x) =>
                    x._id?.equals(doc.attachmentId as Mongoose.Types.ObjectId)
            ) as DocumentAttachmentType;
            oldAttachment.is_deleted = {
                deleted_at: new Date(),
                deleted_by: doc.deletedBy,
            };

            /* Try to save */
            result = await curDocument?.save();
        }

        return result;
    }

    /**
     * Download an attachment
     * @param doc DownloadAttachmentRequestType Document data
     */
    public static async getAttachment(
        doc: DownloadAttachmentRequestType
    ): Promise<DocumentAttachmentType | undefined> {
        /* Ensuring of ObjectId data type */
        doc.docId = Mongoose.Types.ObjectId(doc.docId.toString());
        doc.attachmentId = Mongoose.Types.ObjectId(
            doc.attachmentId?.toString()
        );

        const document: IDocumentModel | null = await this.DocumentModel.findOne(
            {
                _id: doc.docId,
                attachments: {
                    $elemMatch: {
                        _id: doc.attachmentId,
                        is_deleted: null,
                    },
                },
            }
        );

        let result: DocumentAttachmentType | undefined;
        result = document?.attachments.find((x) =>
            x._id?.equals(doc.attachmentId)
        );

        return result;
    }
}
