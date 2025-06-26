import { atom } from "recoil";

export interface UserType {
    _id: string;
    username: string;
    email: string;
    isSuperAdmin: boolean;
}

export interface AuthState {
    user: UserType | null;
    isLoading: boolean;
}

export const userState = atom<AuthState>({
    key: "userState",
    default: {
        user: null,
        isLoading: true
    },
});