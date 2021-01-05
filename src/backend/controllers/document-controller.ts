import * as Mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { ActionResultType } from "@Lib/types/frontend/global/action-result-type";
import {
    AddDocumentMetaRequestType,
    ArchiveDocumentRequestType,
    ArchiveDocumentMetaRequestType,
    CreateDocumentRequestType,
    UploadAtatchmentRequestType,
} from "@Lib/types/backend/document-request-types";
import DocumentHelper from "@BE/helpers/document-helper";
import { IDocumentModel } from "@BE/models/document-model";
import CreateDocumentValidator from "@BE/validators/document/create-document-validator";
import { ValidatorErrorType } from "@Lib/types/frontend/global/validator-error-type";
import ArchiveDocumentValidator from "@BE/validators/document/archive-document-validator";
import AddDocumentMetaValidator from "@BE/validators/document/add-document-meta-validator";
import ArchiveMetaDocumentValidator from "@BE/validators/document/archive-meta-document-validator";
import UploadAttachmentValidator from "@BE/validators/document/upload-attachment-validator";
import multer from "multer";
import IHash from "@Lib/interfaces/hash-interface";

/**
 * Document controller
 */
export default class DocumentController {
    /**
     * Document/Create action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async create(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const documentData: CreateDocumentRequestType = req.body as CreateDocumentRequestType;

        /* Validation */
        const validator: CreateDocumentValidator = new CreateDocumentValidator();
        const validationResult: ActionResultType = validator.validate(
            documentData
        );

        if (!validationResult.success) {
            const error: ValidatorErrorType = validationResult.data as ValidatorErrorType;

            res.status(406)
                .send({
                    success: false,
                    data: error.errors,
                } as ActionResultType)
                .end();

            return;
        }

        /* Create new document */
        const newDoc: IDocumentModel = await DocumentHelper.createDocument(
            documentData
        );

        if (null != newDoc) {
            res.send({
                success: true,
                data: { id: newDoc._id },
            } as ActionResultType).end();
        } else {
            res.status(500)
                .send({
                    success: false,
                    data: "Internal server error!",
                } as ActionResultType)
                .end();
        }
    }

    /**
     * Document/Archive action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async archive(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const documentData: ArchiveDocumentRequestType = req.body as ArchiveDocumentRequestType;
        documentData.id = req.params.id;

        /* Validation */
        const validator: ArchiveDocumentValidator = new ArchiveDocumentValidator();
        const validationResult: ActionResultType = validator.validate(
            documentData
        );

        if (!validationResult.success) {
            const error: ValidatorErrorType = validationResult.data as ValidatorErrorType;

            res.status(406)
                .send({
                    success: false,
                    data: error.errors,
                } as ActionResultType)
                .end();

            return;
        }

        /* Archive an existing document */
        const result: IDocumentModel = await DocumentHelper.archiveDocument(
            documentData
        );

        if (null != result) {
            res.send({
                success: true,
                data: result,
            } as ActionResultType).end();
        } else {
            res.status(500)
                .send({
                    success: false,
                    data: "Internal server error!",
                } as ActionResultType)
                .end();
        }
    }

    /**
     * Document/Add meta data action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async addMeta(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const documentData: AddDocumentMetaRequestType = req.body as AddDocumentMetaRequestType;
        documentData.docId = req.params.docId;

        /* Validation */
        const validator: AddDocumentMetaValidator = new AddDocumentMetaValidator();
        const validationResult: ActionResultType = validator.validate(
            documentData
        );

        if (!validationResult.success) {
            const error: ValidatorErrorType = validationResult.data as ValidatorErrorType;

            res.status(406)
                .send({
                    success: false,
                    data: error.errors,
                } as ActionResultType)
                .end();

            return;
        }

        /* Add new meta-data to an existing document */
        const result: IDocumentModel = await DocumentHelper.addMeta(
            documentData
        );

        if (null != result) {
            res.send({
                success: true,
                data: result,
            } as ActionResultType).end();
        } else {
            res.status(500)
                .send({
                    success: false,
                    data: "Internal server error!",
                } as ActionResultType)
                .end();
        }
    }

    /**
     * Document/Update meta data action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async updateMeta(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const documentData: AddDocumentMetaRequestType = req.body as AddDocumentMetaRequestType;
        documentData.docId = Mongoose.Types.ObjectId(req.params.docId);
        documentData.metaId = Mongoose.Types.ObjectId(req.params.metaId);

        /* Validation */
        const validator: AddDocumentMetaValidator = new AddDocumentMetaValidator();
        const validationResult: ActionResultType = validator.validate(
            documentData
        );

        if (!validationResult.success) {
            const error: ValidatorErrorType = validationResult.data as ValidatorErrorType;

            res.status(406)
                .send({
                    success: false,
                    data: error.errors,
                } as ActionResultType)
                .end();

            return;
        }

        /* Find and update meta-data of an existing document */
        const result: IDocumentModel | null = await DocumentHelper.updateMeta(
            documentData
        );

        if (null != result) {
            res.send({
                success: true,
                data: result,
            } as ActionResultType).end();
        } else {
            res.status(500)
                .send({
                    success: false,
                    data: "Internal server error!",
                } as ActionResultType)
                .end();
        }
    }

    /**
     * Document/ArchiveMeta action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async archiveMeta(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const documentData: ArchiveDocumentMetaRequestType = req.body as ArchiveDocumentMetaRequestType;
        documentData.docId = req.params.docId;
        documentData.metaId = req.params.metaId;

        /* Validation */
        const validator: ArchiveMetaDocumentValidator = new ArchiveMetaDocumentValidator();
        const validationResult: ActionResultType = validator.validate(
            documentData
        );

        if (!validationResult.success) {
            const error: ValidatorErrorType = validationResult.data as ValidatorErrorType;

            res.status(406)
                .send({
                    success: false,
                    data: error.errors,
                } as ActionResultType)
                .end();

            return;
        }

        /* Archive an existing document */
        const result: IDocumentModel | null = await DocumentHelper.archiveDocumentMeta(
            documentData
        );

        if (null != result) {
            res.send({
                success: true,
                data: result,
            } as ActionResultType).end();
        } else {
            res.status(500)
                .send({
                    success: false,
                    data: "Internal server error!",
                } as ActionResultType)
                .end();
        }
    }

    /**
     * Document/UploadAttachment action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async uploadAttachment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const documentData: UploadAtatchmentRequestType = req.body as UploadAtatchmentRequestType;
        documentData.file = req.file;
        documentData.docId = req.params.docId;

        const allFiles: Express.Multer.File[] = (req.files ||
            []) as Express.Multer.File[];
        documentData.file = allFiles.find((x) => x.fieldname == "file") || null;

        /* Validation */
        const validator: UploadAttachmentValidator = new UploadAttachmentValidator();
        const validationResult: ActionResultType = validator.validate(
            documentData
        );

        if (!validationResult.success) {
            const error: ValidatorErrorType = validationResult.data as ValidatorErrorType;

            res.status(406)
                .send({
                    success: false,
                    data: error.errors,
                } as ActionResultType)
                .end();

            return;
        }

        /* Archive an existing document */
        const result: IDocumentModel | null = await DocumentHelper.uploadAttachment(
            documentData
        );

        if (null != result) {
            res.send({
                success: true,
                data: result,
            } as ActionResultType).end();
        } else {
            res.status(500)
                .send({
                    success: false,
                    data: "Internal server error!",
                } as ActionResultType)
                .end();
        }
    }
}
