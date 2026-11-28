import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AvisoSaude from '../components/AvisoSaude';
import { cores } from '../theme';

export default function SobreScreen() {
  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.card}>
        <Text style={estilos.titulo}>Sobre o Círculo</Text>
        <Text style={estilos.paragrafo}>
          O <Text style={estilos.negrito}>Círculo</Text> é uma comunidade educacional e de acolhimento
          onde integrantes podem compartilhar publicações sobre saúde feminina, bem-estar emocional,
          maternidade, autocuidado e rede de apoio.
        </Text>
        <Text style={estilos.paragrafo}>
          Este é um projeto acadêmico desenvolvido para a disciplina de Laboratório de Programação. O
          aplicativo permite cadastrar, listar, editar, excluir, pesquisar e ordenar publicações, e se
          comunica com um back-end em Java com Spring Boot e banco de dados MySQL.
        </Text>
      </View>
      <AvisoSaude />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  titulo: { fontSize: 22, fontWeight: '700', color: cores.texto, marginBottom: 12 },
  paragrafo: { color: cores.texto, fontSize: 15, lineHeight: 22, marginBottom: 12 },
  negrito: { fontWeight: '700' },
});
