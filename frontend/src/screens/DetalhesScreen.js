import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Banner from '../components/Banner';
import { publicacoesApi } from '../api/publicacoesApi';
import { CATEGORIAS, STATUS, rotuloDe } from '../constants/opcoes';
import { formatarData } from '../utils/formatarData';
import { cores } from '../theme';

export default function DetalhesScreen({ navigation, route }) {
  const { id } = route.params;
  const [publicacao, setPublicacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregar() {
        setCarregando(true);
        try {
          const dados = await publicacoesApi.buscar(id);
          if (ativo) {
            setPublicacao(dados);
            setMensagem(null);
          }
        } catch (e) {
          if (ativo) {
            setPublicacao(null);
            setMensagem({ tipo: 'erro', texto: e.message });
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregar();
      return () => {
        ativo = false;
      };
    }, [id])
  );

  function confirmarExclusao() {
    Alert.alert('Confirmar exclusão', `Tem certeza de que deseja excluir "${publicacao.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: excluir },
    ]);
  }

  async function excluir() {
    try {
      await publicacoesApi.excluir(id);
      navigation.navigate('Lista', {
        mensagem: { tipo: 'sucesso', texto: 'Publicação excluída com sucesso.' },
        ts: Date.now(),
      });
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: e.message });
    }
  }

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  if (!publicacao) {
    return (
      <View style={estilos.tela}>
        <Banner mensagem={mensagem} onFechar={() => setMensagem(null)} />
        <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navigation.goBack()}>
          <Text style={estilos.botaoVoltarTexto}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const listaTags = publicacao.tags
    ? publicacao.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <Banner mensagem={mensagem} onFechar={() => setMensagem(null)} />

      <View style={estilos.card}>
        <View style={estilos.topo}>
          <Text style={estilos.categoria}>{rotuloDe(CATEGORIAS, publicacao.categoria)}</Text>
          <View style={[estilos.selo, estilos[`selo${publicacao.status}`]]}>
            <Text style={estilos.seloTexto}>{rotuloDe(STATUS, publicacao.status)}</Text>
          </View>
        </View>

        <Text style={estilos.titulo}>{publicacao.titulo}</Text>
        <Text style={estilos.meta}>
          {publicacao.anonima ? 'Anônima' : publicacao.autora || 'Sem autoria'} ·{' '}
          {formatarData(publicacao.dataPublicacao)}
        </Text>

        <Text style={estilos.texto}>{publicacao.conteudo}</Text>

        {listaTags.length > 0 ? (
          <View style={estilos.tags}>
            {listaTags.map((tag) => (
              <View key={tag} style={estilos.tag}>
                <Text style={estilos.tagTexto}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={estilos.botoes}>
        <TouchableOpacity style={estilos.botaoExcluir} onPress={confirmarExclusao}>
          <Text style={estilos.botaoExcluirTexto}>Excluir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={estilos.botaoEditar}
          onPress={() => navigation.navigate('Formulario', { publicacao })}
        >
          <Text style={estilos.botaoEditarTexto}>Editar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo, padding: 16 },
  conteudo: { paddingBottom: 40 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo },
  card: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoria: { color: cores.primaria, fontWeight: '600', fontSize: 13, flexShrink: 1 },
  selo: { borderRadius: 10, paddingVertical: 2, paddingHorizontal: 8 },
  seloPUBLICADA: { backgroundColor: cores.sucesso },
  seloRASCUNHO: { backgroundColor: cores.textoSuave },
  seloARQUIVADA: { backgroundColor: cores.texto },
  seloTexto: { color: cores.branco, fontSize: 11, fontWeight: '600' },
  titulo: { fontSize: 22, fontWeight: '700', color: cores.texto, marginTop: 10 },
  meta: { color: cores.textoSuave, fontSize: 13, marginTop: 4, marginBottom: 14 },
  texto: { color: cores.texto, fontSize: 15, lineHeight: 22 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 },
  tag: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  tagTexto: { color: cores.textoSuave, fontSize: 12 },
  botoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  botaoExcluir: {
    borderWidth: 1,
    borderColor: cores.erro,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  botaoExcluirTexto: { color: cores.erro, fontWeight: '700' },
  botaoEditar: {
    backgroundColor: cores.primaria,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 26,
  },
  botaoEditarTexto: { color: cores.branco, fontWeight: '700' },
  botaoVoltar: {
    backgroundColor: cores.primaria,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botaoVoltarTexto: { color: cores.branco, fontWeight: '700' },
});
