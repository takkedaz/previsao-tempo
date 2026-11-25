const input = document.getElementById('input-cidade');
const btnBuscar = document.getElementById('btn-buscar');
const mensagem = document.getElementById('mensagem');
const resultado = document.getElementById('resultado');

const URL_GEOCODING = 'https://geocoding-api.open-meteo.com/v1/search';
const URL_PREVISAO = 'https://api.open-meteo.com/v1/forecast';

const CODIGOS_CLIMA = {
  0: { icone: '☀️', descricao: 'Céu limpo' },
  1: { icone: '🌤️', descricao: 'Predominantemente limpo' },
  2: { icone: '⛅', descricao: 'Parcialmente nublado' },
  3: { icone: '☁️', descricao: 'Nublado' },
  45: { icone: '🌫️', descricao: 'Nevoeiro' },
  48: { icone: '🌫️', descricao: 'Nevoeiro com geada' },
  51: { icone: '🌦️', descricao: 'Garoa leve' },
  53: { icone: '🌦️', descricao: 'Garoa moderada' },
  55: { icone: '🌦️', descricao: 'Garoa intensa' },
  61: { icone: '🌧️', descricao: 'Chuva leve' },
  63: { icone: '🌧️', descricao: 'Chuva moderada' },
  65: { icone: '🌧️', descricao: 'Chuva forte' },
  71: { icone: '❄️', descricao: 'Neve leve' },
  73: { icone: '❄️', descricao: 'Neve moderada' },
  75: { icone: '❄️', descricao: 'Neve forte' },
  80: { icone: '🌦️', descricao: 'Pancadas de chuva leves' },
  81: { icone: '🌦️', descricao: 'Pancadas de chuva moderadas' },
  82: { icone: '🌧️', descricao: 'Pancadas de chuva fortes' },
  95: { icone: '⛈️', descricao: 'Trovoada' },
  96: { icone: '⛈️', descricao: 'Trovoada com granizo' },
  99: { icone: '⛈️', descricao: 'Trovoada com granizo forte' },
};

function infoClima(codigo) {
  return CODIGOS_CLIMA[codigo] || { icone: '🌡️', descricao: 'Sem informação' };
}

function mostrarMensagem(texto) {
  mensagem.textContent = texto;
  mensagem.hidden = false;
  resultado.hidden = true;
}

async function buscarCoordenadas(cidade) {
  const url = `${URL_GEOCODING}?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
  const resposta = await fetch(url);
  const dados = await resposta.json();

  if (!dados.results || dados.results.length === 0) return null;

  const local = dados.results[0];
  return {
    nome: local.name,
    pais: local.country,
    latitude: local.latitude,
    longitude: local.longitude,
  };
}

async function buscarPrevisao(latitude, longitude) {
  const url = `${URL_PREVISAO}?latitude=${latitude}&longitude=${longitude}` +
    `&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
  const resposta = await fetch(url);
  return resposta.json();
}

function renderizarProximosDias(daily) {
  const container = document.getElementById('previsao-dias');
  container.innerHTML = '';

  for (let i = 1; i < daily.time.length; i++) {
    const data = new Date(daily.time[i] + 'T00:00:00');
    const diaSemana = data.toLocaleDateString('pt-BR', { weekday: 'short' });
    const { icone } = infoClima(daily.weathercode[i]);

    const card = document.createElement('div');
    card.classList.add('card-dia');
    card.innerHTML = `
      <span class="dia">${diaSemana}</span>
      <span class="icone-dia">${icone}</span>
      <span class="temp-dia">${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°</span>
    `;
    container.appendChild(card);
  }
}

async function buscarClima() {
  const cidade = input.value.trim();
  if (cidade === '') return;

  mostrarMensagem('Buscando...');

  try {
    const local = await buscarCoordenadas(cidade);
    if (!local) {
      mostrarMensagem('Cidade não encontrada. Tente outro nome.');
      return;
    }

    const previsao = await buscarPrevisao(local.latitude, local.longitude);
    const atual = previsao.current_weather;
    const { icone, descricao } = infoClima(atual.weathercode);

    document.getElementById('nome-cidade').textContent = local.nome;
    document.getElementById('pais-cidade').textContent = local.pais;
    document.getElementById('icone-atual').textContent = icone;
    document.getElementById('temp-atual').textContent = `${Math.round(atual.temperature)}°C`;
    document.getElementById('descricao-atual').textContent = descricao;
    document.getElementById('vento-atual').textContent = `${Math.round(atual.windspeed)} km/h`;
    document.getElementById('max-min-hoje').textContent =
      `${Math.round(previsao.daily.temperature_2m_max[0])}° / ${Math.round(previsao.daily.temperature_2m_min[0])}°`;

    renderizarProximosDias(previsao.daily);

    mensagem.hidden = true;
    resultado.hidden = false;
  } catch (erro) {
    console.error(erro);
    mostrarMensagem('Não foi possível buscar o clima agora. Tente de novo em alguns segundos.');
  }
}

btnBuscar.addEventListener('click', buscarClima);

input.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') buscarClima();
});
