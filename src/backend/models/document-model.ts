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
    category: string;
    owner: Types.ObjectId;

    is_deleted?: {
        deleted_at: Date;
        deleted_by: Types.ObjectId;
    };

    meta?: Array<DocumentMetaType>;
    attachments?: Array<DocumentAttachmentType>;
}

/**
 * DocumentMeta type
 */
export type DocumentMetaType = {
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
    filename: string;
    original_name: string;
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
        const schemaDef: SchemaDefinition = {
            category: {
                type: String,
                required: true,
                trim: true,
            },

            owner: {
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

            meta: [
                {
                    _id: false,
                    key: {
                        type: String,
                        trim: true,
                    },
                    value: {
                        type: Object,
                    },
                    created_at: {
                        type: Date,
                        required: true,
                    },
                    created_by: {
                        type: Schema.Types.ObjectId,
                        required: true,
                    },
                },
            ],

            attachments: [
                {
                    filename: {
                        type: String,
                        trim: true,
                    },
                    original_name: {
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
                    tags: [String],
                },
            ],
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
            category: 1,
            owner: 1,
        });

        /* Return schema */
        return schema;
    }
}
