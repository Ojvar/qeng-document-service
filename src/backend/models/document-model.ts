import {
    Model,
    Schema,
    SchemaDefinition,
    SchemaOptions,
    SchemaTimestampsConfig,
    Mongoose,
    Types,
    Document,
} from "mongoose";
import { yellow } from "chalk";
import IDBModel from "@Lib/interfaces/core/db-model-interface";
import GlobalData from "@Core/Global/global-data";

/**
 * Document model type
 */
export type DocumentModelType = Model<IDocumentModel>;

/**
 * Document model interface
 */
export interface IDocumentModel extends Document {
    owner: Types.ObjectId;
    category: string;
    tag?: string;

    is_deleted?: {
        deleted_at: Date;
        deleted_by: Types.ObjectId;
    };

    meta: Array<DocumentMetaType>;
    meta_history: Array<DocumentMetaType>;
    attachments: Array<DocumentAttachmentType>;
}

/**
 * DocumentMeta type
 */
export type DocumentMetaType = {
    _id?: Types.ObjectId;
    key: string;
    value: object;

    created_at: Date;
    created_by: Types.ObjectId;

    is_deleted?: {
        deleted_at: Date;
        deleted_by: Types.ObjectId;
    };
};

/**
 * DocumentAttachment type
 */
export type DocumentAttachmentType = {
    _id?: Types.ObjectId;
    filename: string;
    size: number;
    mime_type: string;
    original_name: string;
    category: string;
    tags?: Array<string>;

    created_at: Date;
    created_by: Types.ObjectId;

    is_deleted?: {
        deleted_at: Date;
        deleted_by: Types.ObjectId;
    };
};

/**
 * DocumentModel class
 */
export default class DocumentModel implements IDBModel {
    /**
     * Get model name
     */
    public getName(): string {
        return "Document";
    }

    /**
     * Get database model name
     */
    public getDbName(): string | undefined {
        return "documents";
    }

    /**
     *
     * @param dbEngine any DbEngine
     */
    public async setup(dbEngine: Mongoose): Promise<Model<IDocumentModel>> {
        /* Create model */
        const model: Model<IDocumentModel> = dbEngine.model<IDocumentModel>(
            this.getName(),
            this.getSchema(),
            this.getDbName()
        );

        /* Log */
        GlobalData.logger.info(
            `Model ${yellow(this.getName())} loaded successfully`
        );

        return model;
    }

    /**
     * Get model schema
     */
    public getSchema(): Schema {
        const MetaDef: SchemaDefinition = {
            value: {
                type: Object,
            },
            key: {
                type: String,
                trim: true,
            },
            created_at: {
                type: Date,
                required: true,
            },
            created_by: {
                type: Schema.Types.ObjectId,
                required: true,
            },
        };

        const MetaHistoryDef: SchemaDefinition = {
            ...MetaDef,
            is_deleted: {
                deleted_at: {
                    type: Date,
                },
                deleted_by: {
                    type: Schema.Types.ObjectId,
                },
            },
        };

        const AttachmentDef: SchemaDefinition = {
            filename: {
                type: String,
                trim: true,
            },
            size: {
                type: Number,
                trim: true,
            },
            mime_type: {
                type: String,
                trim: true,
            },
            original_name: {
                type: String,
                trim: true,
            },
            category: {
                type: String,
                trim: true,
            },
            created_at: {
                type: Date,
                required: true,
            },
            created_by: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            is_deleted: {
                deleted_at: {
                    type: Date,
                },
                deleted_by: {
                    type: Schema.Types.ObjectId,
                },
            },
            tags: [String],
        };

        const DeletedDef: SchemaDefinition = {
            deleted_at: {
                type: Date,
            },
            deleted_by: {
                type: Schema.Types.ObjectId,
            },
        };

        const schemaDef: SchemaDefinition = {
            owner: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            category: {
                type: String,
                required: true,
                trim: true,
            },
            tag: {
                type: String,
                required: false,
                trim: true,
            },

            meta: [MetaDef],
            meta_history: [MetaHistoryDef],
            attachments: [AttachmentDef],
            is_deleted: DeletedDef,
        };

        /* Define schmea */
        const schema: Schema = new Schema(schemaDef, {
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at",
            } as SchemaTimestampsConfig,
        } as SchemaOptions);

        /* Create index */
        schema.index({
            owner: 1,
            category: 1,
        });

        /* Return schema */
        return schema;
    }
}
