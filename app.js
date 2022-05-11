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

//一覧表示
  app.get('/index', (req, res) => {
    connection.query(
      'SELECT * FROM items', //テーブルのデータを取得
      (error, results) => { //resultsにテーブルのデータが入る
        res.render('index.ejs', {items: results}); //items(変数)にresultsを代入
      }
    );
  });
  
  //作成画面
  app.get('/new', (req, res) => {
    res.render('new.ejs');
  });

  //作成画面の送信＝postなので/createへの画面遷移しない
  app.post('/create', (req, res) => {
    connection.query(
      'INSERT INTO items (name) VALUES (?)',
      [req.body.itemName], //new.ejsのname="itemName"より
      (error, results) => {

        // 一覧画面にリダイレクト＝重複を防ぐ
        res.redirect('/index');

      }
    );
  });

  //削除
  app.post('/delete/:id',(req,res) => { //①ルートパラメータ(:id)を設定
    //③req.params.ルートパラメータ名＝②から取得したメモのidを受け取る
    // console.log(req.params.id);

    connection.query( //DB接続
      'DELETE FROM items where id =?', //④指定したidを持つ列を消す処理
      [req.params.id], //⑤ ②から取得したメモのidが?に入る
      (error, results) => { //クエリ実行後の処理
        res.redirect('/index');
      }
    );
  })

  //１件取得
  app.get('/edit/:id',(req,res) => { //①ルートパラメータ(:id)を設定
    //③req.params.ルートパラメータ名＝②から取得したメモのidを受け取る
    // console.log(req.params.id);

    connection.query( //DB接続
      'SELECT * FROM items where id =?', //④指定したidを持つ列を消す処理
      [req.params.id], //⑤ ②から取得したメモのidが?に入る
      (error, results) => { //クエリ実行後の処理
        res.render('edit.ejs',{item: results[0]});
      }
    );
  })

  //更新
  app.post('/update/:id',(req,res) => { //①ルートパラメータ(:id)を設定
    //③req.params.ルートパラメータ名＝②から取得したメモのidを受け取る
    // console.log(req.params.id);

    connection.query( //DB接続
      'UPDATE items SET name=? where id=?', //④指定したidを持つ列を消す処理
      [req.body.itemName,req.params.id], //⑤ ②から取得したメモのidが?に入る
      (error, results) => { //クエリ実行後の処理
        res.redirect('/index');
      }
    );
    });

// サーバーを起動するコードを貼り付けてください
app.listen(3000);
