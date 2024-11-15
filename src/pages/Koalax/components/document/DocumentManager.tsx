import { useState } from "react";
import { useTranslation } from "react-i18next";
import { dropboxAuth } from "@/lib/auth/dropbox";
import DocumentToolbar from "./DocumentToolbar";
import FileList from "./FileList";
import BreadcrumbNav from "./BreadcrumbNav";
import { useDropboxManager } from "@/hooks/useDropboxManager";
import DocumentHeader from "./DocumentHeader";
import FolderCreator from "./FolderCreator";

const DocumentManager = () => {
  const [newFolderName, setNewFolderName] = useState("");
  const [currentPath, setCurrentPath] = useState("/");
  const { t } = useTranslation(["common"]);
  
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
      <DocumentHeader 
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
      />

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

          <FolderCreator
            newFolderName={newFolderName}
            onNewFolderNameChange={setNewFolderName}
            onCreateFolder={handleCreateFolder}
          />

          {isLoading ? (
            <div>{t("common.loading")}</div>
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