import { AttributeNames, ErrorMessages, Rules, Validator } from "validatorjs";
import IValidator from "@Lib/interfaces/frontend/validators/validator-interface";
import { ActionResultType } from "@Lib/types/frontend/global/action-result-type";
import BaseValidator from "@FE/validators/base-validator";
import { CreateDocumentRequestType } from "@Lib/types/backend/-document-request-types";

/**
 * Validator of UserLogin
 */
export default class CreateDocumentValidator
    extends BaseValidator
    implements IValidator {
    /**
     * Get rules
     */
    public getRules<T>(data?: T): Rules {
        return {
            category: "required|min:1|max:50",
            owner: "required|size:24",
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
    public validate(data: CreateDocumentRequestType): ActionResultType {
        return super.validateData<CreateDocumentRequestType>(this, data);
    }
}
