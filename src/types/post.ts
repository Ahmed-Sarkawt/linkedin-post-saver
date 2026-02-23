export interface LinkedInPost {
  id: string;
  title: string;
  author: string;
  body: string;
  date: string | null;
  tags: string[];
  linkedinUrl: string | null;
  createdAt: string;
}

export const ALL_TAGS = [
  "Product", "AI", "Engineering", "Design", "UX", "CX", "Sales", "Marketing", "Other"
] as const;

export type TagName = typeof ALL_TAGS[number];
