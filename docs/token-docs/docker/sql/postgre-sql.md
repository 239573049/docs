---
sidebar_position: 0
---

# 使用`docker compose` 部署 `PostgreSQL`

```yml

version: '3'
services:
  postgres:
    image: postgres:latest
    container_name: postgres_dc
    volumes:
      - ./pgdata:/var/lib/postgresql/data # 当前路径创建数据持久化
    environment:
      POSTGRES_USER: yourusername #在此填写postgres的用户名
      POSTGRES_DB: postgres #在此填写postgres的数据库名，默认是postgres
      POSTGRES_PASSWORD: yourpasswd #在此填写posgres的数据库密码
    ports:
      - "5432:5432"

```
