const express = require('express')
const { request: Req } = require('express')
const { response: Res } = require('express')

const app = express();
const port = 8000;

app.get('/', (req: typeof Req, res: typeof Res) => {
  res.send('Express Bot TS');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});