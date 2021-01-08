'use strict';

const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const address = process.env.ADDRESS || `http://localhost:${port}`;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('*', (req, res) => {
  res.render('index', { address });
});

app.listen(port, () => {
  console.log(`🚀 App is listening on port ${port}`);
});