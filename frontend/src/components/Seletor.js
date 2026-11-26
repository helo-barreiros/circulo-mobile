import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cores } from '../theme';

export default function Seletor({ opcoes, valor, onChange, comTodas = false, quebra = false }) {
  const lista = comTodas ? [{ valor: '', rotulo: 'Todas' }, ...opcoes] : opcoes;

  const chips = lista.map((opcao) => {
    const ativo = opcao.valor === valor;
    return (
      <TouchableOpacity
        key={opcao.valor || 'todas'}
        style={[estilos.chip, ativo && estilos.chipAtivo]}
        onPress={() => onChange(opcao.valor)}
      >
        <Text style={[estilos.chipTexto, ativo && estilos.chipTextoAtivo]}>{opcao.rotulo}</Text>
      </TouchableOpacity>
    );
  });

  if (quebra) {
    return <View style={estilos.quebra}>{chips}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={estilos.rolagem}
      contentContainerStyle={estilos.linha}
    >
      {chips}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  rolagem: { flexGrow: 0 },
  linha: { paddingVertical: 4 },
  quebra: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  chipAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  chipTexto: { color: cores.texto, fontSize: 13 },
  chipTextoAtivo: { color: cores.branco, fontWeight: '600' },
});
