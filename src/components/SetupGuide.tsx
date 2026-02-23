import { Card, CardContent } from "@/components/ui/card";
import { Chrome, Download, Puzzle, MousePointer, Zap } from "lucide-react";

const steps = [
  {
    icon: Download,
    title: "Download the Extension",
    description: "Download the LinkedIn Post Saver Chrome extension .zip file and unzip it on your computer.",
  },
  {
    icon: Chrome,
    title: "Open Chrome Extensions",
    description: 'Go to chrome://extensions in your browser and enable "Developer mode" in the top right corner.',
  },
  {
    icon: Puzzle,
    title: "Load the Extension",
    description: 'Click "Load unpacked" and select the unzipped extension folder. The extension icon will appear in your toolbar.',
  },
  {
    icon: MousePointer,
    title: "Save Posts from LinkedIn",
    description: "Browse your LinkedIn feed. Click the save button on any post to capture it — the title and tags are generated automatically by AI.",
  },
  {
    icon: Zap,
    title: "View Here",
    description: "Saved posts appear in this dashboard instantly. Search, filter by tags, and export anytime.",
  },
];

export function SetupGuide() {
  return (
    <div className="bg-card border border-border rounded-lg p-5 mb-6">
      <h2 className="text-base font-semibold text-foreground mb-1">Getting Started</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Set up the Chrome extension to start saving LinkedIn posts.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, i) => (
          <Card key={i} className="border-border bg-background shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <step.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
