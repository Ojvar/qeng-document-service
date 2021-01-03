import { Request, Response, NextFunction } from "express";
import { ActionResultType } from "@Lib/types/frontend/global/action-result-type";
import {
    ArchiveDocumentRequestType,
    CreateDocumentRequestType,
} from "@Lib/types/backend/-document-request-types";
import DocumentHelper from "@BE/helpers/document-helper";
import { IDocumentModel } from "@BE/models/document-model";
import CreateDocumentValidator from "@BE/validators/document/create-document-validator";
import { values } from "lodash";
import { ValidatorErrorType } from "@Lib/types/frontend/global/validator-error-type";

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

        res.send({
            success: true,
            data: { id: newDoc._id },
        } as ActionResultType).end();
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

        /* TODO: VALIDATE */

        /* Archive an existing document */
        const result: IDocumentModel = await DocumentHelper.archiveDocument(
            documentData
        );

        res.send({
            success: true,
            data: result,
        } as ActionResultType).end();
    }
}
