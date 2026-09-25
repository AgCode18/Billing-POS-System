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
          <div className="min-h-screen bg-[#f5f7fb]">
            <Sidebar />

            <main className="ml-64 min-h-screen">
              {children}
            </main>
          </div>
        </BillingProvider>
      </body>
    </html>
  );
}