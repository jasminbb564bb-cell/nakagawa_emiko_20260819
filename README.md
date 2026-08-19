# Quiet Todo Local Server

Java の `HttpServer` だけで `http://localhost:8080` に Todo アプリを表示する構成です。

## ファイル構成

- `App.java`
- `index.html`
- `style.css`
- `app.js`

## 起動方法

PowerShell でこのフォルダを開いて、次を実行します。

```powershell
javac --add-modules jdk.httpserver App.java
java --add-modules jdk.httpserver App
```

起動するとターミナルに次が表示されます。

```text
サーバー起動: http://localhost:8080
```

そのあとブラウザで `http://localhost:8080` を開いてください。

## 動作

- `/` は `index.html` を返します
- `/style.css` は `style.css` を返します
- `/app.js` は `app.js` を返します
- 存在しないパスは `404 Not Found` を返します

## 終了方法

PowerShell 上で `Ctrl + C` を押すと終了します。
