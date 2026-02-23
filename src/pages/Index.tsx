import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, Loader2, Bookmark } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { PostCard } from "@/components/PostCard";
import { SetupGuide } from "@/components/SetupGuide";
import { HelpDialog } from "@/components/HelpDialog";
import { PostDetail } from "@/components/PostDetail";
import { ALL_TAGS, type LinkedInPost } from "@/types/post";

const Index = () => {
  const { data: posts, isLoading, error } = usePosts();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<LinkedInPost | null>(null);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((post) => {
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        post.title.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some((t) => post.tags.includes(t));
      return matchesSearch && matchesTags;
    });
  }, [posts, search, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const exportPosts = (format: "json" | "csv") => {
    const data = filteredPosts;
    let content: string;
    let type: string;
    let ext: string;

    if (format === "json") {
      content = JSON.stringify(data, null, 2);
      type = "application/json";
      ext = "json";
    } else {
      const headers = ["Title", "Author", "Body", "Date", "Tags", "LinkedIn URL"];
      const rows = data.map((p) => [
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.author.replace(/"/g, '""')}"`,
        `"${p.body.replace(/"/g, '""')}"`,
        p.date || "",
        `"${p.tags.join(", ")}"`,
        p.linkedinUrl || "",
      ]);
      content = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      type = "text/csv";
      ext = "csv";
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linkedin-posts.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-card border-b border-border">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Saved Posts</span>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-6">
          <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-foreground text-lg">Saved Posts</h1>
          </div>
          <div className="flex gap-1">
            <HelpDialog />
            <Button variant="ghost" size="sm" onClick={() => exportPosts("json")} title="Export JSON">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-1 text-xs">JSON</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => exportPosts("csv")} title="Export CSV">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-1 text-xs">CSV</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts by title, author, content, or tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {ALL_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer text-xs select-none"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {!isLoading && !error && (!posts || posts.length === 0) && <SetupGuide />}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-destructive">
            <p>Failed to load posts. Please check your Notion connection.</p>
          </div>
        )}

        {!isLoading && !error && filteredPosts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Bookmark className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>{posts?.length ? "No posts match your filters." : "No saved posts yet."}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} onSelect={setSelectedPost} />
          ))}
        </div>
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
        Built by Ahmed Sulaiman with{" "}
        <a
          href="https://lovable.dev?ref=ahmed-sulaiman"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Lovable
        </a>{" "}
        for fun
      </footer>
    </div>
  );
};

export default Index;
