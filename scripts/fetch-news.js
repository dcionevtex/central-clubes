
import Parser from 'rss-parser';
import slugify from 'slugify';
import fs from 'fs/promises';
import path from 'path';

const parser = new Parser();
const OUTPUT_DIR = './src/content/noticias';

// URL do Google News filtrada para "São Paulo FC" nas últimas 24h, Brasil
const FEED_URL = 'https://news.google.com/rss/search?q=Sao+Paulo+FC+when:1d&hl=pt-BR&gl=BR&ceid=BR:pt-419';

async function fetchNews() {
  console.log('🇾🇪  Agente Tricolor: Buscando notícias frescas...');
  
  try {
    const feed = await parser.parseURL(FEED_URL);
    console.log(`📡  Encontradas ${feed.items.length} notícias.`);

    // Garante que o diretório existe
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    for (const item of feed.items) {
      // Limpeza básica do título (remove o nome do jornal no final, ex: " - Globo Esporte")
      const cleanTitle = item.title.split(' - ')[0];
      const source = item.title.split(' - ')[1] || 'Google News';
      
      const slug = slugify(cleanTitle, { lower: true, strict: true });
      const fileName = `${slug}.md`;
      const filePath = path.join(OUTPUT_DIR, fileName);

      // Data de publicação
      const date = new Date(item.pubDate).toISOString();

      // Conteúdo do arquivo (Frontmatter + Corpo)
      // Por enquanto, o corpo é apenas o link e o snippet, pois não podemos copiar a notícia inteira por direitos autorais
      const fileContent = `---
title: "${cleanTitle.replace(/"/g, '\\"')}"
description: "${item.contentSnippet ? item.contentSnippet.replace(/"/g, '\\"') : ''}"
pubDate: "${date}"
source: "${source}"
link: "${item.link}"
---

### Fonte Original: ${source}

[Ler matéria completa no site original](${item.link})

*Esta notícia foi coletada automaticamente pelo Agente Central SPFC.*
`;

      // Evita sobrescrever se já existir (opcional, mas bom para performance)
      try {
        await fs.access(filePath);
        // console.log(`⏩  Pulando: ${cleanTitle} (já existe)`);
      } catch {
        await fs.writeFile(filePath, fileContent);
        console.log(`✅  Salvo: ${cleanTitle}`);
      }
    }

    console.log('🏁  Processo finalizado com sucesso.');

  } catch (error) {
    console.error('❌  Erro ao buscar notícias:', error);
    process.exit(1);
  }
}

fetchNews();
