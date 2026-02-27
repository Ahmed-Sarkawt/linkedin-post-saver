(() => {
  // === CONFIGURATION ===
  // Replace this with your actual edge function URL
  const EDGE_FUNCTION_URL =
    "https://nmerrrljdqnmjvmjkuod.supabase.co/functions/v1/save-linkedin-post";
  const ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZXJycmxqZHFubWp2bWprdW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NjE0NjgsImV4cCI6MjA4NzQzNzQ2OH0.sqbe-OErmWGcAdEzLVmyubgX4CWzFme8LlFpDUUA3yg";

  const BOOKMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z"/></svg>`;

  const processedPosts = new WeakSet();

  function isRepost(postEl) {
    // Detect reshared / reposted content
    const headerText = postEl
      .querySelector(".update-components-header__text-view, .feed-shared-header__text")
      ?.textContent?.toLowerCase() || "";
    if (headerText.includes("repost") || headerText.includes("shared")) return true;
    // Quoted posts have a nested article
    if (postEl.querySelector(".feed-shared-mini-update-v2")) return true;
    return false;
  }

  function extractPermalink(postEl) {
    // Try data attribute first
    const urn = postEl.getAttribute("data-urn") || "";
    const activityMatch = urn.match(/urn:li:activity:(\d+)/);
    if (activityMatch) {
      return `https://www.linkedin.com/feed/update/urn:li:activity:${activityMatch[1]}/`;
    }
    // Try link in post header
    const timeLink = postEl.querySelector(
      "a.app-aware-link[href*='/feed/update/'], a[href*='/posts/']"
    );
    if (timeLink) {
      const href = timeLink.getAttribute("href");
      try {
        const url = new URL(href, "https://www.linkedin.com");
        return url.origin + url.pathname;
      } catch {
        return href;
      }
    }
    return window.location.href;
  }

  function extractAuthor(postEl) {
    const nameEl = postEl.querySelector(
      ".update-components-actor__title span[dir='ltr'] span[aria-hidden='true'], " +
      ".feed-shared-actor__title span[dir='ltr'] span[aria-hidden='true'], " +
      ".update-components-actor__name span[aria-hidden='true']"
    );
    return nameEl?.textContent?.trim() || "Unknown";
  }

  function extractBody(postEl) {
    const bodyEl = postEl.querySelector(
      ".feed-shared-update-v2__description, " +
      ".update-components-text, " +
      ".feed-shared-text"
    );
    return bodyEl?.innerText?.trim() || "";
  }

  function extractDate(postEl) {
    const timeEl = postEl.querySelector("time");
    if (timeEl) {
      const dt = timeEl.getAttribute("datetime");
      if (dt) return dt.split("T")[0];
    }
    return new Date().toISOString().split("T")[0];
  }

  function createSaveButton(postEl) {
    const btn = document.createElement("button");
    btn.className = "lps-save-btn";
    btn.innerHTML = `${BOOKMARK_SVG} Save`;

    const repost = isRepost(postEl);
    if (repost) {
      btn.classList.add("lps-disabled");
      btn.title = "Cannot save reposts or quoted posts";
      btn.innerHTML = `${BOOKMARK_SVG} Repost`;
      return btn;
    }

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (btn.classList.contains("lps-saving") || btn.classList.contains("lps-saved")) return;

      btn.classList.add("lps-saving");
      btn.innerHTML = `${BOOKMARK_SVG} Saving…`;

      try {
        const payload = {
          author: extractAuthor(postEl),
          body: extractBody(postEl),
          date: extractDate(postEl),
          url: extractPermalink(postEl),
        };

        if (!payload.body) throw new Error("Could not extract post content");

        const res = await fetch(EDGE_FUNCTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${res.status}`);
        }

        btn.classList.remove("lps-saving");
        btn.classList.add("lps-saved");
        btn.innerHTML = `${BOOKMARK_SVG} Saved`;
      } catch (err) {
        console.error("[LinkedIn Post Saver]", err);
        btn.classList.remove("lps-saving");
        btn.classList.add("lps-error");
        btn.innerHTML = `${BOOKMARK_SVG} Error`;
        btn.title = err.message;
        // Allow retry
        setTimeout(() => {
          btn.classList.remove("lps-error");
          btn.innerHTML = `${BOOKMARK_SVG} Save`;
          btn.title = "";
        }, 3000);
      }
    });

    return btn;
  }

  function shouldRunOnPage() {
    const path = window.location.pathname;
    return path.startsWith("/feed") || path.startsWith("/in/") || path.startsWith("/posts/") || path.startsWith("/company/");
  }

  function injectButtons() {
    if (!shouldRunOnPage()) return;

    const posts = document.querySelectorAll(
      ".feed-shared-update-v2, .occludable-update"
    );
    posts.forEach((postEl) => {
      if (processedPosts.has(postEl)) return;
      processedPosts.add(postEl);

      // Find the social actions bar
      const actionsBar = postEl.querySelector(
        ".feed-shared-social-action-bar, " +
        ".social-details-social-actions, " +
        ".feed-shared-social-actions"
      );
      if (!actionsBar) return;

      // Skip if button already exists in this bar
      if (actionsBar.querySelector(".lps-save-btn")) return;

      const btn = createSaveButton(postEl);
      actionsBar.appendChild(btn);
    });
  }

  // Run on page load and observe for new posts
  injectButtons();
  const observer = new MutationObserver(() => injectButtons());
  observer.observe(document.body, { childList: true, subtree: true });
})();
