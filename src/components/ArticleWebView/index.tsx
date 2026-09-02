import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { ArticleWebViewProps } from '../../types/article';

export function ArticleWebView({ content }: ArticleWebViewProps) {
  const htmlContent = useMemo(() => {
    let processedContent = content
      .replace(/<p><br><\/p>/g, '')
      .replace(/<br><br>/g, '<br>');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
          <style>
            :root {
              --primary-color: #0066cc;
              --text-color: #2d3436;
              --bg-color: transparent;
              --quote-bg: #f0f7ff;
            }

            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              font-size: 17px;
              line-height: 1.65;
              color: var(--text-color);
              background-color: var(--bg-color);
              padding: 0px 20px 20px 20px;
              -webkit-font-smoothing: antialiased;
            }

            h1, h2, h3 {
              color: #1a1a1a;
              font-weight: 700;
              margin-top: 32px;
              margin-bottom: 12px;
              letter-spacing: -0.5px;
              text-align: left;
            }
            
            h1 { font-size: 26px; line-height: 1.3; }
            
            h2 { 
              font-size: 20px; 
              color: var(--primary-color); 
            }

            p { 
              margin-bottom: 20px; 
              text-align: justify;
              -webkit-hyphens: auto;
              -moz-hyphens: auto;
              -ms-hyphens: auto;
              hyphens: auto;
            }

            strong, b {
              color: #000;
              font-weight: 700;
            }

            ul, ol {
              margin-bottom: 24px;
              padding-left: 0;
            }
            
            li {
              list-style: none;
              position: relative;
              padding-left: 24px;
              margin-bottom: 12px;
              text-align: left;
            }

            li::before {
              content: "•";
              color: var(--primary-color);
              font-weight: bold;
              font-size: 1.2em;
              position: absolute;
              left: 0;
              top: -2px;
            }

            ol { counter-reset: item; }
            ol li::before {
              content: counter(item) "."; 
              counter-increment: item;
              font-size: 1em;
              font-weight: 700;
            }

            img, iframe, .ql-video {
              width: 100% !important;
              border-radius: 12px;
              display: block;
              margin: 24px 0;
              box-shadow: 0 8px 20px rgba(0,0,0,0.08); 
            }
            
            iframe, .ql-video {
              height: 210px !important;
              border: none;
            }

            blockquote {
              background-color: var(--quote-bg);
              border-left: 4px solid var(--primary-color);
              padding: 16px 20px;
              margin: 24px 0;
              border-radius: 0 8px 8px 0;
              font-style: italic;
              color: #444;
              text-align: left;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin: 16px 0;
            }

            th, td {
              border: 1px solid #ccc;
              padding: 8px;
            }

            table {
              display: block;
              overflow-x: auto;
            }

            a {
              color: var(--primary-color);
              text-decoration: none;
              border-bottom: 1px solid rgba(0, 102, 204, 0.3);
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          ${processedContent}
        </body>
      </html>
    `;
  }, [content]);

  return (
    <WebView
      style={styles.container}
      originWhitelist={['*']}
      source={{ html: htmlContent, baseUrl: 'https://www.google.com' }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsFullscreenVideo={true}
      setBuiltInZoomControls={true}
      setDisplayZoomControls={false}
      scalesPageToFit={true}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
