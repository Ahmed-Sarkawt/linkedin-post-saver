import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { author, body, date, url } = await req.json();
    if (!body) throw new Error("Post body is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const NOTION_API_KEY = Deno.env.get("NOTION_API_KEY");
    if (!NOTION_API_KEY) throw new Error("NOTION_API_KEY not configured");

    const NOTION_DATABASE_ID = Deno.env.get("NOTION_DATABASE_ID");
    if (!NOTION_DATABASE_ID) throw new Error("NOTION_DATABASE_ID not configured");

    // Generate title and tags with AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a content analyzer. Given a LinkedIn post, generate:
1. A concise title (max 10 words) summarizing the post
2. 1-3 relevant tags from ONLY these options: Product, AI, Engineering, Design, UX, CX, Sales, Marketing, Other

Respond using the generate_metadata function.`
          },
          { role: "user", content: body }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_metadata",
            description: "Generate title and tags for a LinkedIn post",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Concise title for the post" },
                tags: {
                  type: "array",
                  items: { type: "string", enum: ["Product", "AI", "Engineering", "Design", "UX", "CX", "Sales", "Marketing", "Other"] },
                  description: "Relevant tags"
                }
              },
              required: ["title", "tags"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_metadata" } }
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let title = "Untitled Post";
    let tags: string[] = ["Other"];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      title = parsed.title || title;
      tags = parsed.tags || tags;
    }

    // Write to Notion
    const notionResponse = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          "Title": { title: [{ text: { content: title } }] },
          "Author": { select: { name: author || "Unknown" } },
          "Post Body": { rich_text: [{ text: { content: body.slice(0, 2000) } }] },
          "Saved Date": { date: { start: date || new Date().toISOString().split("T")[0] } },
          "Tags": { multi_select: tags.map((t: string) => ({ name: t })) },
          "URL": { url: url || null },
        },
      }),
    });

    if (!notionResponse.ok) {
      const errText = await notionResponse.text();
      console.error("Notion error:", notionResponse.status, errText);
      throw new Error(`Notion API error: ${notionResponse.status} - ${errText}`);
    }

    const notionData = await notionResponse.json();

    return new Response(JSON.stringify({ success: true, id: notionData.id, title, tags }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("save-linkedin-post error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
