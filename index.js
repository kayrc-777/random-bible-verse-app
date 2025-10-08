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

// Bible book categories for theme-based reflections
const bibleCategories = {
  Gospels: ['Matthew', 'Mark', 'Luke', 'John'],
  Wisdom: ['Psalms', 'Proverbs', 'Ecclesiastes', 'Job', 'Song of Solomon'],
  Prophets: ['Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi'],
  Epistles: ['Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude']
};

// Reflection templates for Bible categories
const bibleReflections = {
  Gospels: [
    '${reference} teaches us to live with compassion and love.',
    '${reference} invites us to follow Jesus’ example of kindness.',
    '${reference} reflects the teachings of Christ for a faithful life.'
  ],
  Wisdom: [
    '${reference} offers poetic guidance for the soul.',
    '${reference} shares timeless wisdom for daily living.',
    '${reference} encourages reflection on life’s deeper truths.'
  ],
  Prophets: [
    '${reference} calls us to heed God’s message of justice.',
    '${reference} inspires hope through divine prophecy.',
    '${reference} urges steadfast faith in challenging times.'
  ],
  Epistles: [
    '${reference} guides us in building a strong faith community.',
    '${reference} encourages perseverance in Christian living.',
    '${reference} offers practical advice for spiritual growth.'
  ]
};

