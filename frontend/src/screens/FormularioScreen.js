import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Banner from '../components/Banner';
import Campo from '../components/Campo';
import Seletor from '../components/Seletor';
import { publicacoesApi } from '../api/publicacoesApi';
import { CATEGORIAS, STATUS } from '../constants/opcoes';
import { cores } from '../theme';

function traduzirErro(texto) {
  if (/must not be (blank|null|empty)/i.test(texto)) {
    return 'Campo obrigatório.';
  }
  if (/size must be/i.test(texto)) {
    return 'Tamanho inválido para este campo.';
  }
  return texto || 'Valor inválido.';
  }

export default function FormularioScreen({ navigation, route }) {
  const original = route.params?.publicacao;
  const editando = Boolean(original);

  const [titulo, setTitulo] = useState(original?.titulo || '');
  const [anonima, setAnonima] = useState(Boolean(original?.anonima));
  const [autora, setAutora] = useState(original?.autora || '');
  const [categoria, setCategoria] = useState(original?.categoria || '');
  const [status, setStatus] = useState(original?.status || '');
  const [conteudo, setConteudo] = useState(original?.conteudo || '');
  const [tags, setTags] = useState(original?.tags || '');
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState(null);
  const [salvando, setSalvando] = useState(false);

  function validar() {
    const novos = {};
    const tituloLimpo = titulo.trim();
    const conteudoLimpo = conteudo.trim();

    if (!tituloLimpo) {
      novos.titulo = 'O título é obrigatório.';
    } else if (tituloLimpo.length < 5 || tituloLimpo.length > 100) {
      novos.titulo = 'O título deve possuir entre 5 e 100 caracteres.';
    }

    if (!categoria) {
      novos.categoria = 'Selecione uma categoria.';
    }

    if (!status) {
      novos.status = 'Selecione um status.';
    }

    if (!conteudoLimpo) {
      novos.conteudo = 'O conteúdo da publicação é obrigatório.';
    } else if (conteudoLimpo.length < 20 || conteudoLimpo.length > 2000) {
      novos.conteudo = 'O conteúdo deve possuir entre 20 e 2000 caracteres.';
    }

    if (autora.length > 80) {
      novos.autora = 'A autora deve possuir no máximo 80 caracteres.';
    }

    if (tags.length > 150) {
      novos.tags = 'As tags devem possuir no máximo 150 caracteres.';
    }

    return novos;
  }

  function alternarAnonima(valor) {
    setAnonima(valor);
    if (valor) {
      setAutora('');
    }
  }

  async function salvar() {
    const novos = validar();
    setErros(novos);

    if (Object.keys(novos).length > 0) {
      setMensagem({ tipo: 'erro', texto: 'Corrija os campos destacados.' });
      return;
    }

    setMensagem(null);
    setSalvando(true);

    const dados = {
      titulo: titulo.trim(),
      autora: anonima ? null : autora.trim() || null,
      anonima,
      categoria,
      status,
      conteudo: conteudo.trim(),
      tags: tags.trim() || null,
    };

    try {
      if (editando) {
        await publicacoesApi.atualizar(original.id, dados);
      } else {
        await publicacoesApi.criar(dados);
      }
      navigation.navigate('Lista', {
        mensagem: {
          tipo: 'sucesso',
          texto: editando ? 'Publicação atualizada com sucesso.' : 'Publicação cadastrada com sucesso.',
        },
        ts: Date.now(),
      });
    } catch (e) {
      if (e.erros) {
        const doServidor = {};
        Object.entries(e.erros).forEach(([campo, texto]) => {
          doServidor[campo] = traduzirErro(texto);
        });
        setErros(doServidor);
        setMensagem({ tipo: 'erro', texto: 'Corrija os campos destacados.' });
      } else {
        setMensagem({ tipo: 'erro', texto: e.message });
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Banner mensagem={mensagem} onFechar={() => setMensagem(null)} />

        <Campo rotulo="Título *" erro={erros.titulo}>
          <TextInput
            style={[estilos.input, erros.titulo && estilos.inputErro]}
            value={titulo}
            onChangeText={setTitulo}
	    maxLength={100}
            placeholder="Ex.: Como organizar meu autocuidado"
            placeholderTextColor={cores.textoSuave}
          />
        </Campo>

        <View style={estilos.linhaSwitch}>
          <Text style={estilos.textoSwitch}>Publicar de forma anônima</Text>
          <Switch
            value={anonima}
            onValueChange={alternarAnonima}
            trackColor={{ false: cores.borda, true: cores.primariaClara }}
            thumbColor={cores.branco}
          />
        </View>

        <Campo rotulo="Autora" dica="(opcional se anônima)" erro={erros.autora}>
          <TextInput
            style={[estilos.input, erros.autora && estilos.inputErro, anonima && estilos.inputDesabilitado]}
            value={autora}
            onChangeText={setAutora}
	    maxLength={80}
            editable={!anonima}
            placeholder="Ex.: Ana"
            placeholderTextColor={cores.textoSuave}
          />
        </Campo>

        <Campo rotulo="Categoria *" erro={erros.categoria}>
          <Seletor quebra opcoes={CATEGORIAS} valor={categoria} onChange={setCategoria} />
        </Campo>

        <Campo rotulo="Status *" erro={erros.status}>
          <Seletor quebra opcoes={STATUS} valor={status} onChange={setStatus} />
        </Campo>

        <Campo rotulo="Conteúdo *" dica={`(${conteudo.length}/2000)`} erro={erros.conteudo}>
          <TextInput
            style={[estilos.input, estilos.areaTexto, erros.conteudo && estilos.inputErro]}
            value={conteudo}
            onChangeText={setConteudo}
	    maxLength={2000}
            multiline
            textAlignVertical="top"
            placeholder="Escreva o relato ou a informação da publicação"
            placeholderTextColor={cores.textoSuave}
          />
        </Campo>

        <Campo rotulo="Tags" dica="(separadas por vírgula, opcional)" erro={erros.tags}>
          <TextInput
            style={[estilos.input, erros.tags && estilos.inputErro]}
            value={tags}
            onChangeText={setTags}
	    maxLength={150}
            placeholder="Ex.: autocuidado, rotina"
            placeholderTextColor={cores.textoSuave}
          />
        </Campo>

        <View style={estilos.botoes}>
          <TouchableOpacity style={estilos.botaoCancelar} onPress={() => navigation.goBack()}>
            <Text style={estilos.botaoCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[estilos.botaoSalvar, salvando && estilos.botaoDesabilitado]}
            onPress={salvar}
            disabled={salvando}
          >
            <Text style={estilos.botaoSalvarTexto}>{salvando ? 'Salvando...' : 'Salvar publicação'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 16, paddingBottom: 40 },
  input: {
    backgroundColor: cores.branco,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: cores.texto,
  },
  inputErro: { borderColor: cores.erro },
  inputDesabilitado: { opacity: 0.5 },
  areaTexto: { minHeight: 130 },
  linhaSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  textoSwitch: { fontSize: 14, fontWeight: '600', color: cores.texto },
  botoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  botaoCancelar: {
    borderWidth: 1,
    borderColor: cores.textoSuave,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  botaoCancelarTexto: { color: cores.textoSuave, fontWeight: '600' },
  botaoSalvar: {
    backgroundColor: cores.primaria,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  botaoDesabilitado: { opacity: 0.6 },
  botaoSalvarTexto: { color: cores.branco, fontWeight: '700' },
});
