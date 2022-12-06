---
sidebar_position: 1
---

# 安装部署 MinIO

部署 `MinIO` 需要使用到`docker`和`docker compose`

准备一个服务器

```yml
services:
  minio1:
    image: quay.io/minio/minio:RELEASE.2022-12-02T19-19-22Z
    container_name: minio1
    command: server --console-address ":9001" http://minio1/data{1...2} # {1...2}表示的挂载的数量
    ports:
      - 9000:9000
      - 9001:9001 # 访问的端口
    environment:
      - "MINIO_ROOT_USER=token" # 设置管理员账号
      - "MINIO_ROOT_PASSWORD=dd666666" # 设置管理员密码
    volumes:
      - /data:/data1 # 挂载位置一
      - /bat:/data2 # 挂载位置二
```

将 compose 文件放到服务器然后一键执行
这个时候就可以通过 http://ip:9001 进行服务 MinIO web 管理界面
我们的 MinIO 单节点就部署完成

## 多个节点的分布式 MinIO

```yml
version: "3.7"

# Settings and configurations that are common for all containers
x-minio-common: &minio-common
  image: quay.io/minio/minio:RELEASE.2022-12-02T19-19-22Z
  command: server --console-address ":9001" http://minio{1...4}/data{1...2}
  expose:
    - "9000"
    - "9001"
  environment:
    MINIO_ROOT_USER: token
    MINIO_ROOT_PASSWORD: dd666666
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
    interval: 30s
    timeout: 20s
    retries: 3

# 启动4个运行minio服务器实例的docker容器。
# 使用nginx反向代理，负载均衡，可以访问通过端口9000 #它。

services:
  minio1:
    <<: *minio-common
    hostname: minio1
    volumes:
      - /data1-1:/data1
      - /data1-2:/data2

  minio2:
    <<: *minio-common
    hostname: minio2
    volumes:
      - /data2-1:/data1
      - /data2-2:/data2

  minio3:
    <<: *minio-common
    hostname: minio3
    volumes:
      - /data3-1:/data1
      - /data3-2:/data2

  minio4:
    <<: *minio-common
    hostname: minio4
    volumes:
      - /data4-1:/data1
      - /data4-2:/data2

  nginx:
    image: nginx:1.19.2-alpine
    hostname: nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "9000:9000"
      - "9001:9001"
    depends_on: # 等待所有minio服务启动完成在启动nginx
      - minio1
      - minio2
      - minio3
      - minio4
```

nginx 配置文件

```conf
user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  4096;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;
    sendfile        on;
    keepalive_timeout  65;

    # include /etc/nginx/conf.d/*.conf;

    upstream minio {
        server minio1:9000;
        server minio2:9000;
        server minio3:9000;
        server minio4:9000;
    }

    upstream console {
        ip_hash;
        server minio1:9001;
        server minio2:9001;
        server minio3:9001;
        server minio4:9001;
    }

    server {
        listen       9000;
        listen  [::]:9000;
        server_name  localhost;

        # To allow special characters in headers
        ignore_invalid_headers off;
        # Allow any size file to be uploaded.
        # Set to a value such as 1000m; to restrict file size to a specific value
        client_max_body_size 0;
        # To disable buffering
        proxy_buffering off;
        proxy_request_buffering off;

        location / {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_connect_timeout 300;
            # Default is HTTP/1, keepalive is only enabled in HTTP/1.1
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            chunked_transfer_encoding off;

            proxy_pass http://minio;
        }
    }

    server {
        listen       9001;
        listen  [::]:9001;
        server_name  localhost;

        # To allow special characters in headers
        ignore_invalid_headers off;
        # Allow any size file to be uploaded.
        # Set to a value such as 1000m; to restrict file size to a specific value
        client_max_body_size 0;
        # To disable buffering
        proxy_buffering off;
        proxy_request_buffering off;

        location / {
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-NginX-Proxy true;

            # This is necessary to pass the correct IP to be hashed
            real_ip_header X-Real-IP;

            proxy_connect_timeout 300;

            # To support websocket
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            chunked_transfer_encoding off;

            proxy_pass http://console;
        }
    }
}
```

然后一样执行 compose 文件这样就构建了 MinIO 分布式服务了
