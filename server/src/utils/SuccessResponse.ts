import { ApiResponse } from "../types/index.js";

/**
 * Successful response format
 * _Status code_ **2xx** **_ONLY**
 */
export class SuccessResponse<T> implements ApiResponse<T> {
    public status_code: number;
    public success: boolean;
    public message: string;
    public data: T | null;

    /**
     * @param status_code - The HTTP status code of the successful response
     * @param is_authenticated - Indicates if the user is authenticated
     * @param message - A message providing additional information about the response
     * @param data - The actual data returned in the response
     */
    constructor(status_code: number, message: string, data: T | null) {
        this.status_code = status_code;
        this.success = true;
        this.message = message;
        this.data = data;
    }
}
