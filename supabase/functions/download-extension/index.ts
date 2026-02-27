import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const PROJECT_ID = Deno.env.get("SUPABASE_URL")?.match(/https:\/\/(.+)\.supabase/)?.[1] || "";
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const EDGE_FUNCTION_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/save-linkedin-post`;

    const manifest = JSON.stringify({
      manifest_version: 3,
      name: "LinkedIn Post Saver",
      version: "1.0.0",
      description: "Save LinkedIn posts to your Notion database with AI-generated titles and tags.",
      permissions: [],
      host_permissions: ["https://www.linkedin.com/*"],
      content_scripts: [{
        matches: ["https://www.linkedin.com/feed*", "https://www.linkedin.com/in/*", "https://www.linkedin.com/posts/*"],
        js: ["content.js"],
        css: ["content.css"],
      }],
    }, null, 2);

    const contentJs = generateContentJs(EDGE_FUNCTION_URL, ANON_KEY);
    const contentCss = generateContentCss();

    const files = [
      { name: "linkedin-post-saver/manifest.json", data: new TextEncoder().encode(manifest) },
      { name: "linkedin-post-saver/content.js", data: new TextEncoder().encode(contentJs) },
      { name: "linkedin-post-saver/content.css", data: new TextEncoder().encode(contentCss) },
    ];

    const zipData = createZip(files);

    return new Response(zipData, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="linkedin-post-saver-extension.zip"',
      },
    });
  } catch (e) {
    console.error("download-extension error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function generateContentJs(edgeFunctionUrl: string, anonKey: string): string {
  return `(() => {
  const EDGE_FUNCTION_URL = "${edgeFunctionUrl}";
  const ANON_KEY = "${anonKey}";

  const BOOKMARK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z"/></svg>';

  const processedPosts = new WeakSet();

  function isRepost(postEl) {
    const headerText = postEl.querySelector(".update-components-header__text-view, .feed-shared-header__text")?.textContent?.toLowerCase() || "";
    if (headerText.includes("repost") || headerText.includes("shared")) return true;
    if (postEl.querySelector(".feed-shared-mini-update-v2")) return true;
    return false;
  }

  function extractPermalink(postEl) {
    const urn = postEl.getAttribute("data-urn") || "";
    const m = urn.match(/urn:li:activity:(\\d+)/);
    if (m) return "https://www.linkedin.com/feed/update/urn:li:activity:" + m[1] + "/";
    const link = postEl.querySelector("a.app-aware-link[href*='/feed/update/'], a[href*='/posts/']");
    if (link) { try { const u = new URL(link.getAttribute("href"), "https://www.linkedin.com"); return u.origin + u.pathname; } catch {} }
    return window.location.href;
  }

  function extractAuthor(postEl) {
    const el = postEl.querySelector(".update-components-actor__title span[dir='ltr'] span[aria-hidden='true'], .feed-shared-actor__title span[dir='ltr'] span[aria-hidden='true'], .update-components-actor__name span[aria-hidden='true']");
    return el?.textContent?.trim() || "Unknown";
  }

  function extractBody(postEl) {
    const el = postEl.querySelector(".feed-shared-update-v2__description, .update-components-text, .feed-shared-text");
    return el?.innerText?.trim() || "";
  }

  function extractDate(postEl) {
    const t = postEl.querySelector("time");
    if (t) { const d = t.getAttribute("datetime"); if (d) return d.split("T")[0]; }
    return new Date().toISOString().split("T")[0];
  }

  function createSaveButton(postEl) {
    const btn = document.createElement("button");
    btn.className = "lps-save-btn";
    btn.innerHTML = BOOKMARK_SVG + " Save";

    if (isRepost(postEl)) {
      btn.classList.add("lps-disabled");
      btn.title = "Cannot save reposts or quoted posts";
      btn.innerHTML = BOOKMARK_SVG + " Repost";
      return btn;
    }

    btn.addEventListener("click", async (e) => {
      e.preventDefault(); e.stopPropagation();
      if (btn.classList.contains("lps-saving") || btn.classList.contains("lps-saved")) return;
      btn.classList.add("lps-saving");
      btn.innerHTML = BOOKMARK_SVG + " Saving\\u2026";
      try {
        const payload = { author: extractAuthor(postEl), body: extractBody(postEl), date: extractDate(postEl), url: extractPermalink(postEl) };
        if (!payload.body) throw new Error("Could not extract post content");
        const res = await fetch(EDGE_FUNCTION_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: "Bearer " + ANON_KEY },
          body: JSON.stringify(payload)
        });
        if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || "HTTP " + res.status); }
        btn.classList.remove("lps-saving"); btn.classList.add("lps-saved"); btn.innerHTML = BOOKMARK_SVG + " Saved";
      } catch (err) {
        console.error("[LinkedIn Post Saver]", err);
        btn.classList.remove("lps-saving"); btn.classList.add("lps-error"); btn.innerHTML = BOOKMARK_SVG + " Error"; btn.title = err.message;
        setTimeout(() => { btn.classList.remove("lps-error"); btn.innerHTML = BOOKMARK_SVG + " Save"; btn.title = ""; }, 3000);
      }
    });
    return btn;
  }

  function shouldRunOnPage() {
    var p = window.location.pathname;
    return p.startsWith("/feed") || p.startsWith("/in/") || p.startsWith("/posts/");
  }

  function injectButtons() {
    if (!shouldRunOnPage()) return;
    document.querySelectorAll(".feed-shared-update-v2, .occludable-update").forEach((postEl) => {
      if (processedPosts.has(postEl)) return;
      processedPosts.add(postEl);
      const bar = postEl.querySelector(".feed-shared-social-action-bar, .social-details-social-actions, .feed-shared-social-actions");
      if (!bar) return;
      if (bar.querySelector(".lps-save-btn")) return;
      bar.appendChild(createSaveButton(postEl));
    });
  }

  injectButtons();
  new MutationObserver(() => injectButtons()).observe(document.body, { childList: true, subtree: true });
})();`;
}

function generateContentCss(): string {
  return `.lps-save-btn{display:inline-flex;align-items:center;gap:4px;padding:12px 8px;border:none;border-radius:4px;background:transparent;color:rgba(0,0,0,.6);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:background .15s;line-height:1.33;height:auto}.lps-save-btn:hover{background:rgba(0,0,0,.08);color:rgba(0,0,0,.9)}.lps-save-btn.lps-saving{opacity:.6;cursor:wait}.lps-save-btn.lps-saved{color:#0a66c2;cursor:default}.lps-save-btn.lps-saved svg{fill:#0a66c2}.lps-save-btn.lps-error{color:#cc1016;cursor:pointer}.lps-save-btn.lps-disabled{color:rgba(0,0,0,.3);cursor:not-allowed}.lps-save-btn svg{width:20px;height:20px;fill:currentColor}`;
}

