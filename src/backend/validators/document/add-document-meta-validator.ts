import { AttributeNames, ErrorMessages, Rules, Validator } from "validatorjs";
import IValidator from "@Lib/interfaces/frontend/validators/validator-interface";
import { ActionResultType } from "@Lib/types/frontend/global/action-result-type";
import BaseValidator from "@FE/validators/base-validator";
import { AddDocumentMetaRequestType } from "@Lib/types/backend/document-request-types";

/**
 * Validator of ArchiveDocument
 */
export default class AddDocumentMetaValidator
    extends BaseValidator
    implements IValidator {
    /**
     * Get rules
     */
    public getRules<T>(data?: T): Rules {
        return {
            docId: ["required", "regex:/^[0-9a-f]{24}$/i"],
            metaId: ["regex:/^[0-9a-f]{24}$/i"],
            key: "required|max:50",
            value: "required",
            createdBy: ["required", "regex:/^[0-9a-f]{24}$/i"],
        } as Rules;
    }

    /**
     * Get error mesages
     */
    public getMessages<T>(data?: T): ErrorMessages {
        return {} as ErrorMessages;
    }

    /**
     * Setup attribute names
     */
    public getAttributes<T>(data?: T): AttributeNames {
        return {} as AttributeNames;
    }

    /**
     * Setup Validator
     */
    public setup<T>(validator: Validator<T>): void {
        validator.lang = "en";
    }

    /**
     * Validate data
     * @param data Input data
     */
    public validate(data: AddDocumentMetaRequestType): ActionResultType {
        return super.validateData<AddDocumentMetaRequestType>(this, data);
    }
}
