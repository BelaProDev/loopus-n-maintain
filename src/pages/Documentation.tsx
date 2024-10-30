import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Documentation = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EA]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="p-4 md:p-8">
          <h1 className="text-4xl font-bold mb-8">Documentation 🌸</h1>
          
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Overview 🌺</h2>
            <p className="text-gray-700">
              Welcome to Loopus & Maintain - where we maintain buildings and crack dad jokes! 
              Our PWA helps coordinate maintenance services, because someone has to keep those buildings standing (and we're pretty good at it) 🏗️
            </p>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold">Current Features 🌷</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>🔐 Secure admin login (we promise it's not "password123")</li>
              <li>📧 Email management system (because carrier pigeons are so last century)</li>
              <li>📝 Content management with fallback database (for those "oops, no internet" moments)</li>
              <li>💼 Business management features (keeping track of who does what)</li>
              <li>📂 Document storage with Dropbox integration (because paper is so 2019)</li>
              <li>🌐 Multi-language support (we speak human... and JavaScript)</li>
            </ul>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold">Admin Features 🌹</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Content Management
                <ul className="list-disc pl-6 mt-2">
                  <li>Edit website content (typos beware!)</li>
                  <li>Offline-ready database backup (because WiFi can be shy)</li>
                </ul>
              </li>
              <li>Business Management
                <ul className="list-disc pl-6 mt-2">
                  <li>Client management (VIPs and "still waiting for payment" folks)</li>
                  <li>Provider tracking (our heroes in work boots)</li>
                  <li>Document organization (Marie Kondo would be proud)</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Environment Setup 🌻</h2>
            <Card className="bg-gray-100 p-4">
              <pre className="overflow-x-auto">
{`# The Secret Sauce (aka Environment Variables)
VITE_FAUNA_SECRET_KEY=your-secret-key
VITE_DROPBOX_ACCESS_TOKEN=your-token
VITE_WHATSAPP_NUMBERS=your-numbers`}
              </pre>
            </Card>
          </section>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;