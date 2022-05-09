// expressを使うためのコード
const express = require('express');
const app = express();

// CSSや画像ファイルを置くフォルダを指定
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('hello.ejs');
  });

app.get('/top', (req, res) => {
    res.render('top.ejs');
  });

// サーバーを起動するコードを貼り付けてください
app.listen(3000);
