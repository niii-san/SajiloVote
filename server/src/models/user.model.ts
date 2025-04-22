export interface UserModel {
    id: number;
    first_name: string;
    last_name: string;
    email_address: string;
    password?: string;
    refresh_token?: string;
    created_at: Date;
    updated_at: Date;
}
