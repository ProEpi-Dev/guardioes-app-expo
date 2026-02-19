export interface Article {
  id: number;
  title: string;
  image: string;
  content: string;
  summary: string;
  content_type?: ContentType;
}

export type RootStackParamList = {
  Home: undefined;
  Article: { article: Article };
  Artigo: { article: Article };
};

export interface ArticleProps {
  title: string;
  summary: string;
  onPress: () => void;
}

export type ArticleWebViewProps = {
  content: string;
};

export interface ContentType {
  id: number;
  name: string;
  description?: string | null;
  color: string;
  created_at?: string;
  updated_at?: string;
  active?: boolean;
}