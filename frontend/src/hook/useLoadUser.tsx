import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userState } from "../recoil/atoms/userAtom";
import { useEffect } from "react";

export default function useLoadUser() {
    const setAuthState = useSetRecoilState(userState);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/user/me`,
                    { withCredentials: true }
                );

                setAuthState({
                    user: res.data.user,
                    isLoading: false
                });
            } catch (error) {
                setAuthState({
                    user: null,
                    isLoading: false
                });
            }
        };

        loadUser();
    }, [setAuthState]);
}