export const CATEGORIAS = [
  { valor: 'SAUDE_MENSTRUAL', rotulo: 'Saúde menstrual' },
  { valor: 'BEM_ESTAR_EMOCIONAL', rotulo: 'Bem-estar emocional' },
  { valor: 'MATERNIDADE', rotulo: 'Maternidade' },
  { valor: 'AUTOCUIDADO', rotulo: 'Autocuidado' },
  { valor: 'ALIMENTACAO', rotulo: 'Alimentação' },
  { valor: 'REDE_DE_APOIO', rotulo: 'Rede de apoio' },
  { valor: 'INFORMACAO_EDUCATIVA', rotulo: 'Informação educativa' },
];

export const STATUS = [
  { valor: 'RASCUNHO', rotulo: 'Rascunho' },
  { valor: 'PUBLICADA', rotulo: 'Publicada' },
  { valor: 'ARQUIVADA', rotulo: 'Arquivada' },
];

export function rotuloDe(lista, valor) {
  const item = lista.find((opcao) => opcao.valor === valor);
  return item ? item.rotulo : valor;
}
