import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

type ArticleWebViewProps = {
  title: string;
  image: string;
  content: string;
};

export function ArticleWebView({
  title,
  image,
  content,
}: ArticleWebViewProps) {

  const htmlContent = useMemo(() => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: -apple-system, Roboto, sans-serif; 
            font-size: 1.1rem; 
            padding: 15px; 
            line-height: 1.6;
            color: #333;
          }
          img { 
            max-width: 100% !important; 
            height: auto !important; 
            border-radius: 8px;
          }
          h1 { font-size: 1.5rem; color: #000; }
          pre { 
            background: #fff; 
            padding: 10px; 
            overflow-x: scroll; 
            border-radius: 5px; 
          }
          blockquote { 
            border-left: 4px solid #000; 
            margin: 1.5em 10px; 
            padding: 0.5em 10px; 
          }
        </style>
      </head>
      <body>
        <img 
          src="${image}" 
          alt="imagem artigo" 
          style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;"
        />

        <p style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">
          ${title}
        </p>

        ${content}
      </body>
    </html>
  `, [title, image, content]);

  return (
    <WebView
      style={styles.container}
      originWhitelist={['*']}
      source={{ html: htmlContent}}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
