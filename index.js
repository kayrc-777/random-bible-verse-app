const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Mapping for YouVersion book abbreviations (for Bible verses)
const bookMap = {
  'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM', 'Deuteronomy': 'DEU',
  'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
  '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
  'Ezra': 'EZR', 'Nehemiah': 'NEH', 'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA',
  'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
  'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN',
  'Hosea': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
  'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP', 'Haggai': 'HAG',
  'Zechariah': 'ZEC', 'Malachi': 'MAL', 'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK',
  'John': 'JHN', 'Acts': 'ACT', 'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
  'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
  '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI', '2 Timothy': '2TI',
  'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB', 'James': 'JAS', '1 Peter': '1PE',
  '2 Peter': '2PE', '1 John': '1JN', '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD',
  'Revelation': 'REV'
};

// Static scriptures for non-Bible texts
const staticScriptures = [
  {
    source: 'Quran',
    reference: 'Surah Al-Fatiha 1:1-2',
    text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds.',
    link: 'https://quran.com/1/1-2',
    explanation: 'This opening chapter of the Quran emphasizes God’s mercy and sovereignty.'
  },
  {
    source: 'Bhagavad Gita',
    reference: 'Chapter 2:47',
    text: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
    link: 'https://www.holy-bhagavad-gita.org/chapter/2/verse/47',
    explanation: 'This verse from the Gita teaches detachment from outcomes, focusing on duty.'
  }
];

// Function to randomly select a scripture (Bible API or static)
async function getRandomScripture() {
  // Randomly choose between Bible API and static scriptures (e.g., 50% chance each)
  const useStatic = Math.random() < 0.5;
  if (useStatic) {
    const randomIndex = Math.floor(Math.random() * staticScriptures.length);
    return staticScriptures[randomIndex];
  }

  // Fetch from Bible API
  const apiResponse = await fetch('https://bible-api.com/?random=verse&translation=web');
  if (!apiResponse.ok) {
    throw new Error(`Bible API request failed with status ${apiResponse.status}`);
  }
  const data = await apiResponse.json();

  // Validate API response
  if (!data || !data.reference || !data.text) {
    throw new Error('Invalid Bible API response: missing reference or text');
  }

  // Parse Bible verse
  const reference = data.reference;
  const text = data.text;
  let bookAbbrev, chapter, verse;

  try {
    const [bookChapter, versePart] = reference.split(':');
    if (!versePart) {
      throw new Error('Invalid reference format: no verse part');
    }
    verse = versePart.trim();
    
    // Handle single-chapter books (e.g., Philemon, Jude)
    const bookMatch = bookChapter.match(/^(\d*\s*[A-Za-z\s]+?)(\d+)?$/);
    if (!bookMatch) {
      throw new Error('Invalid reference format: unable to parse book and chapter');
    }
    
    const book = bookMatch[1].trim();
    chapter = bookMatch[2] || '1'; // Default to chapter 1 for single-chapter books
    bookAbbrev = bookMap[book] || book.toUpperCase().replace(/\s/g, '').substring(0, 3);
    
    return {
      source: 'Bible',
      reference,
      text,
      link: `https://www.bible.com/bible/111/${bookAbbrev}.${chapter}.${verse}.NIV`,
      explanation: `This verse, ${reference}, highlights a key message of faith from the Bible.`
    };
  } catch (parseError) {
    throw new Error(`Failed to parse Bible verse reference: ${parseError.message}`);
  }
}

app.get('/', async (req, res) => {
  try {
    const scripture = await getRandomScripture();

    // Send styled HTML
    res.send(`
      <html>
        <head>
          <title>Better Than Yesterday</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
              color: #333;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              text-align: center;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 15px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              width: 90%;
            }
            h1 {
              color: #2c3e50;
              font-size: 1.8em;
              margin-bottom: 20px;
            }
            .verse-text {
              font-size: 1.2em;
              font-style: italic;
              color: #34495e;
              margin: 20px 0;
              line-height: 1.5;
            }
            .explanation {
              font-size: 1em;
              color: #555;
              margin: 20px 0;
              line-height: 1.6;
            }
            .scripture-button {
              display: inline-block;
              padding: 12px 24px;
              background: #136324;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-size: 1em;
              transition: background 0.3s;
              margin-top: 20px;
            }
            .scripture-button:hover {
              background: #2980b9;
            }
            @media (max-width: 400px) {
              h1 { font-size: 1.5em; }
              .verse-text { font-size: 1em; }
              .container { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${scripture.source} - ${scripture.reference}</h1>
            <p class="verse-text">${scripture.text}</p>
            <p class="explanation"><strong>Reflection:</strong> ${scripture.explanation}</p>
            <a href="${scripture.link}" class="scripture-button">Explore in ${scripture.source}</a>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send(`
      <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #f0f4f8; color: #333; }
            h1 { color: #e74c3c; }
          </style>
        </head>
        <body>
          <h1>Error fetching scripture</h1>
          <p>Unable to load scripture: ${error.message}. Please try again later.</p>
        </body>
      </html>
    `);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
