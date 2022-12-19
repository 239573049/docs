---
sidebar_position: 1
---

# Yarp 介绍 

YARP 被设计为一个提供核心代理功能的库，然后您可以通过添加或替换模块来自定义这些功能。YARP 目前作为 NuGet 包和代码片段提供。我们计划在未来提供项目模板和预构建的 exe。

YARP在.NET Core基础架构之上实现，可在Windows，Linux或MacOS上使用。开发可以使用SDK和您喜欢的编辑器Microsoft Visual Studio或Visual Studio Code完成。

YARP 1.1支持 ASP.NET Core 3.1，5.0和6.0。可以从 https://dotnet.microsoft.com/download/dotnet/ 下载 .NET SDK。

Visual Studio 对 .NET 5 的支持包含在 Visual Studio 2019 v16.8 或更高版本中。

Visual Studio 对 .NET 6 的支持包含在 Visual Studio 2022 中。


## Yarp踩坑分享

### 代理URL的问题

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