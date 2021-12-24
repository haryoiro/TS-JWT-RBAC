# ts-server-template

Express + Routing-Controller + TypeScipt + TypeORM

- JWTによるRoleBasedAuthenticationの実装

## Features

TypeORM [GitHub](https://github.com/typeorm/typeorm) [Document](https://typeorm.io/#/)

routing-controller [GitHub](https://github.com/typestack/routing-controllers)

reflect-metadata [GitHub](https://github.com/rbuckton/reflect-metadata)


## Usage

```
yarn

# マイグレーションを実行
yarn typeorm migration:run

# 

```

### マイグレーションを実行する


`yarn typeorm`でtypeormを実行できます。
なお、細かい仕様については公式ドキュメントを参照してください。

```bash
yarn typeorm migration:generate -n gen
yarn typeorm migration:run
```

### dockerで立ち上げる

```bash
docker run -p 8080:3000 tsserver:latest
```

## License
