import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, Loader2, Bookmark, CalendarIcon, User, X } from "lucide-react";
import { usePosts } from "@/hooks/use-posts";
import { PostCard } from "@/components/PostCard";
import { SetupGuide } from "@/components/SetupGuide";
import { HelpDialog } from "@/components/HelpDialog";
import { PostDetail } from "@/components/PostDetail";
import { ALL_TAGS, type LinkedInPost } from "@/types/post";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Index = () => {
  const { data: posts, isLoading, error } = usePosts();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<LinkedInPost | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const authors = useMemo(() => {
    if (!posts) return [];
    return [...new Set(posts.map((p) => p.author))].sort();
  }, [posts]);

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
      const matchesAuthor = !selectedAuthor || post.author === selectedAuthor;
      const postDate = post.date ? new Date(post.date) : null;
      const matchesDateFrom = !dateFrom || (postDate && postDate >= dateFrom);
      const matchesDateTo = !dateTo || (postDate && postDate <= dateTo);
      return matchesSearch && matchesTags && matchesAuthor && matchesDateFrom && matchesDateTo;
    });
  }, [posts, search, selectedTags, selectedAuthor, dateFrom, dateTo]);

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

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Author filter */}
          <Select value={selectedAuthor} onValueChange={(v) => setSelectedAuthor(v === "__all__" ? "" : v)}>
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <User className="h-3 w-3 mr-1.5 shrink-0" />
              <SelectValue placeholder="All authors" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="__all__" className="text-xs">All authors</SelectItem>
              {authors.map((author) => (
                <SelectItem key={author} value={author} className="text-xs">{author}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date from */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("h-8 text-xs gap-1.5 font-normal", !dateFrom && "text-muted-foreground")}>
                <CalendarIcon className="h-3 w-3" />
                {dateFrom ? format(dateFrom, "MMM d, yyyy") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>

          {/* Date to */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("h-8 text-xs gap-1.5 font-normal", !dateTo && "text-muted-foreground")}>
                <CalendarIcon className="h-3 w-3" />
                {dateTo ? format(dateTo, "MMM d, yyyy") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>

          {/* Clear filters */}
          {(selectedAuthor || dateFrom || dateTo) && (
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={() => { setSelectedAuthor(""); setDateFrom(undefined); setDateTo(undefined); }}>
              <X className="h-3 w-3" /> Clear
            </Button>
          )}
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
        </a>{" "}
        for fun
      </footer>
    </div>
  );
};

export default Index;
