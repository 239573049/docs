---
sidebar_position: 1
---

# 安装部署 Gitea

一键部署 gitea

gitea 的 compose 部署文件 这个是基本的 gitea 的 compose 部署文件

```yml
services:
  gitea: # 服务名称
    image: gitea/gitea:1.17.3 # 使用的gitea的镜像版本
    container_name: gitea # 容器名称
    environment: # 环境变量
      - USER_UID=1000
      - USER_GID=1000
    restart: always # 开机自启
    volumes:
      - ./gitea:/data # 将目录挂载到宿主机数据持久化
      - /etc/timezone:/etc/timezone:ro # 挂载宿主机时区
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000" # http访问端口
      - "222:22" # ssh访问端口
```

## Mysql 部署文件

```yml
version: "3"

networks: # 构建一个局部网络只有在当前的compose文件中才能访问
  gitea:
    external: false

services:
  gitea:
    image: gitea/gitea:1.17.3
    container_name: gitea
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - GITEA__database__DB_TYPE=mysql
      - GITEA__database__HOST=db:3306
      - GITEA__database__NAME=gitea
      - GITEA__database__USER=gitea
      - GITEA__database__PASSWD=gitea
    restart: always
    networks: # 加入到当前compose文件中的局部网络
      - gitea
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000"
      - "222:22"
    depends_on: # 依赖于数据库；等待数据库启动在启动gitea
      - db

  db:
    image: mysql:8 # 数据库镜像版本
    restart: always # 开机自启
    environment:
      - MYSQL_ROOT_PASSWORD=gitea # 管理员数据库密码
      - MYSQL_USER=gitea # 管理员数据库账号
      - MYSQL_PASSWORD=gitea
      - MYSQL_DATABASE=gitea
    networks: # 加入到当前compose文件中的局部网络
      - gitea
    volumes:
      - ./mysql:/var/lib/mysql # 将数据库持久化挂载到宿主机
```
