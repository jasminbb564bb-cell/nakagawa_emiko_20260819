# Quiet Todo Local Server

Java の `HttpServer` だけで、ローカル表示用の Todo アプリを起動します。

## ファイル構成

- `App.java`
- `index.html`
- `style.css`
- `app.js`
- `mock.html`
- `mock.css`
- `mock.js`

## 起動方法

PowerShell で次を実行します。

```powershell
javac --add-modules jdk.httpserver App.java
java --add-modules jdk.httpserver App
```

起動するとターミナルに次を表示します。

```text
サーバー起動: http://localhost:8080
```

## 表示先

- `http://localhost:8080`
  既存の Todo アプリ
- `http://localhost:8080/mock.html`
  白黒の別パターン UI モック

## ルーティング

- `/` は `index.html`
- `/mock.html` は `mock.html`
- `/style.css` は `style.css`
- `/mock.css` は `mock.css`
- `/app.js` は `app.js`
- `/mock.js` は `mock.js`
- 存在しないパスは `404 Not Found`

## 終了方法

PowerShell 上で `Ctrl + C` を押すと終了します。
