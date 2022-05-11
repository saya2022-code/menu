// expressを使うためのコード
const express = require('express');
// MySQLを使うためのコードを貼り付ける
const mysql = require('mysql');
// express-sessionを読み込む
const session = require('express-session');

const app = express();

// CSSや画像ファイルを置くフォルダを指定
app.use(express.static('public'));
// フォームから送信された値を受け取る
app.use(express.urlencoded({extended: false}));


// 定数connectionに接続情報を代入
const connection = mysql.createConnection({
  host: '',
  user: 'todo2',
  password: '!pass100',
  database: 'list_app'
});

// express-session(セッション情報)を使うための初期設定
app.use(
  session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false,
  })
)

//常に「セッション情報の一致」を確認するapp.useを作成
app.use((req,res,next) => {
    // セッション情報のuserIdとundefinedを比較するif文を追加してください
    if(req.session.userId === undefined){
      res.locals.username = "ゲスト";
      res.locals.isLoggedIn = false; //ログイン状態を判別する変数→header.ejsで使用
      console.log("ログインしていません");
    }else{
      res.locals.username = req.session.username;
      res.locals.isLoggedIn = true;  //ログイン状態を判別する変数→header.ejsで使用
      console.log("ログインしています");
    }
    next();
});

//トップ画面
app.get('/', (req, res) => {
    res.render('top.ejs');
  });

  //ログインへの遷移
  app.get('/login', (req, res) => {
    res.render('login.ejs');
  });

  //ログイン
  app.post('/login', (req, res) => {
    const email = req.body.email; //③：②から取得したusersのemailを変数emailに代入
    connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (error, results) => {
        // 配列resultsの要素数で処理の分岐をしてください
        //if文で「フォームから受け取った送信されたパスワード」と「クエリ実行結果のパスワード」を比較
        if(results.length > 0){
          if(req.body.password === results[0].password){
          //認証する
          req.session.userId = results[0].id; //resultsからidを取得し、セッション情報にuserIdというプロパティ名で保存
          req.session.username = results[0].username; //resultsからnameを取得し、セッション情報にuserNameというプロパティ名で保存

          res.redirect('/index');
          }else{
            //失敗
            console.log("認証に失敗しました");
            res.redirect('/login');
          }
       }else{
         res.redirect('/login');
       }
      }
    )
  });

    //ログアウト=セッション情報を削除する
    app.get('/logout', (req, res) => {
      req.session.destroy((error) => {
        res.redirect('/');
      });
    });

  //一覧表示
  app.get('/index', (req, res) => {

    //全リストの表示
    connection.query(
      'SELECT * FROM items', //テーブルのデータを取得
      (error, results) => { //resultsにテーブルのデータが入る
        res.render('index.ejs', {items: results}); //items(変数)にresultsを代入
      }
    );
  });

  //１件取得
    app.get('/edit/:id',(req,res) => { //①ルートパラメータ(:id)を設定
      //③req.params.ルートパラメータ名＝②から取得したメモのidを受け取る
      // console.log(req.params.id);

      connection.query( //DB接続
        'SELECT * FROM items where id =?', //④指定したidを持つ列を取得
        [req.params.id], //⑤ ②から取得したメモのidが?に入る
        (error, results) => { //クエリ実行後の処理
          res.render('edit.ejs',{item: results[0]}); //item(変数)にresultsの１番目を代入
        }
      );
    })

  //更新
    app.post('/update/:id',(req,res) => { //①ルートパラメータ(:id)を設定
      //③req.params.ルートパラメータ名＝②から取得したメモのidを受け取る
      //req= req.body.itemName
      // console.log(req.params.id);

      connection.query( //DB接続
        'UPDATE items SET name=? where id=?', //④指定したnameとidを持つ列を更新する処理
        [req.body.itemName,req.params.id], //⑤ ②から取得したメモのnameとidが?に入る
        (error, results) => { //クエリ実行後の処理
          res.redirect('/index');
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

// サーバーを起動するコードを貼り付けてください
app.listen(3000);
