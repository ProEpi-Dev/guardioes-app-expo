export interface Article {
  id: number;
  title: string;
  image: string;
  content: string;
  summary: string;
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