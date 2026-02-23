
# Update Onboarding + README for Public GitHub-Based Distribution

## Changes Overview

Two main updates: (1) change Step 1 from "Remix in Lovable" to "Fork/clone the GitHub repo", and (2) rewrite the README as a product guide.

---

## 1. Onboarding Page (`src/pages/Onboarding.tsx`)

**Step 1 update:**
- Title: "Fork the GitHub Repository"
- Description: "Fork or clone the repository to your own GitHub account, then import it into Lovable to get your own project with a backend ready to go."
- Add action button: "View on GitHub" linking to `https://github.com/Ahmed-Sarkawt/linkedin-post-saver`
- Change icon from `Copy` to `GitFork` (from lucide-react)

**Step 3 update (minor):**
- Simplify the Notion description to clarify they just duplicate the template (no need to create columns manually), create an integration, and add secrets.

## 2. Help Dialog (`src/components/HelpDialog.tsx`)

- Update the "Duplicate as a Lovable Project" section to match the new GitHub-based flow (fork repo, import into Lovable, add secrets).

## 3. README (`README.md`)

Complete rewrite as a product README:

- **Hero section**: "LinkedIn Post Saver" -- Save, organize, and search your favorite LinkedIn posts in one clean dashboard.
- **How It Works**: Brief explanation of the 3-step setup
- **Step 1 - Fork the repo**: Instructions to fork from GitHub and import into Lovable
- **Step 2 - Install the Chrome Extension**: Download, unzip, load unpacked in Chrome
- **Step 3 - Connect to Notion**: Link to the template, instructions for creating a Notion integration, where to find API key and Database ID, how to add them as project secrets in Lovable
- **Usage**: How the extension saves posts and how the dashboard works
- **Built with**: Tech stack list
- **Credits**: Link to your LinkedIn and Lovable

---

## Technical Details

### Files modified:
- `src/pages/Onboarding.tsx` -- Update step 1 title/description/icon/action, minor step 3 copy tweak
- `src/components/HelpDialog.tsx` -- Update the "duplicate" section to reference GitHub fork flow
- `README.md` -- Full rewrite as product documentation
