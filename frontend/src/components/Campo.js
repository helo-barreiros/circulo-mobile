import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { cores } from '../theme';

export default function Campo({ rotulo, dica, erro, children }) {
  return (
    <View style={estilos.campo}>
      <Text style={estilos.rotulo}>
        {rotulo}
        {dica ? <Text style={estilos.dica}> {dica}</Text> : null}
      </Text>
      {children}
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  campo: { marginBottom: 14 },
  rotulo: { fontSize: 14, fontWeight: '600', color: cores.texto, marginBottom: 6 },
  dica: { fontWeight: '400', color: cores.textoSuave },
  erro: { color: cores.erro, fontSize: 12, marginTop: 4 },
});
