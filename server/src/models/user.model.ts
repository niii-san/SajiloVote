export interface UserModel {
    id: number;
    first_name: string;
    last_name: string;
    suspended: boolean;
    suspended_till: Date | null;
    email_address: string;
    password?: string;
    created_at: Date;
    updated_at: Date;
}
