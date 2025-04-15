export interface ApiResponse<T = undefined> {
    status_code: number;
    success: boolean;
    message: string;
    data?: T | null;
}
