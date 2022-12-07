---
sidebar_position: 2
---

# K3s Server 配置参考

## [常用选项](#常用选项)

### [数据库](#数据库)

| Flag                                  | 环境变量                 | 描述                                                                                    |
| ------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------- |
| `--datastore-endpoint` value          | `K3S_DATASTORE_ENDPOINT` | 指定 etcd、Mysql、Postgres 或 Sqlite（默认）数据源名称。                                |
| `--datastore-cafile` value            | `K3S_DATASTORE_CAFILE`   | TLS 证书授权文件，用于确保数据存储后端通信的安全。                                      |
| `--datastore-certfile` value          | `K3S_DATASTORE_CERTFILE` | TLS 认证文件，用于确保数据存储后端通信的安全。                                          |
| `--datastore-keyfile` value           | `K3S_DATASTORE_KEYFILE`  | 用于保护数据存储后端通信的 TLS 密钥文件。                                               |
| `--etcd-expose-metrics`               | N/A                      | 将 etcd 指标公开给客户端界面。(默认为 false)                                            |
| `--etcd-disable-snapshots`            | N/A                      | 禁用自动 etcd 快照                                                                      |
| `--etcd-snapshot-name` value          | N/A                      | 设置 etcd 快照的基本名称。默认值: etcd-snapshot                                         |
| `--etcd-snapshot-schedule-cron` value | N/A                      | cron 规范中的快照间隔时间。 例如。每 5 小时 "\* _/5 _ \* _" (默认值: "0 _/12 \* \* \*") |
| `--etcd-snapshot-retention` value     | N/A                      | 要保留的快照数量 (默认值: 5)                                                            |
| `--etcd-snapshot-dir` value           | N/A                      | 保存数据库快照的目录. (默认 location: ${data-dir}/db/snapshots)                         |
| `--etcd-s3`                           | N/A                      | 启用备份到 S3                                                                           |
| `--etcd-s3-endpoint` value            | N/A                      | S3 endpoint url (默认值: "s3.amazonaws.com")                                            |
| `--etcd-s3-endpoint-ca` value         | N/A                      | S3 自定义 CA 证书连接到 S3 endpoint                                                     |
| `--etcd-s3-skip-ssl-verify`           | N/A                      | 禁用 S3 的 SSL 证书验证                                                                 |
| `--etcd-s3-access-key` value          | `AWS_ACCESS_KEY_ID`      | S3 access key                                                                           |
| `--etcd-s3-secret-key` value          | `AWS_SECRET_ACCESS_KEY`  | S3 secret key                                                                           |
| `--etcd-s3-bucket` value              | N/A                      | S3 bucket 名称                                                                          |
| `--etcd-s3-region` value              | N/A                      | S3 region / bucket 位置 (可选) 默认值: "us-east-1")                                     |
| `--etcd-s3-folder` value              | N/A                      | S3 文件夹                                                                               |

### 集群选项[#](https://docs.rancher.cn/docs/k3s/installation/install-options/server-config/_index#集群选项)

| Flag                      | 环境变量         | 描述                                         |
| ------------------------- | ---------------- | -------------------------------------------- |
| `--token value, -t` value | `K3S_TOKEN`      | 用于将 server 或 agent 加集群的共享 secret。 |
| `--token-file` value      | `K3S_TOKEN_FILE` | 包含 cluster-secret/token 的文件             |
