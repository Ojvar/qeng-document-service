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

        super.post(
            "/",
            [controller.create.bind(controller)],
            "document.create"
        );

        super.del(
            "/:id",
            [controller.archive.bind(controller)],
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
    }
}
