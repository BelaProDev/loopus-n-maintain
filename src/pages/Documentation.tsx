import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Documentation = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1EA]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="p-4 md:p-8">
          <h1 className="text-4xl font-bold mb-8">Documentation</h1>
          
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Overview</h2>
            <p className="text-gray-700">
              Loopus & Maintain APP is a Progressive Web App (PWA) specializing in coordinating essential maintenance services across five key areas: Electrical, Plumbing, Ironwork, Woodwork, and Architecture.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Electrical work (24/7 emergency service available)</li>
              <li>Professional plumbing solutions</li>
              <li>Custom ironwork and structural repairs</li>
              <li>Expert woodworking and carpentry</li>
              <li>Architectural consultation and planning</li>
            </ul>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold">Key Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>🏗️ Streamlined service request system</li>
              <li>🚨 24/7 Emergency response</li>
              <li>📱 Mobile-friendly PWA with offline capabilities</li>
              <li>🌐 Multi-language support for diverse clients</li>
              <li>📧 Instant notification system</li>
              <li>🔐 Secure client portal</li>
              <li>📊 Comprehensive maintenance tracking (Koalax)</li>
              <li>🔄 Fallback database system for offline functionality</li>
              <li>📄 Advanced document management with Dropbox integration</li>
              <li>📊 Business management per activity</li>
              <li>🔄 Export capabilities (PDF, DOCX)</li>
              <li>📝 Content management system with fallback database</li>
            </ul>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold">Business Management Features</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Client Management</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Add and edit client profiles</li>
                <li>Track client contact information</li>
                <li>Manage company details and VAT numbers</li>
                <li>View client history and interactions</li>
              </ul>

              <h3 className="text-xl font-semibold">Service Provider Management</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Manage provider profiles and specialties</li>
                <li>Track provider availability status</li>
                <li>Service categorization (Electrics, Plumbing, etc.)</li>
                <li>Provider rating system</li>
              </ul>

              <h3 className="text-xl font-semibold">Invoice Management</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Create and edit invoices</li>
                <li>Track payment status</li>
                <li>Automated invoice numbering</li>
                <li>Export invoices to PDF</li>
              </ul>
            </div>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold">Admin Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Content Management
                <ul className="list-disc pl-6 mt-2">
                  <li>Text content editing with live preview</li>
                  <li>Database fallback system</li>
                  <li>Multi-language support</li>
                </ul>
              </li>
              <li>Business Management
                <ul className="list-disc pl-6 mt-2">
                  <li>Activity-specific dashboards</li>
                  <li>Client and provider management</li>
                  <li>Invoice generation and tracking</li>
                  <li>Document storage with Dropbox</li>
                  <li>Export functionality (PDF/DOCX)</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
            <Card className="bg-gray-100 p-4">
              <pre className="overflow-x-auto">
{`# Email Configuration
SMTP_HOSTNAME=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
CONTACT_FORM_RECIPIENTS=email1@domain.com,email2@domain.com

# WhatsApp Integration
VITE_WHATSAPP_ELECTRICS=+1234567890
VITE_WHATSAPP_PLUMBING=+1234567890
VITE_WHATSAPP_IRONWORK=+1234567890
VITE_WHATSAPP_WOODWORK=+1234567890
VITE_WHATSAPP_ARCHITECTURE=+1234567890

# Database Configuration
VITE_FAUNA_SECRET_KEY=your-fauna-secret-key`}
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