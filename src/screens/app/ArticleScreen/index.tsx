import React from 'react';
import { ScrollView, Text, Image, useWindowDimensions, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/article';
import RenderHtml from 'react-native-render-html';

type Props = NativeStackScreenProps<RootStackParamList, 'Article'>;

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: "#ccc"
  },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc"
  },
  td: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderColor: "#ccc"
  },
  th: {
    backgroundColor: "#eee"
  },
  thText: {
    fontWeight: "bold"
  }
});

function getCellText(tnode: any) {
  const firstChild = tnode.children?.[0];

  // se for nó de texto:
  if (firstChild?.type === "text") {
    return firstChild.data;
  }

  // se tiver elementos dentro (não texto puro), renderize simplesmente o conteúdo HTML
  return "";
}


export default function ArticleScreen({ route }: Props) {
  const { article } = route.params;
  const { width } = useWindowDimensions();

  return (
    <ScrollView style={{ padding: 20 }}>
      <Image
        source={{ uri: article.image }}
        style={{
          width: '100%',
          height: 200,
          borderRadius: 10,
          marginBottom: 20
        }}
      />

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {article.title}
      </Text>

      {article.content.includes('</') ?

        <RenderHtml
          contentWidth={width}
          source={{ html: article.content }}
          enableExperimentalMarginCollapsing={true}
          tagsStyles={{
            h1: { fontSize: 26, fontWeight: 'bold', marginBottom: 12 },
            h2: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
            p: { marginBottom: 12, fontSize: 16, lineHeight: 22 },
            blockquote: {
              borderLeftWidth: 4,
              borderLeftColor: '#999',
              paddingLeft: 10,
              marginVertical: 10,
              fontStyle: 'italic'
            },
            table: { borderWidth: 1 },
            th: { fontWeight: 'bold', backgroundColor: '#eee' },
            code: {
              backgroundColor: '#f4f4f4',
              padding: 10,
              borderRadius: 6,
              fontSize: 13,
              fontFamily: 'monospace'
            },
            img: {
              width: '100%',     // garante que a imagem aparece
              height: 'auto',
            },
          }}
          renderers={{
            img: ({ tnode }: { tnode: any }) => {
              const src = tnode.attributes.src;
              return (
                <Image
                  source={{ uri: src }}
                  style={{
                    width: width - 32, // importante no Expo
                    height: 200,       // definir altura é OBRIGATÓRIO no Expo
                    resizeMode: "contain"
                  }}
                />
              );
            },
            /* table: ({ TDefaultRenderer, tnode }: { tnode: any, TDefaultRenderer: any }) => (
              <View style={styles.table}>
                <TDefaultRenderer tnode={tnode} />
              </View>
            ),

            tr: ({ TDefaultRenderer, tnode }: { tnode: any, TDefaultRenderer: any }) => (
              <View style={styles.tr}>
                <TDefaultRenderer tnode={tnode} />
              </View>
            ),

            th: ({ tnode }: { tnode: any }) => (
              <View style={[styles.td, styles.th]}>
                <Text style={styles.thText}>{getCellText(tnode)}</Text>
              </View>
            ),

            td: ({ tnode }: { tnode: any }) => (
              <View style={styles.td}>
                <Text>{getCellText(tnode)}</Text>
              </View>
            ) */
          }}
        /> :
        <Text style={{ fontSize: 18, lineHeight: 28 }}>
          {article.content}
        </Text>
      }
    </ScrollView>
  );
}