/**
 * Input params of error
 */
export interface ValidationErrorMessage {
    message?: string;
    code?: number;
    statusCode?: number;
    data?: Record<string, unknown>;
    headers?: Record<string, string>;
}
/**
 * @class ValidationError
 * @description Error for validators
 */
export declare class ValidationError extends Error {
    statusCode: number;
    code: number;
    data: Record<string, unknown>;
    headers: Record<string, string>;
    /**
     * @constructor
     * @param params - text mesage of error
     * @param code - number internal code
     * @param statusCode - number http status code
     */
    constructor(params?: ValidationErrorMessage | string, code?: number, statusCode?: number);
    /**
     * Get error message
     * @returns message
     */
    getMessage(): string;
    /**
     * Get internal status code
     * @returns status code
     */
    getStatusCode(): number;
    /**
     * Get internal error code
     * @returns code
     */
    getCode(): number;
    /**
     * Get error data
     * @returns data object
     */
    getData(): Record<string, unknown>;
    /**
     * Get error headers
     * @returns headers object
     */
    getHeaders(): Record<string, string>;
}
