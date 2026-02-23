import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink, Calendar, User, X, Plus, Trash2 } from "lucide-react";
import { useUpdatePostTags, useDeletePost } from "@/hooks/use-posts";
import { useToast } from "@/hooks/use-toast";
import type { LinkedInPost } from "@/types/post";
import { ALL_TAGS } from "@/types/post";

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

interface PostDetailProps {
  post: LinkedInPost | null;
  onClose: () => void;
}

export function PostDetail({ post, onClose }: PostDetailProps) {
  const [tags, setTags] = useState(post?.tags || []);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const updateTags = useUpdatePostTags();
  const deletePost = useDeletePost();
  const { toast } = useToast();

  useEffect(() => {
    if (post) {
      setTags(post.tags);
      setShowTagPicker(false);
    }
  }, [post]);

  const availableTags = ALL_TAGS.filter((t) => !tags.includes(t));

  const handleAddTag = async (tag: string) => {
    if (!post) return;
    const newTags = [...tags, tag];
    setTags(newTags);
    setShowTagPicker(false);
    try {
      await updateTags.mutateAsync({ pageId: post.id, tags: newTags });
      toast({ title: "Tag added", description: `"${tag}" added successfully` });
    } catch {
      setTags(tags);
      toast({ title: "Error", description: "Failed to update tags", variant: "destructive" });
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!post) return;
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    try {
      await updateTags.mutateAsync({ pageId: post.id, tags: newTags });
      toast({ title: "Tag removed" });
    } catch {
      setTags(tags);
      toast({ title: "Error", description: "Failed to update tags", variant: "destructive" });
    }
  };

  return (
    <Dialog open={!!post} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        {post && (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg leading-snug pr-6">{post.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-4 text-sm pt-1">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {post.author}
                </span>
                {post.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="text-sm text-foreground/85 whitespace-pre-line leading-relaxed py-2">
              {post.body}
            </div>

            <div className="mb-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1.5 items-center">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`text-xs font-medium pr-1 ${TAG_COLORS[tag] || TAG_COLORS.Other}`}
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {availableTags.length > 0 && (
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setShowTagPicker(!showTagPicker)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    {showTagPicker && (
                      <div className="absolute bottom-8 left-0 z-10 bg-popover border border-border rounded-md shadow-md p-1 min-w-[120px]">
                        {availableTags.map((tag) => (
                          <button
                            key={tag}
                            className="block w-full text-left px-3 py-1.5 text-sm hover:bg-accent rounded-sm"
                            onClick={() => handleAddTag(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {post.linkedinUrl && (
                <Button
                  className="flex-1"
                  onClick={() => window.open(post.linkedinUrl!, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on LinkedIn
                </Button>
              )}
              <Button
                variant="destructive"
                className={post.linkedinUrl ? "" : "w-full"}
                onClick={async () => {
                  try {
                    await deletePost.mutateAsync(post.id);
                    toast({ title: "Post deleted" });
                    onClose();
                  } catch {
                    toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
                  }
                }}
                disabled={deletePost.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deletePost.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
