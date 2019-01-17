const path = require('path');
const express = require('express');

const app = express();

const distFolder = path.resolve(__dirname, '../dist');

app.use(express.static(path.resolve(distFolder, 'client')));

// Fallback to index.html
app.get(/^(\/.*)?$/, (_req, res) => {
	res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.header('Pragma', 'no-cache');
	res.header('Expires', '0');
	res.sendFile(path.resolve(distFolder, 'client/index.html'));
});

const port = parseInt(process.env.PORT || '8888', 10);
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
