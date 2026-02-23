import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const NOTION_API_KEY = body.notionApiKey || Deno.env.get("NOTION_API_KEY");
    if (!NOTION_API_KEY) throw new Error("NOTION_API_KEY not configured");

    const NOTION_DATABASE_ID = body.notionDatabaseId || Deno.env.get("NOTION_DATABASE_ID");
    if (!NOTION_DATABASE_ID) throw new Error("NOTION_DATABASE_ID not configured");

    let allResults: any[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    while (hasMore) {
      const queryBody: any = {
        sorts: [{ property: "Saved Date", direction: "descending" }],
        page_size: 100,
      };
      if (startCursor) queryBody.start_cursor = startCursor;

      const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify(queryBody),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Notion error:", response.status, errText);
        throw new Error(`Notion API error: ${response.status}`);
      }

      const data = await response.json();
      allResults = allResults.concat(data.results);
      hasMore = data.has_more;
      startCursor = data.next_cursor;
    }

    const posts = allResults.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        title: props["Title"]?.title?.[0]?.plain_text || "Untitled",
        author: props["Author"]?.select?.name || "Unknown",
        body: props["Post Body"]?.rich_text?.[0]?.plain_text || "",
        date: props["Saved Date"]?.date?.start || null,
        tags: props["Tags"]?.multi_select?.map((t: any) => t.name) || [],
        linkedinUrl: props["URL"]?.url || props["LinkedIn Link"]?.url || null,
        createdAt: page.created_time,
      };
    });

    return new Response(JSON.stringify({ posts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("get-linkedin-posts error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
