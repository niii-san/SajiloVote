export interface UserType {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    refreshToken: string | null;
}
