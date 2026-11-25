# Previsão do Tempo

Aplicação de previsão do tempo feita com HTML, CSS e JavaScript puro, consumindo uma API pública em tempo real.

**Demo ao vivo:** https://takkedaz.github.io/previsao-tempo/

## Funcionalidades

- Busca de clima por nome de cidade
- Clima atual: temperatura, condição, vento, máxima/mínima do dia
- Previsão dos próximos 6 dias
- Tratamento de erros (cidade não encontrada, falha de rede)

## Tecnologias

- HTML5 / CSS3 / JavaScript (Vanilla JS)
- `fetch` + `async/await` para consumo de API
- [Open-Meteo API](https://open-meteo.com/) — geocodificação e previsão do tempo (gratuita, sem necessidade de chave de API)

## Como rodar localmente

Basta abrir o arquivo `index.html` em qualquer navegador. Não precisa de instalação, build nem chave de API.

## O que esse projeto demonstra

- Consumo de API REST externa (requisições assíncronas)
- Tratamento de erros em chamadas de rede
- Transformação de dados da API (códigos meteorológicos) em informação legível
- Renderização dinâmica de listas (previsão dos dias)
