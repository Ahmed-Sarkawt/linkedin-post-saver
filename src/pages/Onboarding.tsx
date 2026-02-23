import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitFork, Download, Database, ArrowRight, Bookmark, Key, Hash, ExternalLink } from "lucide-react";

const EXTENSION_DOWNLOAD_URL = `https://nmerrrljdqnmjvmjkuod.supabase.co/functions/v1/download-extension`;
const NOTION_TEMPLATE_URL = "https://thewhitespacestudio.notion.site/Data-Template-310392a25611802aa1b5caf192432296?source=copy_link";

const steps = [
  {
    number: 1,
    icon: Download,
    title: "Install the Chrome Extension",
    description:
      "Download, unzip, and load it into Chrome. Takes under a minute.",
    action: {
      label: "Download Extension",
      href: EXTENSION_DOWNLOAD_URL,
    },
  },
  {
    number: 2,
    icon: Database,
    title: "Set Up Your Notion Database",
    description:
      "Duplicate our template and create a Notion integration to get your API key and Database ID.",
    action: {
      label: "Get Notion Template",
      href: NOTION_TEMPLATE_URL,
    },
  },
];

export default function Onboarding() {
  const [notionApiKey, setNotionApiKey] = useState("");
  const [notionDatabaseId, setNotionDatabaseId] = useState("");
  const [error, setError] = useState("");

  const handleGetStarted = () => {
    const trimmedKey = notionApiKey.trim();
    const trimmedDbId = notionDatabaseId.trim();

    if (!trimmedKey || !trimmedDbId) {
      setError("Please enter both your Notion API Key and Database ID.");
      return;
    }

    if (!trimmedKey.startsWith("ntn_") && !trimmedKey.startsWith("secret_")) {
      setError("Notion API Key should start with 'ntn_' or 'secret_'.");
      return;
    }

    if (trimmedDbId.length < 20) {
      setError("Database ID looks too short. It's usually a 32-character string.");
      return;
    }

    localStorage.setItem("notion_api_key", trimmedKey);
    localStorage.setItem("notion_database_id", trimmedDbId);
    localStorage.setItem("onboarding_complete", "true");
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground text-lg">LinkedIn Post Saver</span>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
          Stop losing your saved LinkedIn posts
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          LinkedIn post saving often goes missing — you forget that you even saved them.
          That's why we built this tool. Save, organize, search, and export your favorite
          LinkedIn posts in one clean dashboard.
        </p>
      </section>

      {/* Setup Cards */}
      <section className="max-w-4xl mx-auto px-4 pb-8 w-full">
        <h2 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
          Get started in 3 simple steps
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
          {steps.map((step) => (
            <Card key={step.number} className="border-border bg-card relative overflow-hidden">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                    {step.number}
                  </div>
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{step.description}</p>
                {step.action && (
                  <a
                    href={step.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4"
                  >
                    <Button variant="outline" size="sm" className="gap-2 w-full">
                      <ExternalLink className="h-4 w-4" />
                      {step.action.label}
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Notion Keys Form */}
      <section className="max-w-4xl mx-auto px-4 pb-16 w-full">
        <Card className="border-border bg-card max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                3
              </div>
              <Key className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Connect Your Notion</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Enter your Notion integration credentials below. They're stored locally in your browser — never sent to any server except Notion's API.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notion-api-key" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5" />
                  Notion API Key
                </Label>
                <Input
                  id="notion-api-key"
                  type="password"
                  placeholder="ntn_xxxxxxxxxxxxx"
                  value={notionApiKey}
                  onChange={(e) => { setNotionApiKey(e.target.value); setError(""); }}
                />
                <p className="text-xs text-muted-foreground">
                  Find this at{" "}
                  <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    notion.so/my-integrations
                  </a>
                  {" "}→ Your integration → Secrets.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notion-db-id" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5" />
                  Notion Database ID
                </Label>
                <Input
                  id="notion-db-id"
                  type="text"
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={notionDatabaseId}
                  onChange={(e) => { setNotionDatabaseId(e.target.value); setError(""); }}
                />
                <p className="text-xs text-muted-foreground">
                  The 32-character ID from your database URL (after the workspace name, before the <code className="bg-muted px-1 rounded">?</code>).
                </p>
              </div>

              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
            </div>

            {/* CTA */}
            <div className="mt-6">
              <Button size="lg" className="gap-2 text-base w-full" onClick={handleGetStarted}>
                Connect & go to my dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Fork CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-10 text-center">
        <p className="text-sm text-muted-foreground">
          Want to self-host?{" "}
          <a
            href="https://github.com/Ahmed-Sarkawt/linkedin-post-saver"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Fork the GitHub repo
          </a>{" "}
          and deploy your own instance.
        </p>
      </section>

      {/* Footer */}
      <footer className="mt-auto max-w-4xl mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
        Built by{" "}
        <a
          href="https://www.linkedin.com/in/itssulaiman/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Ahmed Sulaiman
        </a>{" "}
        with{" "}
        <a
          href="https://lovable.dev/invite/EELXUXJ"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Lovable
        </a>
      </footer>
    </div>
  );
}
