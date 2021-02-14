import DocumentController from "@BE/Controllers/document-controller";
import BaseRouter from "@Core/Helpers/base-router-helper";

/**
 * Document router
 */
export default class DocumentRoute extends BaseRouter {
    /**
     * Constructor
     */
    constructor() {
        super("/document", "DocumentRoute");
        this.defineRoutes();
    }

    /**
     * Define routes
     */
    private defineRoutes(): void {
        const controller: DocumentController = new DocumentController();

        super.get(
            "/:id",
            [controller.getDocumentById.bind(controller)],
            "document.get-document-by-id"
        );

        super.get(
            "/:docId/attachments/:attachmentId",
            [controller.downloadAttachment.bind(controller)],
            "document.download-attachment"
        );

        super.get(
            "/:owner/:category/:tag?",
            [controller.getDocumentByData.bind(controller)],
            "document.get-document-by-data"
        );

        super.post(
            "/",
            [controller.createDocument.bind(controller)],
            "document.create"
        );

        super.del(
            "/:id",
            [controller.archiveDocument.bind(controller)],
            "document.archive"
        );

        super.post(
            "/:docId/meta",
            [controller.addMeta.bind(controller)],
            "document.meta.add"
        );

        super.patch(
            "/:docId/meta/:metaId",
            [controller.updateMeta.bind(controller)],
            "document.meta.update"
        );

        super.del(
            "/:docId/meta/:metaId",
            [controller.archiveMeta.bind(controller)],
            "document.meta.archive"
        );

        super.post(
            "/:docId/attachments",
            [controller.uploadAttachment.bind(controller)],
            "document.attachments.upload"
        );

        super.patch(
            "/:docId/attachments/:attachmentId",
            [controller.updateAttachment.bind(controller)],
            "document.attachments.update"
        );

        super.del(
            "/:docId/attachments/:attachmentId",
            [controller.archiveAttachment.bind(controller)],
            "document.attachments.archive"
        );
    }
}
