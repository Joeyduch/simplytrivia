
// packages
import { Outlet } from "react-router-dom";

// components
import Header from "../Components/General/Header/Header"
import Footer from "../Components/General/Footer/Footer"



export default function RootLayout() {
    return (
        <div className="root-layout">
            <Header />

            <main>
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}