import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, Download, Database, Copy } from "lucide-react";

const sections = [
  {
    icon: Download,
    title: "1. Install the Chrome Extension",
    steps: [
      "Download the extension .zip file from the project repository.",
      'Unzip the file on your computer.',
      'Open Chrome and go to chrome://extensions.',
      'Enable "Developer mode" in the top right corner.',
      'Click "Load unpacked" and select the unzipped folder.',
      "The extension icon will appear in your toolbar — you're ready to save posts!",
    ],
  },
  {
    icon: Database,
    title: "2. Connect to Notion",
    steps: [
      "Go to notion.so/my-integrations and create a new integration.",
      "Copy the Internal Integration Secret (API key).",
      "Create a Notion database with columns: Title (title), Author (rich_text), Body (rich_text), Tags (multi_select), Date (date), LinkedIn URL (url).",
      "Share the database with your integration (click ⋯ → Connections → Connect to your integration).",
      "Copy the Database ID from the database URL (the 32-character string after the workspace name).",
      "Add both the API key and Database ID as secrets in your Lovable project settings.",
    ],
  },
  {
    icon: Copy,
    title: "3. Duplicate as a Lovable Project",
    steps: [
      "Open the original project in Lovable.",
      'Go to Settings → click "Remix this project" to create your own copy.',
      "In your new project, go to Settings → Secrets and add your NOTION_API_KEY and NOTION_DATABASE_ID.",
      "Your project is now fully connected and ready to use!",
    ],
  },
];

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Setup Guide">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline ml-1 text-xs">Guide</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Setup Guide</DialogTitle>
          <DialogDescription>
            Follow these steps to get everything up and running.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5 mt-2">
          {sections.map((section, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-2">
                <section.icon className="h-4 w-4 text-primary shrink-0" />
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              </div>
              <ol className="list-decimal list-inside space-y-1 pl-6">
                {section.steps.map((step, j) => (
                  <li key={j} className="text-xs text-muted-foreground leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
