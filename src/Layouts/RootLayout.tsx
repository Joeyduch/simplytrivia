
// packages
import { Outlet } from "react-router-dom";

// components
import ErrorBoundary from "../Components/General/ErrorBoundary/ErrorBoundary";
import Header from "../Components/General/Header/Header"
import Footer from "../Components/General/Footer/Footer"



export default function RootLayout() {
    return (
        <div className="root-layout">
            <Header />

            <main>
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </main>

            <Footer />
        </div>
    )
}