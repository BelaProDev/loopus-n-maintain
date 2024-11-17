export const styles = {
  // Layout
  container: "min-h-screen flex flex-col bg-background",
  mainContent: "flex-1 container mx-auto px-4 py-8",
  
  // Cards and Effects
  card: "bg-card border-2 border-border shadow-md rounded-lg p-8 mb-8",
  dialog: "bg-background border-2 border-border shadow-lg rounded-lg",
  
  // Text Styles
  title: "text-4xl font-serif text-foreground mb-4",
  description: "text-lg text-muted-foreground mb-8",
  subtitle: "text-2xl font-serif text-foreground mb-4",
  
  // Grid Layouts
  grid: "grid md:grid-cols-2 gap-8",
  
  // Form Elements
  form: "space-y-4 bg-background rounded-lg border-2 border-border p-6",
  input: "w-full rounded-md border-2 border-input bg-background px-3 py-2",
  label: "text-sm font-medium text-foreground",
  
  // Sections
  section: "bg-card border-2 border-border rounded-lg p-6 shadow-md",
  header: "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border",
  footer: "bg-background border-t border-border mt-auto",
};