import * as Mongoose from "mongoose";
import { DocumentModelType, IDocumentModel } from "@BE/models/document-model";
import GlobalData from "@Core/Global/global-data";
import {
    ArchiveDocumentRequestType,
    CreateDocumentRequestType,
} from "@Lib/types/backend/-document-request-types";

/**
 * Document Helper class
 */
export default class DocumentHelper {
    /**
     * Create a new document
     * @param doc IDocumentModel newDocument data
     */
    public static async createDocument(
        doc: CreateDocumentRequestType
    ): Promise<IDocumentModel> {
        const Document: DocumentModelType = GlobalData.dbEngine.model(
            "Document"
        );

        const result: IDocumentModel = await Document.create({
            category: doc.category,
            owner: new Mongoose.Types.ObjectId(doc.owner),
        } as IDocumentModel);

        return result;
    }

    /**
     * Archive an existing document
     * @param doc IDocumentModel newDocument data
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
}
