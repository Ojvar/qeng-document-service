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
    ArchiveDocumentMetaRequestType,
    ArchiveDocumentRequestType,
    CreateDocumentRequestType,
    UploadAtatchmentRequestType,
} from "@Lib/types/backend/document-request-types";

/**
 * Document Helper class
 */
export default class DocumentHelper {
    /**
     * Create a new document
     * @param doc CreateDocumentRequestType newDocument data
     */
    public static async createDocument(
        doc: CreateDocumentRequestType
    ): Promise<IDocumentModel> {
        const Document: DocumentModelType = GlobalData.dbEngine.model(
            "Document"
        );

        const newDoc = {
            category: doc.category,
            owner: new Mongoose.Types.ObjectId(doc.owner),
        } as IDocumentModel;

        const result: IDocumentModel = await Document.create(newDoc);

        return result;
    }

    /**
     * Archive an existing document
     * @param doc ArchiveDocumentRequestType newDocument data
     */
    public static async archiveDocument(
        doc: ArchiveDocumentRequestType
    ): Promise<IDocumentModel> {
        const Document: DocumentModelType = GlobalData.dbEngine.model(
            "Document"
        );

        doc.userId = Mongoose.Types.ObjectId(doc.userId.toString());

        const result = await Document.updateOne(
            {
                _id: Mongoose.Types.ObjectId(doc.id),
            },
            {
                $set: {
                    is_deleted: {
                        deleted_at: new Date(),
                        deleted_by: doc.userId,
                    },
                },
            }
        );

        return result;
    }

    /**
     * Add new-meta data to an existing document
     * @param doc AddDocumentMetaRequestType newDocument data
     */
    public static async addMeta(
        doc: AddDocumentMetaRequestType
    ): Promise<IDocumentModel> {
        const Document: DocumentModelType = GlobalData.dbEngine.model(
            "Document"
        );

        /* Ensuring of ObjectId data type */
        doc.docId = Mongoose.Types.ObjectId(doc.docId.toString());
        doc.createdBy = Mongoose.Types.ObjectId(doc.createdBy.toString());

        const result = await Document.updateOne(
            {
                _id: doc.docId,
                "meta.key": { $nin: [doc.key] },
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

        return result;
    }

    /**
     * Update meta data of an existing document
     * @param doc AddDocumentMetaRequestType newDocument data
     */
    public static async updateMeta(
        doc: AddDocumentMetaRequestType
    ): Promise<IDocumentModel | null> {
        let result: IDocumentModel | null = null;
        const Document: DocumentModelType = GlobalData.dbEngine.model(
            "Document"
        );

        /* Ensuring of ObjectId data type */
        doc.docId = Mongoose.Types.ObjectId(doc.docId.toString());
        doc.metaId = Mongoose.Types.ObjectId(doc.metaId?.toString());
        doc.createdBy = Mongoose.Types.ObjectId(doc.createdBy.toString());

        const curDocument: IDocumentModel | null = (await Document.findOne({
            _id: doc.docId,
            "meta._id": { $in: [doc.metaId] },
        })) as IDocumentModel;

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

        return result?._id;
    }

    /**
     * Archive meta data of an existing document
     * @param doc AddDocumentMetaRequestType newDocument data
     */
    public static async archiveDocumentMeta(
        doc: ArchiveDocumentMetaRequestType
    ): Promise<IDocumentModel | null> {
        let result: IDocumentModel | null = null;
        const Document: DocumentModelType = GlobalData.dbEngine.model(
            "Document"
        );

        /* Ensuring of ObjectId data type */
        doc.docId = Mongoose.Types.ObjectId(doc.docId.toString());
        doc.metaId = Mongoose.Types.ObjectId(doc.metaId?.toString());
        doc.deletedBy = Mongoose.Types.ObjectId(doc.deletedBy?.toString());

        const curDocument: IDocumentModel | null = (await Document.findOne({
            _id: doc.docId,
            "meta._id": { $in: [doc.metaId] },
        })) as IDocumentModel;

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

        return result?._id;
    }

    /**
     * Uplaod an attachment to  an existing document
     * @param doc UploadAtatchmentRequestType newDocument data
     */
    public static async uploadAttachment(
        doc: UploadAtatchmentRequestType
    ): Promise<IDocumentModel | null> {
        let result: IDocumentModel | null = null;
        const Document: DocumentModelType = GlobalData.dbEngine.model(
            "Document"
        );

        /* Ensuring of ObjectId data type */
        doc.docId = Mongoose.Types.ObjectId(doc.docId.toString());
        doc.createdBy = Mongoose.Types.ObjectId(doc.createdBy.toString());

        const curDocument: IDocumentModel | null = (await Document.findOne({
            _id: doc.docId,
        })) as IDocumentModel;

        if (curDocument != null) {
            const attachments: DocumentAttachmentType[] =
                curDocument.attachments || [];

            /* Push uploaded file to attachments */
            const newAttachment: DocumentAttachmentType = {
                category: doc.category,
                created_at: new Date(),
                created_by: doc.createdBy,
                tags: doc.tags,
                filename: doc.file?.filename || "",
                original_name: doc.file?.originalname || "",
            };
            attachments.push(newAttachment);

            /* Try to save */
            result = await curDocument?.save();
        }

        return result?._id;
    }
}
