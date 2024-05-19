# KinNo アシスタント

KinNo アシスタントは Kindle でハイライトした内容とメモを Notion へ連携する Google Chrome 拡張機能です。

> [!WARNING]
> この拡張機能は 2024-05-19 現在、Google Chrome ストアに公開していません。
>
> ご自身で本リポジトリをダウンロードして、フォルダを解凍していただく必要があります。

> [!NOTE]
> ※README 更新中です。
>
> Notion API の設定方法と親ページの ID はご自身でお調べください。

# インストール手順

- 本リポジトリをダウンロードする
- こちらのサイト`https://exemate.co.jp/archives/7594`に記載されている手順に従って`パッケージ化されていない拡張機能を読み込む`で、ダウンロードした本リポジトリの`dist`フォルダを選択する

# 使い方

1. [Kindle のメモとハイライト](https://read.amazon.co.jp/notebook)を開く
2. 画面右上の拡張機能から「KinNo アシスタント」を選択する
   1. 「KinNo アシスタント」を選択するとポップアップが表示される。
3. ご自身が設定した Notion API key と保存したいページの親ページの ID を入力する。
4. [Kindle のメモとハイライト](https://read.amazon.co.jp/notebook)ページで、ハイライトを Notion に保存したい本に切り替える
5. 拡張機能の popup から「Notion へ保存する」ボタンを押して、「Notion の保存に成功しました！」と表示されたら成功

# 注意事項

- Notion API key と保存したいページの親ページの ID を知っておく必要があります。
