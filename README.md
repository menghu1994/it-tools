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
