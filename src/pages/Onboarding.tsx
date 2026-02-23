import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitFork, Download, Database, ArrowRight, Bookmark } from "lucide-react";

const EXTENSION_DOWNLOAD_URL = `https://nmerrrljdqnmjvmjkuod.supabase.co/functions/v1/download-extension`;
const NOTION_TEMPLATE_URL = "https://thewhitespacestudio.notion.site/Data-Template-310392a25611802aa1b5caf192432296?source=copy_link";

const steps = [
  {
    number: 1,
    icon: GitFork,
    title: "Fork the GitHub Repository",
    description:
      "Fork or clone the repository to your own GitHub account, then import it into Lovable to get your own project with a backend ready to go.",
    action: {
      label: "View on GitHub",
      href: "https://github.com/Ahmed-Sarkawt/linkedin-post-saver",
    },
  },
  {
    number: 2,
    icon: Download,
    title: "Install the Chrome Extension",
    description:
      "Download and install the extension in Chrome. It takes less than a minute — just enable Developer Mode and load it.",
    action: {
      label: "Download Extension",
      href: EXTENSION_DOWNLOAD_URL,
    },
  },
  {
    number: 3,
    icon: Database,
    title: "Connect to Notion",
    description:
      "Duplicate our Notion template, create an integration at notion.so/my-integrations, then add your NOTION_API_KEY and NOTION_DATABASE_ID as secrets in your Lovable project settings.",
    action: {
      label: "Get Notion Template",
      href: NOTION_TEMPLATE_URL,
    },
  },
];

export default function Onboarding() {
  const handleGetStarted = () => {
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
      <section className="max-w-4xl mx-auto px-4 pb-16 w-full">
        <h2 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
          Get started in 3 simple steps
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
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
                      <step.icon className="h-4 w-4" />
                      {step.action.label}
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Button size="lg" className="gap-2 text-base px-8" onClick={handleGetStarted}>
            I've set everything up — take me to my dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
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
