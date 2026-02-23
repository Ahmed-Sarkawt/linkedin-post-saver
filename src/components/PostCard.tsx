import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronDown, ChevronUp, Calendar, User } from "lucide-react";
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
  const shouldTruncate = post.body.length > 280;
  const displayBody = expanded || !shouldTruncate ? post.body : post.body.slice(0, 280) + "…";

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md border-border"
      onClick={() => onSelect(post)}
    >
      <CardContent className="p-5">
        <h3 className="text-base font-semibold text-foreground mb-1 leading-snug">
          {post.title}
        </h3>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {post.author}
          </span>
          {post.date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.date).toLocaleDateString()}
            </span>
          )}
        </div>

        <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed mb-3">
          {displayBody}
        </p>

        {shouldTruncate && (
          <button
            className="text-sm font-medium text-primary hover:underline mb-3 flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? (
              <>Show less <ChevronUp className="h-3.5 w-3.5" /></>
            ) : (
              <>Show more <ChevronDown className="h-3.5 w-3.5" /></>
            )}
          </button>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={`text-xs font-medium ${TAG_COLORS[tag] || TAG_COLORS.Other}`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {post.linkedinUrl && (
            <div className="flex items-center gap-1.5 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary h-8 px-2 gap-1.5 min-w-0"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(post.linkedinUrl!, "_blank");
                }}
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span className="text-xs truncate max-w-[180px]">{post.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
