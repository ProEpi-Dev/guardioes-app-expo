import { StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';

export const styles = StyleSheet.create({
  // Estrutura principal
  itemContainer: { flexDirection: 'row', minHeight: 120, marginBottom: 16 },
  timelineContainer: { width: 45, alignItems: 'center' },

  // Linha e Círculo da Timeline
  verticalLine: {
    position: 'absolute',
    top: 30,
    bottom: -20,
    width: 2,
    backgroundColor: '#cbd5e1', // Cor cinza clara para a linha
    zIndex: -1,
  },
  nodeCircle: {
    width: 22,
    height: 22,
    borderRadius: 11, // Metade da largura/altura para ficar perfeitamente redondo
    zIndex: 1,
    marginTop: 20, // Alinha a bolinha com o meio do card
  },

  // Container do Card
  contentContainer: { flex: 1, paddingRight: 16, paddingBottom: 4 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Bordas arredondadas do card
    borderWidth: 1.5,
    overflow: 'hidden', // Faz a imagem respeitar as bordas arredondadas
    elevation: 3, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  // Bloco da Imagem à esquerda (Simulando a foto)
  imageBlock: {
    width: 100,
    backgroundColor: '#1E293B', // Fundo escuro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  imageText: {
    color: '#FBBF24', // Texto amarelo imitando a camisa da imagem
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
  },

  // Área de Textos à direita
  textContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.secundaria, // Azul padrão dos títulos
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 14,
  },

  // Metadados (Notas e Tentativas)
  metaContainer: {
    marginTop: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  scoreDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  scoreText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  metaTextSmall: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 1,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 8,
    resizeMode: 'cover',
    backgroundColor: '#f0f0f0',
  },
});
