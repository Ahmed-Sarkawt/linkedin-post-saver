import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, Download, Database, Copy } from "lucide-react";

const EXTENSION_DOWNLOAD_URL = `https://nmerrrljdqnmjvmjkuod.supabase.co/functions/v1/download-extension`;

const sections = [
  {
    id: "extension",
    icon: Download,
    title: "Install the Chrome Extension",
    content: (
      <div className="space-y-3">
        <a
          href={EXTENSION_DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="sm" className="gap-2 mb-2">
            <Download className="h-4 w-4" />
            Download Extension
          </Button>
        </a>
        <ol className="list-decimal list-inside space-y-1.5 pl-1">
          <li className="text-xs text-muted-foreground leading-relaxed">Unzip the downloaded file on your computer.</li>
          <li className="text-xs text-muted-foreground leading-relaxed">Open Chrome and go to <code className="text-foreground bg-muted px-1 rounded">chrome://extensions</code>.</li>
          <li className="text-xs text-muted-foreground leading-relaxed">Enable "Developer mode" in the top right corner.</li>
          <li className="text-xs text-muted-foreground leading-relaxed">Click "Load unpacked" and select the unzipped folder.</li>
          <li className="text-xs text-muted-foreground leading-relaxed">The extension icon will appear in your toolbar — you're ready!</li>
        </ol>
      </div>
    ),
  },
  {
    id: "notion",
    icon: Database,
    title: "Connect to Notion",
    content: (
      <ol className="list-decimal list-inside space-y-1.5 pl-1">
        <li className="text-xs text-muted-foreground leading-relaxed">Go to <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-primary underline">notion.so/my-integrations</a> and create a new integration.</li>
        <li className="text-xs text-muted-foreground leading-relaxed">Copy the Internal Integration Secret (API key).</li>
        <li className="text-xs text-muted-foreground leading-relaxed">Create a Notion database with columns: Title (title), Author (rich_text), Body (rich_text), Tags (multi_select), Date (date), LinkedIn URL (url).</li>
        <li className="text-xs text-muted-foreground leading-relaxed">Share the database with your integration (click ⋯ → Connections → Connect).</li>
        <li className="text-xs text-muted-foreground leading-relaxed">Copy the Database ID from the URL (the 32-character string after the workspace name).</li>
        <li className="text-xs text-muted-foreground leading-relaxed">Add both the API key and Database ID as secrets in your Lovable project settings.</li>
      </ol>
    ),
  },
  {
    id: "duplicate",
    icon: Copy,
    title: "Duplicate as a Lovable Project",
    content: (
      <ol className="list-decimal list-inside space-y-1.5 pl-1">
        <li className="text-xs text-muted-foreground leading-relaxed">Open the original project in Lovable.</li>
        <li className="text-xs text-muted-foreground leading-relaxed">Go to Settings → click "Remix this project" to create your own copy.</li>
        <li className="text-xs text-muted-foreground leading-relaxed">In your new project, go to Settings → Secrets and add your NOTION_API_KEY and NOTION_DATABASE_ID.</li>
        <li className="text-xs text-muted-foreground leading-relaxed">Your project is now fully connected and ready to use!</li>
      </ol>
    ),
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
            Click each section to expand the instructions.
          </DialogDescription>
        </DialogHeader>
        <Accordion type="single" collapsible className="w-full">
          {sections.map((section) => (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="text-sm">
                <div className="flex items-center gap-2">
                  <section.icon className="h-4 w-4 text-primary shrink-0" />
                  {section.title}
                </div>
              </AccordionTrigger>
              <AccordionContent>{section.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
