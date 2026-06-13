const fs = require('fs');

async function generateGamerGirlGames() {
  try {
    console.log('Fetching games from GameDistribution (25 pages to hit 800+ games)...');
    const pagesToFetch = Array.from({length: 25}, (_, i) => i + 1);
    const gdPages = await Promise.all(pagesToFetch.map(page =>
      fetch(`https://catalog.api.gamedistribution.com/api/v2.0/rss/All/?collection=all&categories=All&type=all&amount=100&page=${page}&format=json`)
        .then(r => r.json())
        .catch(() => [])
    ));
    
    let gdGamesList = gdPages.flat().filter(g => g && g.Md5 && g.Title && g.Url);
    
    // Filter for our target demographic tags
    const targetKeywords = ['girl', 'dress', 'makeup', 'cook', 'bake', 'pet', 'animal', 'cute', 'love', 'date', 'fashion', 'design', 'puzzle', 'match 3', 'decor', 'wedding', 'princess'];
    
    gdGamesList = gdGamesList.filter(g => {
      const tags = (g.Tag || []).map(t => t.toLowerCase()).join(' ');
      const desc = (g.Description || '').toLowerCase();
      const title = g.Title.toLowerCase();
      const combined = `${tags} ${desc} ${title}`;
      
      return targetKeywords.some(keyword => combined.includes(keyword));
    });

    // Deduplicate by Md5
    const uniqueGd = Array.from(new Map(gdGamesList.map(g => [g.Md5, g])).values());
    console.log(`Got ${uniqueGd.length} unique curated games.`);
    
    const mapCategory = (tags, title) => {
      const t = tags.join(' ').toLowerCase() + ' ' + title.toLowerCase();
      if (t.includes('dress') || t.includes('fashion') || t.includes('makeup') || t.includes('wedding')) return 'Fashion & Beauty';
      if (t.includes('cook') || t.includes('bake') || t.includes('restaurant')) return 'Cooking';
      if (t.includes('pet') || t.includes('animal') || t.includes('cat') || t.includes('dog')) return 'Pets & Animals';
      if (t.includes('decor') || t.includes('design') || t.includes('room')) return 'Design';
      if (t.includes('puzzle') || t.includes('match 3') || t.includes('bubble')) return 'Puzzles';
      if (t.includes('sim') || t.includes('life')) return 'Simulation';
      return 'Casual';
    };

    const games = uniqueGd.map(g => ({
      id: g.Md5 || Math.random().toString(36).substr(2, 9),
      title: g.Title,
      description: (g.Description || "No description available.").replace(/<\/?[^>]+(>|$)/g, "").substr(0, 150) + "...",
      category: mapCategory(g.Tag || g.Category || [], g.Title),
      coverUrl: (g.Asset && g.Asset[0]) ? g.Asset[0] : "https://gamedistribution.com/images/logo.png",
      rating: Number((Math.random() * (5 - 4.2) + 4.2).toFixed(1)), // High ratings for aesthetic appeal
      isWebGame: true,
      gameUrl: g.Url, 
      downloadUrl: g.Url,
      isPopular: Math.random() > 0.8
    }));

    // Ensure the data directory exists
    if (!fs.existsSync('src/data')) {
      fs.mkdirSync('src/data', { recursive: true });
    }

    const fileContent = `export const gamesData = ${JSON.stringify(games, null, 2)};\n`;
    fs.writeFileSync('src/data/games.js', fileContent);
    console.log(`Successfully generated ${games.length} curated aesthetic games!`);
  } catch (err) {
    console.error("Error generating games:", err.message);
  }
}

generateGamerGirlGames();
