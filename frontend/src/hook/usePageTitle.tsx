import { useEffect } from "react";
import APP_NAME from "../constants/appName"
// Enhanced usePageTitle.ts
export const usePageTitle = (title: string | undefined) => {
    useEffect(() => {
        document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
        return () => {
            document.title = APP_NAME;
        };
    }, [title]);
};