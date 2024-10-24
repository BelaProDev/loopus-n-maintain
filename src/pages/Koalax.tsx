import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEmails } from "@/hooks/useEmails";
import { Plus } from "lucide-react";
import EmailTable from "./Koalax/EmailTable";
import EmailDialog from "./Koalax/EmailDialog";

const KOALAX_PASSWORD = "miaou00";

const Koalax = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const bypAuthenticated = true;
  const [editingEmail, setEditingEmail] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const {
    emails,
    isLoading,
    createEmail,
    updateEmail,
    deleteEmail,
    isCreating,
    isUpdating,
    isDeleting,
  } = useEmails();

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === KOALAX_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const emailData = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
    };

    if (editingEmail) {
      updateEmail({ id: editingEmail.ref.id, data: emailData });
    } else {
      createEmail(emailData);
    }
    setIsDialogOpen(false);
    form.reset();
    setEditingEmail(null);
  };

  //if (!isAuthenticated || 1 === 1) {
    if (!bypAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-64"
          />
          <Button type="submit" className="w-full">
            Access Koalax
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container mx-auto p-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Email Management</h1>
          <Button onClick={() => {
            setEditingEmail(null);
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Email
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <EmailTable
            emails={emails}
            onEdit={(email) => {
              setEditingEmail(email);
              setIsDialogOpen(true);
            }}
            onDelete={deleteEmail}
            isDeleting={isDeleting}
          />
        </div>
      </div>
      <EmailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingEmail={editingEmail}
        onSubmit={handleEmailSubmit}
        isLoading={isCreating || isUpdating}
      />

    # Loopus & Maintain

    A comprehensive building maintenance and professional craft services platform designed for property managers, building owners, and facility maintenance teams.
    ---
    ---
    ---
    ## Overview

    Loopus & Maintain APP is a Progressive Web App (PWA) specializing in coordinating essential maintenance services:
    - Electrical work (24/7 emergency service available)
    - Professional plumbing solutions
    - Custom ironwork and structural repairs
    - Expert woodworking and carpentry
    - Architectural consultation and planning

    ## Key Features

    - 🏗️ Streamlined service request system
    - 🚨 24/7 Emergency response
    - 📱 Mobile-friendly PWA with offline capabilities
    - 🌐 Multi-language support for diverse clients
    - 📧 Instant notification system
    - 🔐 Secure client portal
    - 📊 Comprehensive maintenance tracking (Koalax)

    ## Getting Started

    1. Clone the repository
    2. Install dependencies:
    ```bash
    npm install
    ```
    3. Start the development server:
    ```bash
    npm run dev
    ```

    ## Environment Variables

    Create a `.env` file with:

    ```env
    # Email Configuration
    SMTP_HOSTNAME=smtp.example.com
    SMTP_PORT=587
    SMTP_USERNAME=your-username
    SMTP_PASSWORD=your-password
    SMTP_FROM_EMAIL=noreply@yourdomain.com
    CONTACT_FORM_RECIPIENTS=email1@domain.com,email2@domain.com

    # WhatsApp Integration (Optional)
    VITE_WHATSAPP_ELECTRICS=+1234567890
    VITE_WHATSAPP_PLUMBING=+1234567890
    VITE_WHATSAPP_IRONWORK=+1234567890
    VITE_WHATSAPP_WOODWORK=+1234567890
    VITE_WHATSAPP_ARCHITECTURE=+1234567890
    ```

    ## Project Structure

    ```
    src/
    ├── components/     # Reusable UI components
    ├── contexts/      # React context providers
    ├── hooks/         # Custom React hooks
    ├── lib/           # Utility functions and configurations
    ├── pages/         # Main route components
    └── types/         # TypeScript type definitions
    ```

    ## Built With

    - React + TypeScript
    - Vite
    - Tailwind CSS
    - shadcn/ui
    - React Router
    - React Query
    - Netlify Functions

_________

_________

_________

    I'm late, I'm late for a very important date... by Susie Oviatt

,;;;, 
,;;;;;;;, 
.;;;,            ,;;;;;;;;;;;, 
.;;%%;;;,        ,;;;;;;;;;;;;;, 
;;%%%%%;;;;,.    ;;;;;;;;;;;;;;; 
;;%%%%%%%%;;;;;, ;;;;;;;;;;;;;;; 
`;;%%%%%%%%%;;;;;,;;;;;;;;;;;;;' 
`;;%%%%%%%%%%;;;;,;;;;;;;;;;;' 
`;;;%%%%%%%%;;;;,;;;;;;;;;' 
`;;;%%%%%%;;;;.;;;.;;; 
`;;;%%%;;;;;;.;;;,; .,;;' 
`;;;;;;;;;;,;;;;;;'.,;;;, 
;;;;;;;;;;;;;;;;;;;;;,. 
.          ..,,;;;;;......;;;;;;;.... '; 
;;,..,;;;;;;;;;;;;..;;;;;;..;;;;.;;;;;. 
';;;;;;;;;;;;;;..;;;a@@@@a;;;;;;;a@@@@a, 
.,;;;;;;;;;;;;;;;.;;;a@@@@@@@@;;;;;,@@@@@@@a, 
.;;;,;;;;;;;;;;;;;;;;;@@@@@'  @@;;;;;;,@  `@@@@;, 
;' ,;;;,;;;;;;;;;;;;;;;@@@@@aa@@;;;;,;;;,@aa@@@@;;;,.,; 
;;;,;;;;;;;;;;;;;;;;;;@@@@@@@;;;,;a@@'      `;;;;;;;' 
' ;;;,;;;;;;;;;;;;;;;;;;;;;;;;,;a@@@       #  ;;,;;, 
.//////,,;,;;;;;;;;;;;;;;;,;;;;;;;;,;;a@@@a,        ,a;;;,;;, 
%,/////,;;;;;;;;;;;;;;;;;;;;,;,;,;;;;a@@@@@@aaaaaaa@@@;;;;;'; 
`%%%%,/,;;;;;;;;;;;;;;;;;;;;;;;;;;;;;@@@@@@@@@@@;00@@;;;;;' 
%%%%%%,;;;;;;;;;;;;;;;;;;;;;;;;;;;a@@@@@@@@@@;00@@;;;;;' 
`%%%%%%%%%%,;;;;;;;;;;;;;;;;;;;;a@@@@@@@@@;00@@;;;;;' 
`%%%%%%%%%%%%%%%,::::;;;;;;;;a@@@@@@@;00@@@::;;;%%%%%, 
`%%%%%%%%%%%%%%%,::::;;;;;@@@@@@' 0@@@@::;;%%%%%%%%' 
Oo%%%%%%%%%%%%,::::;;a@@@@@'  ,@@@::;;%%%%%%%' 
`OOo%%%%%%%%%%,::::@@@@@'    @@;::;%%%%%%' 
`OOOo%%%%%%%%,:::@@@@,;;;,a@:;;%%%%%' 
`OOOOOo%%%%%,:::@@@aaaa@';;%%%%' 
`OOOO;@@@@@@@@aa@@@@@@@@@' 
;@@@@@@@@@@@@@@@@@@@' 
@@@@@@@@'`@@@@@@@@' 
`@@@@@'    @@@@@' 
`@@'       @@'


_________

_________

_________


      <Footer />
    </div>
  );
};

export default Koalax;