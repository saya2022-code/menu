// expressを使うためのコード
const express = require('express');
// MySQLを使うためのコードを貼り付けてください
const mysql = require('mysql');

const app = express();

// CSSや画像ファイルを置くフォルダを指定
app.use(express.static('public'));

// 定数connectionを定義して接続情報の書かれたコードを代入してください
const connection = mysql.createConnection({
  host: '',
  user: 'todo2',
  password: '!pass100',
  database: 'list_app'
});

//トップ画面
app.get('/', (req, res) => {
    res.render('top.ejs');
  });

//一覧ページ
app.get('/index', (req, res) => {
  // データベースからデータを取得する処理を書いてください
  connection.query(
    'select * from items',
    (error,results) => {
      // console.log(results);
      // res.renderの第２引数にオブジェクトを追加してください
      res.render('index.ejs',{items:results});
    });
});

// サーバーを起動するコードを貼り付けてください
app.listen(3000);
