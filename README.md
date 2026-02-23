# LinkedIn Post Saver

Save, organize, and search your favorite LinkedIn posts in one clean dashboard.

LinkedIn's built-in "Save" feature is easy to forget about — posts get buried and lost. This tool fixes that with a Chrome extension that saves posts instantly and a dashboard to browse, search, and manage them.

---

## How It Works

1. **Install the Chrome extension** → save posts with one click
2. **Set up a Notion database** → your posts sync to Notion
3. **Enter your Notion credentials** → the onboarding page connects everything

---

## Step 1 — Install the Chrome Extension

1. On the onboarding page, click **Download Extension**.
2. Unzip the downloaded file.
3. Open Chrome and go to `chrome://extensions`.
4. Enable **Developer mode** (top-right toggle).
5. Click **Load unpacked** and select the unzipped folder.
6. The extension icon will appear in your toolbar — you're ready!

## Step 2 — Set Up Your Notion Database

1. [Duplicate this Notion template](https://thewhitespacestudio.notion.site/Data-Template-310392a25611802aa1b5caf192432296?source=copy_link) to your Notion workspace.
2. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) and create a new integration.
3. Copy the **Internal Integration Secret** — this is your Notion API Key.
4. Open your duplicated database and share it with your integration (click **⋯** → **Connections** → your integration).
5. Copy the **Database ID** from the database URL (the 32-character string after your workspace name).

## Step 3 — Connect in the App

1. Open the app and you'll see the onboarding page.
2. Enter your **Notion API Key** and **Database ID** in the form.
3. Click **Connect & go to my dashboard**.
4. Your credentials are stored locally in your browser — they're never saved on any server.

---

## Usage

- **Save posts**: While browsing LinkedIn, click the save button on any post to save it.
- **Dashboard**: Open the app to browse, search, and manage all your saved posts.
- **Export**: Download your posts as JSON or CSV, or use Notion's built-in tools to filter and share.
- **Reset**: Click the Settings icon in the dashboard header to re-enter your Notion credentials.

---

## Self-Hosting

Want your own instance? [Fork this repository](https://github.com/Ahmed-Sarkawt/linkedin-post-saver), import it into [Lovable](https://lovable.dev), and you'll get your own backend automatically.

---

## Built With

- [Lovable](https://lovable.dev) — AI-powered full-stack development
- React + TypeScript + Tailwind CSS
- Notion API for data storage
- Chrome Extension for saving posts

---

## Credits

Built by [Ahmed Sulaiman](https://www.linkedin.com/in/itssulaiman/) with [Lovable](https://lovable.dev/invite/EELXUXJ).
