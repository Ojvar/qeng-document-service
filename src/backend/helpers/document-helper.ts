import * as Mongoose from "mongoose";
import {
    DocumentMetaType,
    DocumentModelType,
    IDocumentModel,
} from "@BE/models/document-model";
import GlobalData from "@Core/Global/global-data";
import {
    AddDocumentMetaRequestType,
    ArchiveDocumentRequestType,
    CreateDocumentRequestType,
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

        const result = await Document.updateOne(
            {
                _id: Mongoose.Types.ObjectId(doc.id),
            },
            {
                $set: {
                    is_deleted: {
                        deleted_at: new Date(),
                        deleted_by: Mongoose.Types.ObjectId(doc.userId),
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

        const result = await Document.updateOne(
            {
                _id: Mongoose.Types.ObjectId(doc.id),
            },
            {
                $push: {
                    meta: {
                        key: doc.key,
                        value: doc.value,
                        created_by: Mongoose.Types.ObjectId(doc.createdBy),
                        created_at: new Date(),
                    } as DocumentMetaType,
                },
            }
        );

        return result;
    }
}
