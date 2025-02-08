export type Reason =
    | "server_error"
    | "client_error"
    | "auth_error"
    | "unauthorized"
    | "not_found"
    | "not_allowed"
    | "invalid_payload"
    | "already_exists"
    | null
    | undefined;

export interface ApiResponse<TypeOfDataToSend = undefined> {
    status_code: number;
    success: boolean;
    reason?: Reason;
    is_authenticated: boolean;
    message: string;
    data?: TypeOfDataToSend | null;
}
