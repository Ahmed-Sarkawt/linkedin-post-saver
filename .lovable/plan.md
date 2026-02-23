# LinkedIn Post Saver — Dashboard + Notion Integration

## Overview

Save LinkedIn posts from your feed via a Chrome extension. Posts are enriched with AI-generated titles and tags, then stored in a Notion database. A LinkedIn-styled web dashboard lets you browse, search, and manage your saved posts.

---

## Notion Database Structure

Each saved post becomes a Notion page with these properties:

1. **Title** — AI-generated summary of the post (auto)
2. **Author** — Name of the LinkedIn post author: Should be a select and it should create it in notion, for example, if Ahmed sulaiman was there, then it just addes that, think of it as a tag
3. **Post Body** — Full text content of the post
4. **Post Date** — When the post was originally published
5. **Tags** — AI-generated relevant topic tags (auto) ( Current selection from notion is: Product, AI, Engineering, Design, UX, CX, Sales, Marketing, Other) 
6. **LinkedIn Link** — Direct permalink to the post

---

## Chrome Extension Updates (Code guidance — built outside Lovable)

- **Extract actual post permalink** from the feed instead of using the feed URL
- **Disable save button on quote/repost posts** — detect reshared content and grey out the button
- **Send to edge function** — the Save button calls a Supabase edge function instead of saving to local storage

---

## Backend (Supabase Edge Functions)

### Edge Function: `save-linkedin-post`

- Receives raw post data from Chrome extension (author, body, date, URL)
- Calls **Lovable AI** to generate a concise title and relevant tags from the post body
- Writes the enriched, structured data to the Notion database via Notion API

### Edge Function: `get-linkedin-posts`

- Called by the dashboard to fetch all saved posts
- Reads from Notion database, returns structured JSON

### Edge Function: `update-linkedin-post`

- Called by the dashboard when editing tags or notes
- Updates the corresponding Notion page

---

## Web Dashboard (Built in Lovable)

### Saved Posts Feed

- LinkedIn-inspired card layout showing all posts from Notion
- Each card shows: **AI Title**, **Author**, **Post body** (truncated, expandable), **Tags**, **Post Date**, **LinkedIn link**
- Search bar to filter by title, author, body text, or tags
- Filter by tags, sort by date

### Post Detail View

- Full post body
- Author info and LinkedIn link button
- Editable tags (synced back to Notion)
- AI-generated title displayed prominently

### Export

- Export filtered posts as JSON or CSV

---

## Design

- LinkedIn-inspired color scheme and card styling
- Clean, professional layout
- Responsive for desktop and mobile