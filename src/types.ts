export interface IUser { //oshibka mozet bit
    email: string | null;
    id: string;
    name?: string;
}


export interface IProfile {
    id: string;
    userId: string;
    name: string;
    lastName: string;
    role: "admin" | "user";
}

export interface User {
    id: string;
    email: string;
    role: 'user' | 'admin';
}