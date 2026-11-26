import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { cores } from '../theme';

export default function Banner({ mensagem, onFechar }) {
  if (!mensagem) {
    return null;
  }

  const sucesso = mensagem.tipo === 'sucesso';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onFechar}
      style={[estilos.caixa, sucesso ? estilos.caixaSucesso : estilos.caixaErro]}
    >
      <Text style={[estilos.texto, sucesso ? estilos.textoSucesso : estilos.textoErro]}>
        {mensagem.texto}
      </Text>
    </TouchableOpacity>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  caixaSucesso: { backgroundColor: cores.sucessoFundo, borderColor: cores.sucesso },
  caixaErro: { backgroundColor: cores.erroFundo, borderColor: cores.erro },
  texto: { fontSize: 14, fontWeight: '600' },
  textoSucesso: { color: cores.sucesso },
  textoErro: { color: cores.erro },
});
