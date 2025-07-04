import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => (
    <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
            <Outlet />
        </div>
    </div>
);


export default Layout