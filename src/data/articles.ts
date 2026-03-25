export interface ArticleRef {
  id: string;
  file: string;
}

export const articles: ArticleRef[] = [
  { id: 'cashier-guide', file: 'cashier-guide.md' },
  // أضف أسماء ملفات المقالات الجديدة هنا بعد رفعها في مجلد public/articles
];
