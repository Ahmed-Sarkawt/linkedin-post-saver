import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ChevronDown, ChevronUp, User } from "lucide-react";
import type { LinkedInPost } from "@/types/post";

interface PostCardProps {
  post: LinkedInPost;
  onSelect: (post: LinkedInPost) => void;
}

const TAG_COLORS: Record<string, string> = {
  Product: "bg-blue-100 text-blue-800 border-blue-200",
  AI: "bg-purple-100 text-purple-800 border-purple-200",
  Engineering: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Design: "bg-pink-100 text-pink-800 border-pink-200",
  UX: "bg-orange-100 text-orange-800 border-orange-200",
  CX: "bg-amber-100 text-amber-800 border-amber-200",
  Sales: "bg-green-100 text-green-800 border-green-200",
  Marketing: "bg-red-100 text-red-800 border-red-200",
  Other: "bg-gray-100 text-gray-800 border-gray-200",
};

export function PostCard({ post, onSelect }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cleanBody = post.body.replace(/…more\s*$/i, '').replace(/\.\.\.more\s*$/i, '').trimEnd();
  const shouldTruncate = cleanBody.length > 280;
  const displayBody = expanded || !shouldTruncate ? cleanBody : cleanBody.slice(0, 280) + "…";

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md border-border"
      onClick={() => onSelect(post)}
    >
      <CardContent className="p-5">
        {/* Row 1: Title | Date */}
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-base font-semibold text-foreground leading-snug">
            {post.title}
          </h3>
          {post.date && (
            <span className="text-[11px] text-muted-foreground/70 whitespace-nowrap shrink-0">
              {new Date(post.date).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Content block: Author + Body (tight grouping) */}
        <div className="mt-3 space-y-1.5">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <User className="h-3 w-3 shrink-0" />
            {post.author}
          </p>
          <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
            {displayBody}
          </p>
          {shouldTruncate && (
            <button
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? (
                <>Show less <ChevronUp className="h-3 w-3" /></>
              ) : (
                <>Show more <ChevronDown className="h-3 w-3" /></>
              )}
            </button>
          )}
        </div>

        {/* Row 3: Tags | Link (metadata row) */}
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-border/50">
          <div className="flex flex-wrap gap-1 items-center">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={`text-[10px] font-medium px-1.5 py-0 ${TAG_COLORS[tag] || TAG_COLORS.Other}`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {post.linkedinUrl && (
            <button
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                window.open(post.linkedinUrl!, "_blank");
              }}
            >
              <ExternalLink className="h-3 w-3" />
              View on LinkedIn
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
