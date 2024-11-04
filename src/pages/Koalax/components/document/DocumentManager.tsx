import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";
import { dropboxAuth } from "@/lib/auth/dropbox";
import DocumentToolbar from "./DocumentToolbar";
import FileList from "./FileList";
import BreadcrumbNav from "./BreadcrumbNav";
import { useDropboxManager } from "@/hooks/useDropboxManager";
import { useTranslation } from "react-i18next";

const DocumentManager = () => {
  const [newFolderName, setNewFolderName] = useState("");
  const [currentPath, setCurrentPath] = useState("/");
  const { t } = useTranslation(["admin", "common"]);
  
  const {
    files,
    isLoading,
    isAuthenticated,
    handleLogin,
    handleDownload,
    uploadMutation,
    deleteMutation,
    createFolderMutation,
    refetch,
    setIsAuthenticated
  } = useDropboxManager(currentPath);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const fullPath = `${currentPath}${currentPath.endsWith('/') ? '' : '/'}${newFolderName.trim()}`;
      createFolderMutation.mutate(fullPath);
      setNewFolderName("");
    }
  };

  const handleCreateInvoiceFolder = () => {
    createFolderMutation.mutate('/invoices');
  };

  const handleDelete = (path: string | undefined) => {
    if (path) {
      deleteMutation.mutate(path);
    }
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">{t("admin:documents.title")}</h2>
        {!isAuthenticated && (
          <Button onClick={handleLogin} className="w-full sm:w-auto">
            <LogIn className="w-4 h-4 mr-2" />
            {t("admin:documents.connect")}
          </Button>
        )}
      </div>

      {isAuthenticated && (
        <div className="space-y-4">
          <DocumentToolbar
            onCreateInvoiceFolder={handleCreateInvoiceFolder}
            onFileSelect={handleFileSelect}
            isUploading={uploadMutation.isPending}
            onRefresh={refetch}
            onLogout={() => {
              dropboxAuth.logout();
              setIsAuthenticated(false);
            }}
            currentPath={currentPath}
          />

          <BreadcrumbNav currentPath={currentPath} onNavigate={handleNavigate} />

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder={t("admin:documents.newFolderPlaceholder")}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full sm:w-auto sm:flex-1"
            />
            <Button 
              onClick={handleCreateFolder}
              className="w-full sm:w-auto"
            >
              {t("admin:documents.createFolder")}
            </Button>
          </div>

          {isLoading ? (
            <div>{t("common:common.loading")}</div>
          ) : (
            <FileList
              files={files}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onNavigate={handleNavigate}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentManager;