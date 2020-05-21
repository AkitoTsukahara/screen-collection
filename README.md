# screen-collection
指定されたページURLのスクショを自動で撮ってくれます

# 始め方
（node.jsがインストールされていて、npmが利用できる前提になっています。）

## 1.このツールをクローンまたはダウンロードしてください

## 2.screen-collectionディレクトリで下記のコマンドを入力してください
```
$ npm install
```

## 3.試しに以下のコマンドを実行して、動くことを確認してください
```
$ node screen-collection.js
```
実行に成功している場合、screenディレクトリにスクショが保存されていきます。

### もし、パッケージが足りないとエラーが出た場合は以下のコマンドで追加してください
```
$ npm install {{ パッケージ名 }}
```

# 各種設定
## スクショを撮るページの設定方法
`url.csv`というファイルにページURLとタイトルを追記してください

（Excelで開いて編集する方法が一番楽かと思います。）

## ページ読み込みのデバイス設定方法
デフォルトではPCになっていますが、iPhoneなどスマホで読み込むことが可能です
### iPhone8で撮る場合
##### before （screen-collection.js  line 5,6）
```
const emulateDevices = '';
//const emulateDevices = puppeteer.devices['iPhone 8'];//エミュレートするデバイスを指定
```
##### after （screen-collection.js  line 5,6）
```
//const emulateDevices = '';
const emulateDevices = puppeteer.devices['iPhone 8'];//エミュレートするデバイスを指定
```

## ページ読み込み時間の設定
ページによっては全画面描画するのに１秒弱かかるものもあり、読み込みに十分な時間を空ける必要があることも

デフォルトでは画面描画に3秒間待つ様に設定しています

#### 読み込み時間を長くする場合
##### screen-collection.js  line 15    変更点：3000 -> 5000
```
const WAIT_FOR = 5000; // ページ描画の待機時間（ミリ秒）
```

## basic認証ページのuser,pass設定方法
Basic認証がかかったページで利用する場合は、usernameとpasswordを設定してください
##### before （screen-collection.js  line 8,9）
```
const basicUser = '';
const basicPass = '';
```
##### after （screen-collection.js  line 8,9）
```
const basicUser = 'ユーザ名';
const basicPass = 'パスワード';
```
