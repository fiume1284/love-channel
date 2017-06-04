# love-channel

動画を再生している時間が長いほど、アイコンが貯まっていきます。

**[srt.js ハッカソン](https://mashupawards.connpass.com/event/57500)** にて作成しました。  
急いで作ったのでコード内にまずい箇所も散見されますが、「ハッカソンなので……」と優しい目で見てください。（悪用しないで……）

再生チャンネルの履歴は全ユーザーで共有されちゃってますので、数が増えてきたらお構いなく『履歴の削除』ボタンを押しちゃってください。


## Demo

**[こちらから体験できます！](https://nekonenene.github.io/love-channel/?surl=5seconds.srt&autoplay=1&v=rQzgMmr8dH8)**  
**https://nekonenene.github.io/love-channel/?surl=5seconds.srt&autoplay=1&v=rQzgMmr8dH8**

なお、URLの `v=xxxxxxxx` となっている箇所の `v=` 以降を、  
好きなYouTube動画の動画IDにすれば、お好みの動画でお楽しみいただけます。


## 開発するには……

### 1. このリポジトリをコピー

以下のようにコマンド
```
git clone git@github.com:nekonenene/love-channel.git
```

### 2. Ruby, Node.js をインストール

Windows なら、chocolatey で `choco install -y ruby nodejs`

Mac なら、homebrew で `brew install ruby nodejs`

上記のことがわからないなら、  
- [Ruby](https://www.ruby-lang.org/) 
- [Node.js](https://nodejs.org/)

のホームページから安定版をダウンロードしてインストール

### 3. 開発に必要な依存パッケージ群をインストール

プロジェクトがあるディレクトリで以下のようにコマンド
```
make init
```

これで `npm install` やら `bundle install` がおこなわれる

### 4. 開発監視ツールを起動

（もし gulp を入れていないなら）
```
npm run gulp
```

gulp をグローバルにインストール済みなら、プロジェクトがあるディレクトリで以下のようにコマンド
```
gulp
```

これで source フォルダ内のファイルの更新を監視して、更新があると  
sass のコンパイルとか babel とか minify が走ってくれて、  
optimized フォルダに書き出してくれる。すごい。

gulp コマンドによりローカルサーバーが起動されたあとは、こちらにアクセス  
開発環境 : [http://localhost:8013/?surl=5seconds.srt&autoplay=1&v=vzSH2eAvaV4](http://localhost:8013/?surl=5seconds.srt&autoplay=1&v=vzSH2eAvaV4)  
リリース環境 : [http://localhost:8014/?surl=5seconds.srt&autoplay=1&v=vzSH2eAvaV4](http://localhost:8014/?surl=5seconds.srt&autoplay=1&v=vzSH2eAvaV4)
