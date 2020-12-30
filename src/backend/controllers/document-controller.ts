import Mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { DocumentModelType, IDocumentModel } from "@BE/models/document-model";
import GlobalData from "@Core/Global/global-data";
import { ActionResultType } from "@Lib/types/frontend/global/action-result-type";

/**
 * Document controller
 */
export default class DocumentController {
    /**
     * Document/create action
     * @param req Express.Request Request
     * @param res Express.Response Response
     * @param next Express.NextFunction next function
     */
    public async create(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        console.log(req.body);

        // const Document: DocumentModelType = GlobalData.dbEngine.model(
        //     "Document"
        // );

        // Document.create({
        //     tag: "Test-Tag",
        //     owner: new Mongoose.Types.ObjectId(),
        // } as IDocumentModel);

        res.send({
            success: true,
            data: "ok",
        } as ActionResultType).end();
    }
}
