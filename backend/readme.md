# ts-server-template

TypeScriptとExpressJSを使用したモダンなサーバーテンプレート

## Features

TypeORM [GitHub](https://github.com/typeorm/typeorm) [Document](https://typeorm.io/#/)

routing-controller [GitHub](https://github.com/typestack/routing-controllers)

reflect-metadata [GitHub](https://github.com/rbuckton/reflect-metadata)


## Usage

### マイグレーションを実行する

```bash
yarn migration:run

```

### ロールベースのユーザ認証を有効にする

```bash
git checkout jwt
```

### シンプルなAPIサーバ

```bash
git checkout main
```

### dockerで立ち上げる

```bash
docker run -p 8080:3000 tsserver:latest
```

## License
