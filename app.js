// expressを使うためのコード
const express = require('express');
// MySQLを使うためのコードを貼り付けてください
const mysql = require('mysql');

const app = express();

// CSSや画像ファイルを置くフォルダを指定
app.use(express.static('public'));
// フォームから送信された値を受け取れるようにしてください
app.use(express.urlencoded({extended: false}));


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

  app.get('/index', (req, res) => {
    connection.query(
      'SELECT * FROM items',
      (error, results) => {
        res.render('index.ejs', {items: results});
      }
    );
  });
  
  app.get('/new', (req, res) => {
    res.render('new.ejs');
  });

  app.post('/create', (req, res) => {
    connection.query(
      'INSERT INTO items (name) VALUES (?)',
      [req.body.itemName],
      (error, results) => {

        // 一覧画面にリダイレクトしてください
        res.redirect('/index');

      }
    );
  });

// サーバーを起動するコードを貼り付けてください
app.listen(3000);
