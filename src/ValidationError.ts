/**
 * Input params of error
 */
export interface ValidationErrorMessage {
    message?: string,
    code?: number,
    statusCode?: number,
    data?: Record<string, unknown>,
    headers?: Record<string, string>
}

/**
 * @class ValidationError
 * @description Error for validators
 */
export class ValidationError extends Error {
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
    constructor(params : ValidationErrorMessage | string = "", code: number = 0, statusCode : number = 404) {
        super();

        let paramsObj: ValidationErrorMessage = {};

        if(typeof params === "string") {
            paramsObj.message = params;
            paramsObj.code = code;
            paramsObj.statusCode = statusCode;
        } else {
            paramsObj = params;
        }

        this.statusCode = paramsObj.statusCode ?? 404;
        this.code = paramsObj.code ?? 0;
        this.message = paramsObj.message ?? "";
        this.data = paramsObj.data ?? {};
        this.headers = paramsObj.headers ?? {}
    }

    /**
     * Get error message
     * @returns message
     */
    getMessage(): string {

        return this.message;
    }

    /**
     * Get internal status code
     * @returns status code
     */
    getStatusCode() : number {

        return this.statusCode;
    }

    /**
     * Get internal error code
     * @returns code
     */
    getCode(): number {

        return this.code;
    }

    /**
     * Get error data
     * @returns data object
     */
    getData(): Record<string, unknown> {

        return this.data;
    }

    /**
     * Get error headers
     * @returns headers object
     */
    getHeaders() : Record<string, string> {

        return this.headers;
    }
}