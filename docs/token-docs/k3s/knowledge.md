---
sidebar_position: 5
---

# K3s知识点

## 添加Node的节点服务

注：mynodetoken 在`master`节点的`/var/lib/rancher/k3s/server/node-token`下面
更详细的参数可以看[agent](agent-config.md)
```shell
curl -sfL https://rancher-mirror.oss-cn-beijing.aliyuncs.com/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn K3S_URL=https://myserver:6443 K3S_TOKEN=mynodetoken sh -
```