// Expanded static scriptures with multiple reflections
const staticScriptures = [
  {
    source: 'Quran',
    reference: 'Surah Al-Fatiha 1:1-2',
    text: 'In the name of Allah, the Entirely Merciful, the Especially Merciful. [All] praise is [due] to Allah, Lord of the worlds.',
    link: 'https://quran.com/1/1-2',
    reflections: [
      '${reference} reflects Allah’s boundless mercy and guidance.',
      'This surah invites contemplation of divine sovereignty.'
    ]
  },
  {
    source: 'Quran',
    reference: 'Surah Al-Baqarah 2:255',
    text: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence.',
    link: 'https://quran.com/2/255',
    reflections: [
      '${reference} emphasizes the omnipotence of Allah.',
      'This verse calls us to trust in Allah’s eternal presence.'
    ]
  },
  {
    source: 'Quran',
    reference: 'Surah Al-Ikhlas 112:1-4',
    text: 'Say, He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.',
    link: 'https://quran.com/112',
    reflections: [
      '${reference} affirms the oneness of Allah.',
      'This surah inspires devotion to a singular divine.'
    ]
  },
  {
    source: 'Bhagavad Gita',
    reference: 'Chapter 2:47',
    text: 'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
    link: 'https://www.holy-bhagavad-gita.org/chapter/2/verse/47',
    reflections: [
      '${reference} encourages selfless action without attachment.',
      'This verse teaches the value of duty over reward.'
    ]
  },
  {
    source: 'Bhagavad Gita',
    reference: 'Chapter 4:7-8',
    text: 'Whenever there is a decline in righteousness and rise of unrighteousness, I manifest Myself. To protect the righteous, destroy the wicked, and establish dharma, I come into being age after age.',
    link: 'https://www.holy-bhagavad-gita.org/chapter/4/verse/7',
    reflections: [
      '${reference} reveals the divine purpose of Krishna’s incarnations.',
      'This verse inspires faith in divine justice.'
    ]
  },
  {
    source: 'Bhagavad Gita',
    reference: 'Chapter 9:22',
    text: 'To those who are constantly devoted and worship Me with love, I give the understanding by which they can come to Me.',
    link: 'https://www.holy-bhagavad-gita.org/chapter/9/verse/22',
    reflections: [
      '${reference} emphasizes devotion as a path to divine connection.',
      'This verse encourages steadfast love for the divine.'
    ]
  },
  {
    source: 'Torah',
    reference: 'Genesis 1:1',
    text: 'In the beginning, God created the heavens and the earth.',
    link: 'https://www.chabad.org/library/bible_cdo/aid/8165',
    reflections: [
      '${reference} celebrates the divine act of creation.',
      'This verse invites awe at the universe’s origin.'
    ]
  },
  {
    source: 'Torah',
    reference: 'Exodus 20:2-3',
    text: 'I am the Lord your God, who brought you out of the land of Egypt, out of the house of slavery. You shall have no other gods before Me.',
    link: 'https://www.chabad.org/library/bible_cdo/aid/9881',
    reflections: [
      '${reference} establishes the foundation of monotheistic faith.',
      'This commandment calls for exclusive devotion to God.'
    ]
  },
  {
    source: 'Torah',
    reference: 'Deuteronomy 6:4-5',
    text: 'Hear, O Israel: The Lord our God, the Lord is one. You shall love the Lord your God with all your heart, soul, and might.',
    link: 'https://www.chabad.org/library/bible_cdo/aid/9970',
    reflections: [
      '${reference} affirms God’s unity and love.',
      'This verse, the Shema, inspires wholehearted devotion.'
    ]
  },
  {
    source: 'Upanishads',
    reference: 'Isha Upanishad 1',
    text: 'All this—whatever exists in this changing universe—should be covered by the Lord. Protect the Self by renunciation. Lust not after any man’s wealth.',
    link: 'https://www.vedabase.com/en/iso/1',
    reflections: [
      '${reference} teaches renunciation and divine unity.',
      'This verse encourages detachment from material desires.'
    ]
  },
  {
    source: 'Dhammapada',
    reference: 'Verse 183',
    text: 'Not to do any evil, to cultivate good, to purify one’s mind—this is the teaching of the Buddhas.',
    link: 'https://www.accesstoinsight.org/tipitaka/kn/dhp/dhp.14.budd.html',
    reflections: [
      '${reference} summarizes the Buddha’s path to enlightenment.',
      'This verse inspires ethical living and mental clarity.'
    ]
  },
  {
    source: 'Dhammapada',
    reference: 'Verse 1',
    text: 'Mind precedes all mental states. Mind is their chief; their consequences follow.',
    link: 'https://www.accesstoinsight.org/tipitaka/kn/dhp/dhp.01.budd.html',
    reflections: [
      '${reference} highlights the power of the mind in shaping reality.',
      'This verse encourages mindful awareness.'
    ]
  },
  {
    source: 'Dhammapada',
    reference: 'Verse 223',
    text: 'Overcome anger by non-anger; overcome evil by good; overcome the miser by generosity; overcome the liar by truth.',
    link: 'https://www.accesstoinsight.org/tipitaka/kn/dhp/dhp.17.budd.html',
    reflections: [
      '${reference} teaches overcoming negativity with positive virtues.',
      'This verse inspires compassion and truthfulness.'
    ]
  },
  {
    source: 'Rigveda',
    reference: 'Mandala 10, Hymn 129.1',
    text: 'Then was not non-existent nor existent; there was no realm of air, no sky beyond it.',
    link: 'https://www.sacred-texts.com/hin/rigveda/rv10129.htm',
    reflections: [
      '${reference} reflects on the mystery of cosmic creation.',
      'This hymn invites contemplation of the universe’s origins.'
    ]
  },
  {
    source: 'Rigveda',
    reference: 'Mandala 1, Hymn 1.1',
    text: 'I glorify Agni, the high priest, god, minister of sacrifice, who invokes and is radiant.',
    link: 'https://www.sacred-texts.com/hin/rigveda/rv01001.htm',
    reflections: [
      '${reference} celebrates the divine fire of Agni.',
      'This hymn inspires reverence for sacred rituals.'
    ]
  },
  {
    source: 'Guru Granth Sahib',
    reference: 'Page 1, Japji Sahib 1',
    text: 'One Universal Creator God. The Name Is Truth. Creative Being Personified. No Fear. No Hatred.',
    link: 'https://www.sikhnet.com/sikhnet/sikhism.nsf/d9c658487f94f2e787256a87005324d2/1a87b0c6c0a6b7e787256a87005324d2!OpenDocument',
    reflections: [
      '${reference} affirms the unity and truth of the Creator.',
      'This verse inspires fearless devotion to God.'
    ]
  },
  {
    source: 'Guru Granth Sahib',
    reference: 'Page 5, Japji Sahib 16',
    text: 'By His Command, souls come into being; by His Command, glory and greatness are obtained.',
    link: 'https://www.sikhnet.com/sikhnet/sikhism.nsf/d9c658487f94f2e787256a87005324d2/1a87b0c6c0a6b7e787256a87005324d2!OpenDocument',
    reflections: [
      '${reference} highlights the divine will behind creation.',
      'This verse encourages submission to God’s command.'
    ]
  }
];

