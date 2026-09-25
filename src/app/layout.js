import "./globals.css";
import Sidebar from "../components/Sidebar";
import { BillingProvider } from "../context/BillingContext";

export const metadata = {
  title: "Billing Software",
  description: "Simple POS Billing Software",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BillingProvider>
          <div className="min-h-screen bg-gray-50">
            <Sidebar />

            {/* 
              Mobile: pt-16 (fixed top bar ki height) aur koi left margin nahi
              Desktop (lg): pt-0 aur ml-64 (sidebar ki width)
            */}
            <main className="min-h-screen pt-16 lg:pt-0 lg:ml-64">
              {children}
            </main>
          </div>
        </BillingProvider>
      </body>
    </html>
  );
}