// Minimal ZIP file creator (no compression, store only)
function createZip(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const entries: { name: Uint8Array; data: Uint8Array; offset: number; crc: number }[] = [];
  const parts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const crc = crc32(file.data);

    // Local file header
    const header = new Uint8Array(30 + nameBytes.length);
    const hv = new DataView(header.buffer);
    hv.setUint32(0, 0x04034b50, true); // signature
    hv.setUint16(4, 20, true); // version needed
    hv.setUint16(6, 0, true); // flags
    hv.setUint16(8, 0, true); // compression (store)
    hv.setUint16(10, 0, true); // mod time
    hv.setUint16(12, 0, true); // mod date
    hv.setUint32(14, crc, true); // crc32
    hv.setUint32(18, file.data.length, true); // compressed size
    hv.setUint32(22, file.data.length, true); // uncompressed size
    hv.setUint16(26, nameBytes.length, true); // name length
    hv.setUint16(28, 0, true); // extra length
    header.set(nameBytes, 30);

    entries.push({ name: nameBytes, data: file.data, offset, crc });
    parts.push(header, file.data);
    offset += header.length + file.data.length;
  }

  // Central directory
  const cdStart = offset;
  for (const entry of entries) {
    const cd = new Uint8Array(46 + entry.name.length);
    const cv = new DataView(cd.buffer);
    cv.setUint32(0, 0x02014b50, true); // signature
    cv.setUint16(4, 20, true); // version made by
    cv.setUint16(6, 20, true); // version needed
    cv.setUint16(8, 0, true); // flags
    cv.setUint16(10, 0, true); // compression
    cv.setUint16(12, 0, true); // mod time
    cv.setUint16(14, 0, true); // mod date
    cv.setUint32(16, entry.crc, true); // crc32
    cv.setUint32(20, entry.data.length, true); // compressed size
    cv.setUint32(24, entry.data.length, true); // uncompressed size
    cv.setUint16(28, entry.name.length, true); // name length
    cv.setUint16(30, 0, true); // extra length
    cv.setUint16(32, 0, true); // comment length
    cv.setUint16(34, 0, true); // disk start
    cv.setUint16(36, 0, true); // internal attrs
    cv.setUint32(38, 0, true); // external attrs
    cv.setUint32(42, entry.offset, true); // local header offset
    cd.set(entry.name, 46);
    parts.push(cd);
    offset += cd.length;
  }

  const cdSize = offset - cdStart;

  // End of central directory
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); // signature
  ev.setUint16(4, 0, true); // disk number
  ev.setUint16(6, 0, true); // cd disk
  ev.setUint16(8, entries.length, true); // entries on disk
  ev.setUint16(10, entries.length, true); // total entries
  ev.setUint32(12, cdSize, true); // cd size
  ev.setUint32(16, cdStart, true); // cd offset
  ev.setUint16(20, 0, true); // comment length
  parts.push(eocd);

  // Combine
  const totalLength = parts.reduce((s, p) => s + p.length, 0);
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const part of parts) {
    result.set(part, pos);
    pos += part.length;
  }
  return result;
}

function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