// Function to get a random reflection based on category/source
function getRandomReflection(scripture, book) {
  if (scripture.source === 'Bible') {
    // Determine Bible category
    let category = 'Epistles'; // Default
    for (const [cat, books] of Object.entries(bibleCategories)) {
      if (books.includes(book)) {
        category = cat;
        break;
      }
    }
    const reflections = bibleReflections[category];
    const template = reflections[Math.floor(Math.random() * reflections.length)];
    return template.replace('${reference}', scripture.reference);
  } else {
    // Static non-Bible scriptures
    const reflections = scripture.reflections;
    const template = reflections[Math.floor(Math.random() * reflections.length)];
    return template.replace('${reference}', scripture.reference);
  }
}

// Function to randomly select a scripture (Bible API or static)
async function getRandomScripture() {
  // 80% chance for Bible API, 20% for static scriptures
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
  let bookAbbrev, chapter, verse, book;

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
    
    book = bookMatch[1].trim();
    chapter = bookMatch[2] || '1'; // Default to chapter 1 for single-chapter books
    bookAbbrev = bookMap[book] || book.toUpperCase().replace(/\s/g, '').substring(0, 3);
    
    return {
      source: 'Bible',
      reference,
      text,
      link: `https://www.bible.com/bible/111/${bookAbbrev}.${chapter}.${verse}.NIV`,
      book // Pass book for reflection categorization
    };
  } catch (parseError) {
    throw new Error(`Failed to parse Bible verse reference: ${parseError.message}`);
  }
}

app.get('/', async (req, res) => {
  try {
    const scripture = await getRandomScripture();
    const reflection = getRandomReflection(scripture, scripture.book);

    // Send styled HTML
    res.send(`
      <html>
        <head>
          <title>Random Scripture</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
          <meta http-equiv="Pragma" content="no-cache">
          <meta http-equiv="Expires" content="0">
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background: linear-gradient(135deg, #2c2c2c, #1a1a1a);
              color: #e0e0e0;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              text-align: center;
            }
            .container {
              background: #333333;
              padding: 30px;
              border-radius: 15px;
              box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
              max-width: 600px;
              width: 90%;
            }
            h1 {
              color: #f5f5f5;
              font-size: 1.8em;
              margin-bottom: 20px;
            }
            .verse-text {
              font-size: 1.2em;
              font-style: italic;
              color: #d3d3d3;
              margin: 20px 0;
              line-height: 1.5;
            }
            .explanation {
              font-size: 1em;
              color: #cccccc;
              margin: 20px 0;
              line-height: 1.6;
            }
            .button-group {
              display: flex;
              gap: 10px;
              justify-content: center;
              margin-top: 20px;
            }
            .scripture-button {
              display: inline-block;
              padding: 10px 20px;
              background: #40826D;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-size: 0.9em;
              transition: background 0.3s;
              flex: 1;
              text-align: center;
              border: none;
              cursor: pointer;
            }
            .scripture-button:hover {
              background: #356859;
            }
            @media (max-width: 400px) {
              h1 { font-size: 1.5em; }
              .verse-text { font-size: 1em; }
              .container { padding: 20px; }
              .button-group { flex-direction: column; gap: 8px; }
              .scripture-button { padding: 8px 16px; font-size: 0.85em; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${scripture.source} - ${scripture.reference}</h1>
            <p class="verse-text">${scripture.text}</p>
            <p class="explanation"><strong>Reflection:</strong> ${reflection}</p>
            <div class="button-group">
              <a href="${scripture.link}" class="scripture-button">Explore in ${scripture.source}</a>
              <button class="scripture-button" onclick="openNotesApp()">Add to Notes</button>
            </div>
          </div>
          <script>
            function openNotesApp() {
              try {
                const scriptureText = "${scripture.source} - ${scripture.reference}\\n${scripture.text}";
                const maxLength = 300;
                const truncatedText = scriptureText.length > maxLength ? scriptureText.substring(0, maxLength - 3) + '...' : scriptureText;
                const encodedText = encodeURIComponent(truncatedText);
                window.location.href = 'mobilenotes://quicknote?text=' + encodedText;
                setTimeout(() => {
                  if (document.hasFocus()) {
                    window.location.href = 'mobilenotes://';
                  }
                }, 500);
              } catch (error) {
                console.error('Error opening Notes app:', error);
                window.location.href = 'mobilenotes://';
              }
            }
          </script>
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
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #2c2c2c; color: #e0e0e0; }
            h1 { color: #ff6b6b; }
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
