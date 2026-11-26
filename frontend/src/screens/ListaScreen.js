import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Banner from '../components/Banner';
import Seletor from '../components/Seletor';
import { publicacoesApi } from '../api/publicacoesApi';
import { CATEGORIAS, STATUS, rotuloDe } from '../constants/opcoes';
import { formatarData } from '../utils/formatarData';
import { cores } from '../theme';

export default function ListaScreen({ navigation, route }) {
  const [publicacoes, setPublicacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [busca, setBusca] = useState('');
  const [filtros, setFiltros] = useState({
    titulo: '',
    categoria: '',
    sort: 'dataPublicacao',
    direction: 'desc',
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await publicacoesApi.listar(filtros);
      setPublicacoes(dados);
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: e.message });
    } finally {
      setCarregando(false);
    }
  }, [filtros]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  useEffect(() => {
    if (route.params?.mensagem) {
      setMensagem(route.params.mensagem);
    }
  }, [route.params?.ts]);

  useEffect(() => {
    if (!mensagem) {
      return undefined;
    }
    const temporizador = setTimeout(() => setMensagem(null), 4000);
    return () => clearTimeout(temporizador);
  }, [mensagem]);

  function pesquisar() {
    setFiltros((atual) => ({ ...atual, titulo: busca.trim() }));
  }

  function limparBusca() {
    setBusca('');
    setFiltros((atual) => ({ ...atual, titulo: '' }));
  }

  function ordenarPor(campo) {
    setFiltros((atual) => ({
      ...atual,
      sort: campo,
      direction: atual.sort === campo && atual.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  function seta(campo) {
    if (filtros.sort !== campo) {
      return '';
    }
    return filtros.direction === 'asc' ? ' ▲' : ' ▼';
  }

  function confirmarExclusao(item) {
    Alert.alert('Confirmar exclusão', `Tem certeza de que deseja excluir "${item.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluir(item.id) },
    ]);
  }

  async function excluir(id) {
    try {
      await publicacoesApi.excluir(id);
      setMensagem({ tipo: 'sucesso', texto: 'Publicação excluída com sucesso.' });
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: e.message });
    }
    carregar();
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={estilos.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Detalhes', { id: item.id })}
      >
        <View style={estilos.cardTopo}>
          <Text style={estilos.categoria}>
            #{item.id} · {rotuloDe(CATEGORIAS, item.categoria)}
          </Text>
          <View style={[estilos.selo, estilos[`selo${item.status}`]]}>
            <Text style={estilos.seloTexto}>{rotuloDe(STATUS, item.status)}</Text>
          </View>
        </View>
        <Text style={estilos.titulo}>{item.titulo}</Text>
        <Text style={estilos.meta}>
          {item.anonima ? 'Anônima' : item.autora || 'Sem autoria'} · {formatarData(item.dataPublicacao)}
        </Text>
        <View style={estilos.acoes}>
          <TouchableOpacity
            style={estilos.botaoEditar}
            onPress={() => navigation.navigate('Formulario', { publicacao: item })}
          >
            <Text style={estilos.botaoEditarTexto}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={estilos.botaoExcluir} onPress={() => confirmarExclusao(item)}>
            <Text style={estilos.botaoExcluirTexto}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={estilos.tela}>
      <Banner mensagem={mensagem} onFechar={() => setMensagem(null)} />

      <View style={estilos.busca}>
        <TextInput
          style={estilos.input}
          placeholder="Pesquisar por título..."
          placeholderTextColor={cores.textoSuave}
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={pesquisar}
          returnKeyType="search"
        />
        <TouchableOpacity style={estilos.botaoBuscar} onPress={pesquisar}>
          <Text style={estilos.botaoBuscarTexto}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {filtros.titulo ? (
        <TouchableOpacity onPress={limparBusca}>
          <Text style={estilos.limpar}>Limpar busca: "{filtros.titulo}"</Text>
        </TouchableOpacity>
      ) : null}

      <Seletor
        comTodas
        opcoes={CATEGORIAS}
        valor={filtros.categoria}
        onChange={(valor) => setFiltros((atual) => ({ ...atual, categoria: valor }))}
      />

      <View style={estilos.ordenacao}>
        <Text style={estilos.rotuloOrdenar}>Ordenar por:</Text>
        <TouchableOpacity
          style={[estilos.ordem, filtros.sort === 'titulo' && estilos.ordemAtiva]}
          onPress={() => ordenarPor('titulo')}
        >
          <Text style={[estilos.ordemTexto, filtros.sort === 'titulo' && estilos.ordemTextoAtivo]}>
            Título{seta('titulo')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.ordem, filtros.sort === 'dataPublicacao' && estilos.ordemAtiva]}
          onPress={() => ordenarPor('dataPublicacao')}
        >
          <Text
            style={[estilos.ordemTexto, filtros.sort === 'dataPublicacao' && estilos.ordemTextoAtivo]}
          >
            Data{seta('dataPublicacao')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={estilos.contador}>{publicacoes.length} publicação(ões) encontrada(s)</Text>

      <FlatList
        data={publicacoes}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshing={carregando}
        onRefresh={carregar}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={
          carregando ? null : <Text style={estilos.vazio}>Nenhuma publicação encontrada.</Text>
        }
      />

      <TouchableOpacity style={estilos.botaoNova} onPress={() => navigation.navigate('Formulario')}>
        <Text style={estilos.botaoNovaTexto}>+ Nova publicação</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: 16, backgroundColor: cores.fundo },
  busca: { flexDirection: 'row', marginBottom: 8 },
  input: {
    flex: 1,
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: cores.texto,
  },
  botaoBuscar: {
    backgroundColor: cores.primaria,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginLeft: 8,
  },
  botaoBuscarTexto: { color: cores.branco, fontWeight: '600' },
  limpar: { color: cores.primaria, marginBottom: 8, fontSize: 13 },
  ordenacao: { flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 6 },
  rotuloOrdenar: { color: cores.textoSuave, marginRight: 8, fontSize: 13 },
  ordem: {
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  ordemAtiva: { backgroundColor: cores.secundaria, borderColor: cores.secundaria },
  ordemTexto: { color: cores.texto, fontSize: 13 },
  ordemTextoAtivo: { fontWeight: '700' },
  contador: { color: cores.textoSuave, fontSize: 12, marginBottom: 6 },
  lista: { paddingBottom: 90 },
  vazio: { textAlign: 'center', color: cores.textoSuave, marginTop: 30 },
  card: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  cardTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoria: { color: cores.primaria, fontSize: 12, fontWeight: '600', flexShrink: 1 },
  selo: { borderRadius: 10, paddingVertical: 2, paddingHorizontal: 8 },
  seloPUBLICADA: { backgroundColor: cores.sucesso },
  seloRASCUNHO: { backgroundColor: cores.textoSuave },
  seloARQUIVADA: { backgroundColor: cores.texto },
  seloTexto: { color: cores.branco, fontSize: 11, fontWeight: '600' },
  titulo: { fontSize: 17, fontWeight: '700', color: cores.texto, marginTop: 6 },
  meta: { color: cores.textoSuave, fontSize: 12, marginTop: 4 },
  acoes: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  botaoEditar: {
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  botaoEditarTexto: { color: cores.primaria, fontWeight: '600' },
  botaoExcluir: {
    borderWidth: 1,
    borderColor: cores.erro,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  botaoExcluirTexto: { color: cores.erro, fontWeight: '600' },
  botaoNova: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: cores.primaria,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botaoNovaTexto: { color: cores.branco, fontWeight: '700', fontSize: 16 },
});
