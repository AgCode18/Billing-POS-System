import "./globals.css";
import Sidebar from "../components/Sidebar";
import { BillingProvider } from "../context/BillingContext";

export const metadata = {
    title: "Billing POS",
    description: "Billing and Inventory Management System",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-gray-50 text-gray-900 antialiased">
                <BillingProvider>
                    <div className="min-h-screen">
                        {/* Sidebar */}
                        <Sidebar />

                        {/* Main Content */}
                        <main className="min-h-screen lg:pl-64">
                            <div className="pt-16 lg:pt-0">
                                {children}
                            </div>
                        </main>
                    </div>
                </BillingProvider>
            </body>
        </html>
    );
}