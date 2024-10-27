const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

const frontsData = [
  'Front of Card 1',
  'Front of Card 2',
  'Front of Card 3',
  'Front of Card 4',
  'Front of Card 5'
];

// Route to get the front of a card by its ID
app.get('/front/:id', (req, res) => {
  const cardId = parseInt(req.params.id);
  if (frontsData[cardId - 1]) {
    res.json({ front: frontsData[cardId - 1] });
  } else {
    res.status(404).json({ error: 'Front of card not found' });
  }
});

// Route to get the back of a card by its ID
app.get('/back/:cardIndex', (req, res) => {
  const { cardIndex } = req.params;

  // Simulate a very large SVG content
  let svgElements = '';
  for (let i = 0; i < 10000; i++) {  // Creates 500 SVG shapes for heavy content
    svgElements += `
      <circle cx="${Math.random() * 400}" cy="${Math.random() * 400}" r="${Math.random() * 50}" fill="rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)" />
      <rect x="${Math.random() * 400}" y="${Math.random() * 400}" width="${Math.random() * 100}" height="${Math.random() * 100}" fill="rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.4)" />
      <path d="M10 10 H 90 V 90 H 10 Z" fill="rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)" />
    `;
  }

  const largeHTMLContent = `
    <div style="padding: 20px;">
      <h1>Back of Card ${cardIndex}</h1>
      <svg width="100%" height="30vh">
        ${svgElements}  <!-- Insert all the SVG elements here -->
      </svg>
    </div>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.json({ back: largeHTMLContent });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
