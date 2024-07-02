import express from 'express';

const app = express();
const port = 3000;

// Define a test route
app.get('/test', (req, res) => {
  res.send('This is a test route!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
