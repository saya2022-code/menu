// expressを使うためのコード
const express = require('express');
const app = express();

// CSSや画像ファイルを置くフォルダを指定
app.use(express.static('public'));


//トップ画面
app.get('/', (req, res) => {
    res.render('top.ejs');
  });

//一覧ページ
app.get('/index', (req, res) => {
  res.render('index.ejs');
});

// サーバーを起動するコードを貼り付けてください
app.listen(3000);
