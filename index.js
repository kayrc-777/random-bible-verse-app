const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Mapping for YouVersion book abbreviations
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

app.get('/', async (req, res) => {
  try {
    // Fetch random verse from Bible API
    const apiResponse = await fetch('https://bible-api.com/?random=verse&translation=web');
    if (!apiResponse.ok) {
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }
    const data = await apiResponse.json();

    // Validate API response
    if (!data || !data.reference || !data.text) {
      throw new Error('Invalid API response: missing reference or text');
    }

    // Parse verse details
    const reference = data.reference;
    const text = data.text;
    let bookAbbrev;
    try {
      const [bookChapter, verse] = reference.split(':');
      const [book, chapter] = bookChapter.trim().split(/(\d*)\s+/).filter(Boolean);
      bookAbbrev = bookMap[book] || book.toUpperCase().substring(0,3);
    } catch (parseError) {
      throw new Error('Failed to parse verse reference');
    }

    // Form YouVersion link
    const youversionLink = `https://www.bible.com/bible/111/${bookAbbrev}.${chapter}.${verse}.NIV`;

    // Customize explanation
    const explanation = `This verse, ${reference}, highlights a key message of faith. Explore more in YouVersion for detailed study notes and context.`;

    // Send styled HTML
    res.send(`
      <html>
        <head>
          <title>Random Bible Verse</title>
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
            .youversion-button {
              display: inline-block;
              padding: 12px 24px;
              background: #3498db;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-size: 1em;
              transition: background 0.3s;
              margin-top: 20px;
            }
            .youversion-button:hover {
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
            <h1>Random Bible Verse: ${reference}</h1>
            <p class="verse-text">${text}</p>
            <p class="explanation"><strong>Reflection:</strong> ${explanation}</p>
            <a href="${youversionLink}" class="youversion-button">Explore in YouVersion</a>
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
          <h1>Error fetching verse</h1>
          <p>Unable to load verse: ${error.message}. Please try again later.</p>
        </body>
      </html>
    `);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
