import { API_URL } from '../config';

function montarQuery(filtros) {
  return Object.entries(filtros)
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== '')
    .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(valor)}`)
    .join('&');
}

async function requisicao(url, opcoes) {
  let resposta;
  try {
    resposta = await fetch(url, opcoes);
  } catch (e) {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  if (resposta.status === 204) {
    return null;
  }

  let corpo = null;
  try {
    corpo = await resposta.json();
  } catch (e) {
    corpo = null;
  }

  if (!resposta.ok) {
    const erro = new Error((corpo && corpo.mensagem) || 'Ocorreu um erro inesperado.');
    erro.status = resposta.status;
    erro.erros = corpo && corpo.erros;
    throw erro;
  }

  return corpo;
}

const cabecalhos = { 'Content-Type': 'application/json' };

export const publicacoesApi = {
  listar(filtros) {
    const query = montarQuery(filtros);
    return requisicao(query ? `${API_URL}?${query}` : API_URL);
  },

  buscar(id) {
    return requisicao(`${API_URL}/${id}`);
  },

  criar(dados) {
    return requisicao(API_URL, {
      method: 'POST',
      headers: cabecalhos,
      body: JSON.stringify(dados),
    });
  },

  atualizar(id, dados) {
    return requisicao(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: cabecalhos,
      body: JSON.stringify(dados),
    });
  },

  excluir(id) {
    return requisicao(`${API_URL}/${id}`, { method: 'DELETE' });
  },
};
