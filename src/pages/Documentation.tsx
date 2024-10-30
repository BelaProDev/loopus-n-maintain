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
            <h2 className="text-2xl font-semibold">Technical Architecture</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Core Technologies</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>React with TypeScript for type-safe development</li>
                <li>Vite for fast development and optimized builds</li>
                <li>TanStack Query for efficient data management</li>
                <li>MongoDB for scalable data storage</li>
                <li>Netlify Functions for serverless operations</li>
              </ul>
            </div>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">Service Management</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Streamlined service request system</li>
                  <li>24/7 Emergency response tracking</li>
                  <li>Service provider management</li>
                  <li>Real-time availability updates</li>
                </ul>
              </Card>

              <Card className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">Document Management</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Native async file operations</li>
                  <li>Secure file upload/download</li>
                  <li>Hierarchical folder structure</li>
                  <li>Automatic error handling</li>
                </ul>
              </Card>

              <Card className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">Business Operations</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Invoice generation and management</li>
                  <li>Client database with history</li>
                  <li>Provider performance tracking</li>
                  <li>Financial reporting tools</li>
                </ul>
              </Card>

              <Card className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">Content Management</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Multi-language support</li>
                  <li>Dynamic content updates</li>
                  <li>Fallback content system</li>
                  <li>Version control for content</li>
                </ul>
              </Card>
            </div>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold">API Integration</h2>
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Document Storage</h3>
                <p className="text-gray-700 mb-4">
                  The application uses native async/await patterns for all file operations:
                </p>
                <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
{`// Example file operation
const uploadFile = async (file: File) => {
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: file
  });
  return response.json();
};`}
                </pre>
              </Card>
            </div>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold">Environment Setup</h2>
            <Card className="bg-gray-100 p-4">
              <pre className="overflow-x-auto">
{`# Core Configuration
VITE_APP_URL=http://localhost:3000
VITE_API_URL=/.netlify/functions

# MongoDB Configuration
VITE_MONGODB_URI=mongodb+srv://your-connection-string
VITE_MONGODB_DB_NAME=koalax

# Email Configuration
SMTP_HOSTNAME=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your-username
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
CONTACT_FORM_RECIPIENTS=email1@domain.com,email2@domain.com

# Service Integration
VITE_WHATSAPP_ELECTRICS=+1234567890
VITE_WHATSAPP_PLUMBING=+1234567890
VITE_WHATSAPP_IRONWORK=+1234567890
VITE_WHATSAPP_WOODWORK=+1234567890
VITE_WHATSAPP_ARCHITECTURE=+1234567890

# Security
VITE_ADMIN_KOALAX_MDP=your-admin-password
VITE_JWT_SECRET=your-jwt-secret

# Storage & APIs
VITE_DROPBOX_CLIENT_ID=your-client-id
VITE_DROPBOX_ACCESS_TOKEN=your-access-token`}
              </pre>
            </Card>
          </section>

          <section className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold">Security Considerations</h2>
            <div className="space-y-4">
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>All API endpoints are protected with JWT authentication</li>
                <li>File operations require valid session tokens</li>
                <li>Environment variables are properly sanitized</li>
                <li>Regular security audits are performed</li>
              </ul>
            </div>
          </section>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;