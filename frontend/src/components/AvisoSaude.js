import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../theme';

const AVISO =
  'Esta é uma aplicação acadêmica de acolhimento e compartilhamento de informações. O conteúdo publicado não substitui avaliação, diagnóstico ou acompanhamento realizado por profissionais de saúde.';
const URGENCIA = 'Em situações urgentes, procure os serviços públicos de emergência da sua região.';

export default function AvisoSaude({ compacto = false }) {
  if (compacto) {
    return (
      <View style={estilos.compacto}>
        <Text style={estilos.textoCompacto}>{AVISO}</Text>
        <Text style={estilos.textoCompacto}>{URGENCIA}</Text>
      </View>
    );
  }

  return (
    <View style={estilos.caixa}>
      <Text style={estilos.texto}>
        {AVISO} {URGENCIA}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    backgroundColor: '#FFF4D6',
    borderWidth: 1,
    borderColor: '#E8C766',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  texto: { color: '#6B5200', fontSize: 14, lineHeight: 20 },
  compacto: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  textoCompacto: {
    color: cores.textoSuave,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
});
