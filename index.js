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

// Expanded static scriptures list
const staticScriptures = [
  {
    source: 'Quran',
    reference: 'Surah Al-Fatiha 1:1-2',
    text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds.',
    link: 'https://quran.com/1/1-2',
    explanation: 'This opening chapter of the Quran emphasizes God’s mercy and sovereignty.'
  },
  {
    source: 'Quran',
    reference: 'Surah Al-Baqarah 2:255',
    text: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence.',
    link: 'https://quran.com/2/255',
    explanation: 'Known as Ayat al-Kursi, this verse highlights Allah’s omnipotence.'
  },
  {
    source: 'Quran',
    reference: 'Surah Al-Ikhlas 112:1-4',
    text: 'Say, He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.',
    link: 'https://quran.com/112',
    explanation: 'This chapter affirms the oneness of Allah.'
  },
  {
    source: 'Bhagavad Gita',
    reference: 'Chapter 2:47',
    text: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
    link: 'https://www.holy-bhagavad-gita.org/chapter/2/verse/47',
    explanation: 'This verse teaches detachment from outcomes, focusing on duty.'
  },
  {
    source: 'Bhagavad Gita',
    reference: 'Chapter 4:7-8',
    text: 'Whenever there is a decline in righteousness and rise of unrighteousness, I manifest Myself. To protect the righteous, destroy the wicked, and establish dharma, I come into being age after age.',
    link: 'https://www.holy-bhagavad-gita.org/chapter/4/verse/7',
    explanation: 'This verse explains the divine purpose of Krishna’s incarnations.'
  },
  {
    source: 'Bhagavad Gita',
    reference: 'Chapter 9:22',
    text: 'To those who are constantly devoted and worship Me with love, I give the understanding by which they can come to Me.',
    link: 'https://www.holy-bhagavad-gita.org/chapter/9/verse/22',
    explanation: 'This emphasizes devotion as a path to divine connection.'
  },
  {
    source: 'Torah',
    reference: 'Genesis 1:1',
    text: 'In the beginning, God created the heavens and the earth.',
    link: 'https://www.chabad.org/library/bible_cdo/aid/8165',
    explanation: 'This opening verse of the Torah describes the creation of the universe.'
  },
  {
    source: 'Torah',
    reference: 'Exodus 20:2-3',
    text: 'I am the Lord your God, who brought you out of the land of Egypt, out of the house of slavery. You shall have no other gods before Me.',
    link: 'https://www.chabad.org/library/bible_cdo/aid/9881',
    explanation: 'This is the first of the Ten Commandments, emphasizing monotheism.'
  },
  {
    source: 'Torah',
    reference: 'Deuteronomy 6:4-5',
    text: 'Hear, O Israel: The Lord our God, the Lord is one. You shall love the Lord your God with all your heart, soul, and might.',
    link: 'https://www.chabad.org/library/bible_cdo/aid/9970',
    explanation: 'The Shema, a central prayer in Judaism, affirms God’s unity and love.'
  },
  {
    source: 'Upanishads',
    reference: 'Isha Upanishad 1',
    text: 'All this—whatever exists in this changing universe—should be covered by the Lord. Protect the Self by renunciation. Lust not after any man’s wealth.',
    link: 'https://www.vedabase.com/en/iso/1',
    explanation: 'This verse teaches renunciation and divine unity.'
  }
];

// Function to randomly select a scripture (Bible API or static)
async function getRandomScripture() {
  // 80% chance for Bible API, 20% for static scriptures to reduce repeats
  const useStatic = Math.random() < 0.2;
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
          <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
          <meta http-equiv="Pragma" content="no-cache">
          <meta http-equiv="Expires" content="0">
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
              background: #057027;
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
