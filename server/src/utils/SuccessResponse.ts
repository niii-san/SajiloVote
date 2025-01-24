import { ApiResponse, Reason } from "./ApiResponse.types";

export class SuccessfulResponse<T> implements ApiResponse<T> {
    public status_code: number;
    public success: boolean;
    public reason: Reason;
    public is_authenticated: boolean;
    public message: string;
    public data: T | null;

    /**
     * @param status_code - The HTTP status code of the successful response
     * @param is_authenticated - Indicates if the user is authenticated
     * @param message - A message providing additional information about the response
     * @param data - The actual data returned in the response
     */
    constructor(
        status_code: number,
        is_authenticated: boolean,
        message: string,
        data: T | null,
    ) {
        this.status_code = status_code;
        this.success = true;
        this.reason = null;
        this.is_authenticated = is_authenticated;
        this.message = message;
        this.data = data;
    }
}
