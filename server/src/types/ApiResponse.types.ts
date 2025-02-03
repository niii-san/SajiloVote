export type Reason =
    | "server_error"
    | "client_error"
    | "auth_error"
    | null
    | undefined;

export interface ApiResponse<TypeOfDataToSend> {
    status_code: number;
    success: boolean;
    reason?: Reason;
    is_authenticated: boolean;
    message: string;
    data: TypeOfDataToSend | null;
}
