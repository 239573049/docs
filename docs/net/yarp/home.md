---
sidebar_position: 1
---

# Yarp踩坑分享

## 代理URL的问题

代理的时候在配置添加的路由添加的Path将在浏览器通过 ip:port/data/... 将请求转发到bing.com
但是转发到时候Yarp会将完整的HttpContent转发过去，这个时候我们需要将在转发的时候需要变换一些转发url将Route的配置的Path在转发的时候去掉，防止转发携带过去然后404

```json
{
    "Routes": {
        "route1": {
            "ClusterId": "cluster1",
            "Match": {
                "Path": "/data/{**catch-all}"
            }
        }
    },
    "Clusters": {
        "cluster1": {
            "Destinations": {
                "destination1": {
                    "Address": "https://bing.com/"
                }
            }
        }
    }
}
```

在GetConfig拿到了RouteConfig的时候Yarp已经提供了控制方法

```csharp
route = route.WithTransformPathRemovePrefix("/data"); // WithTransformPathRemovePrefix方法删掉转发前缀就可以做到正常的url转发了
```