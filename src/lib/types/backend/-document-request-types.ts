/**
 * Create document request type
 */
export type CreateDocumentRequestType = {
    category: string;
    owner: string;
};

/**
 * Archive document request type
 */
export type ArchiveDocumentRequestType = {
    id: string;
    userId: string;
};
