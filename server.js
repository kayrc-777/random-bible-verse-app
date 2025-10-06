const express = require('express');
const fetch = require('node-fetch'); // For API calls
const app = express();

app.get('/', async (req, res) => {
  try {
    // Fetch random verse from Bible API (default: World English Bible; change ?translation=kjv for KJV)
    const apiResponse = await fetch('https://bible-api.com/?random=verse&translation=web');
    const data = await apiResponse.json();

    // Parse verse details
    const reference = data.reference; // e.g., "John 3:16"
    const text = data.text; // Verse text
    const [bookChapter, verse] = reference.split(':');
    const [book, chapter] = bookChapter.split(' ');
    const bookAbbrev = book.toUpperCase().substring(0,3); // e.g., "JHN" for John (simplified; adjust for books like 1 John)

    // Form YouVersion deep link (use web for reliability; opens app if installed)
    const youversionLink = `https://www.bible.com/bible/111/${bookAbbrev}.${chapter}.${verse}.NIV`;

    // Optional: Display verse + simple explanation before redirect (customize explanation)
    const explanation = `This verse from ${reference} means: [Add your brief insight here, e.g., God's unconditional love for humanity, prompting belief for eternal life.] Tap below to explore more in YouVersion.`;

    // Send HTML response with auto-redirect after 5 seconds, or manual link
    res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="5;url=${youversionLink}" /> <!-- Auto-redirect -->
          <title>Random Bible Verse</title>
        </head>
        <body>
          <h1>Random Verse: ${reference}</h1>
          <p>${text}</p>
          <p><strong>Explanation:</strong> ${explanation}</p>
          <a href="${youversionLink}">Open in YouVersion for full study</a>
          <p>(Redirecting in 5 seconds...)</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.send('Error fetching verse. Try again.');
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
