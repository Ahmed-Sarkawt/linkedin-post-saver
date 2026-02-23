import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LinkedInPost } from "@/types/post";

export function usePosts() {
  return useQuery({
    queryKey: ["linkedin-posts"],
    queryFn: async (): Promise<LinkedInPost[]> => {
      const { data, error } = await supabase.functions.invoke("get-linkedin-posts");
      if (error) throw error;
      return data.posts;
    },
  });
}

export function useUpdatePostTags() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ pageId, tags }: { pageId: string; tags: string[] }) => {
      const { data, error } = await supabase.functions.invoke("update-linkedin-post", {
        body: { pageId, tags },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["linkedin-posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pageId: string) => {
      const { data, error } = await supabase.functions.invoke("delete-linkedin-post", {
        body: { pageId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["linkedin-posts"] });
    },
  });
}
