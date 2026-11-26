export function formatarData(iso) {
  if (!iso) {
    return '';
  }
  const [data, hora] = iso.split('T');
  const [ano, mes, dia] = data.split('-');
  const [h, m] = (hora || '00:00').split(':');
  return `${dia}/${mes}/${ano} ${h}:${m}`;
}
