# google-home-tell-anime
This is a script to get today's animated program by Google Home.

## これはなに？
Google Home に今日これから放送されるアニメをお知らせしてもらうためのスクリプトです。
[![IMAGE ALT TEXT](http://img.youtube.com/vi/jPNG8fE9hyA/0.jpg)](http://www.youtube.com/watch?v=jPNG8fE9hyA "Google Home に今日のアニメを教えてもらう")

## 使い方

### 必要なもの
- node.js
 - google-home-notifier
 - ngrok
 - feedparser
 - request
- 強調設定したしょぼいカレンダーの RSS フィード

### 設定
1. google-home-tell-anime.js(line:52) に自分の RSS フィード URL を設定します
2. 必要なものを全部入れたサーバーで google-home-tell-anime.js を実行します
3. 出力された ngrok URL をメモします
4. IFTTT の this に GoogleAssistant でウェイクワードを設定します
5. IFTTT の that に Webhook で 3 の URL を設定します
5. Google Home に 2 で設定したワードで OK Google します
