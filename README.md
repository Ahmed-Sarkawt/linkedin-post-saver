# LinkedIn Post Saver

Save, organize, and search your favorite LinkedIn posts in one clean dashboard.

LinkedIn's built-in "Save" feature is easy to forget about — posts get buried and lost. This tool fixes that with a Chrome extension that saves posts instantly and a dashboard to browse, search, and manage them.

---

## How It Works

1. **Fork the repo** → get your own backend
2. **Install the Chrome extension** → save posts with one click
3. **Connect to Notion** → your posts sync to a Notion database

---

## Step 1 — Fork the Repository

1. [Fork this repository](https://github.com/Ahmed-Sarkawt/linkedin-post-saver) to your own GitHub account.
2. Go to [Lovable](https://lovable.dev) and import your forked repo to create a new project — this gives you a backend automatically.

## Step 2 — Install the Chrome Extension

1. In your Lovable project, download the extension (the onboarding page has a download button).
2. Unzip the downloaded file.
3. Open Chrome and go to `chrome://extensions`.
4. Enable **Developer mode** (top-right toggle).
5. Click **Load unpacked** and select the unzipped folder.
6. The extension icon will appear in your toolbar — you're ready!

## Step 3 — Connect to Notion

1. [Duplicate this Notion template](https://thewhitespacestudio.notion.site/Data-Template-310392a25611802aa1b5caf192432296?source=copy_link) to your Notion workspace.
2. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) and create a new integration.
3. Copy the **Internal Integration Secret** — this is your `NOTION_API_KEY`.
4. Open your duplicated Notion database and share it with your integration (click **⋯** → **Connections** → your integration).
5. Copy the **Database ID** from the database URL (the 32-character string after your workspace name) — this is your `NOTION_DATABASE_ID`.
6. In your Lovable project, go to **Settings → Secrets** and add:
   - `NOTION_API_KEY` — your integration secret
   - `NOTION_DATABASE_ID` — your database ID

---

## Usage

- **Save posts**: While browsing LinkedIn, click the extension icon on any post to save it.
- **Dashboard**: Open your Lovable project to browse, search, and manage all your saved posts.
- **Export**: Posts are stored in your Notion database, so you can use Notion's built-in tools to filter, sort, and share.

---

## Built With

- [Lovable](https://lovable.dev) — AI-powered full-stack development
- React + TypeScript + Tailwind CSS
- Notion API for data storage
- Chrome Extension for saving posts

---

## Credits

Built by [Ahmed Sulaiman](https://www.linkedin.com/in/itssulaiman/) with [Lovable](https://lovable.dev/invite/EELXUXJ).
