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
