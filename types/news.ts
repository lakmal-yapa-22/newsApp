export interface NewsArticle {
  id?: string;
  title: string;
  body: string;
  category: "General" | "Sports" | "Business" | "Tech" | "Entertainment" | "Local";

  authorId: string;
  authorName: string;
  createdAt: number;
  updatedAt: number;
  isPublished: boolean;

  // Extra fields
  location?: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  isFeatured: boolean;
  priority: number;
  language: "EN" | "SI" | "TA";
}
