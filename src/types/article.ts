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