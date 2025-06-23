import { atom } from "recoil";

export interface UserType {
    _id: string;
    username: string;
    email: string;
    isSuperAdmin: boolean;
}

export const userState = atom<UserType | null>({
    key: "userState",
    default: null,
});
