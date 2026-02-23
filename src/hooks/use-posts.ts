import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LinkedInPost } from "@/types/post";

function getNotionCredentials() {
  return {
    notionApiKey: localStorage.getItem("notion_api_key") || "",
    notionDatabaseId: localStorage.getItem("notion_database_id") || "",
  };
}

export function usePosts() {
  return useQuery({
    queryKey: ["linkedin-posts"],
    queryFn: async (): Promise<LinkedInPost[]> => {
      const creds = getNotionCredentials();
      const { data, error } = await supabase.functions.invoke("get-linkedin-posts", {
        body: creds,
      });
      if (error) throw error;
      return data.posts;
    },
  });
}

export function useUpdatePostTags() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ pageId, tags }: { pageId: string; tags: string[] }) => {
      const creds = getNotionCredentials();
      const { data, error } = await supabase.functions.invoke("update-linkedin-post", {
        body: { pageId, tags, ...creds },
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
      const creds = getNotionCredentials();
      const { data, error } = await supabase.functions.invoke("delete-linkedin-post", {
        body: { pageId, ...creds },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["linkedin-posts"] });
    },
  });
}
