**From docker hub:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:80 corentinth/it-tools:latest
```

**From github packages:**

```sh
docker run -d --name it-tools --restart unless-stopped -p 8080:80 ghcr.io/corentinth/it-tools:latest
```

## Create New Tool
```sh
pnpm run script:create:tool my-tool-name
```

## License

This project is under the [GNU GPLv3](LICENSE).

## TODO Fun
1. 注册登录
2. tool权限
3. tool评论
4. 用户土豪币
5. 个人页
- 我的收藏
- 我的收益
- 我的订单
- 我的消息
- VIP特权 wait
6. tool 耗点

## Tools
1. 图片拼豆
