import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', // Coloca lado a lado
    justifyContent: 'space-between', // Separa o texto do botão
    alignItems: 'center', // Centraliza verticalmente
    padding: 16, 
    backgroundColor: '#2E97BE' 
  },
  closeBtn: { padding: 5, backgroundColor: '#fff', borderRadius: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 16 },
  footer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderColor: '#eee' },
  btn: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 6 },
  btnCancel: { backgroundColor: '#ccc' },
  btnSubmit: { backgroundColor: '#2E97BE' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16, // Dá um espaço antes do botão de fechar
  },
});