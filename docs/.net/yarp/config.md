---
sidebar_position: 1
---

# Yarp 配置文件描述

```json
{
  // 服务器监听的基本url，必须与下面的路由独立配置
  "Urls": "http://localhost:5000;https://localhost:5001",
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      // 取消注释以隐藏来自运行时和代理的诊断消息
      // "Microsoft": "Warning",
      // "Yarp" : "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "ReverseProxy": {
    // 路由告诉代理转发哪些请求
    "Routes": { 
      "minimumroute" : {
        // 匹配所有信息并将其路由到www.example.com
        "ClusterId": "minimumcluster",
        "Match": {
          "Path": "{**catch-all}"
        }
      },
      "allrouteprops" : {
        // 匹配/something/*并路由到"allclusterprops"
        "ClusterId": "allclusterprops", // 一个集群的名称
        "Order" : 100, // 数字越小优先级越高
        "Authorization Policy" : "Anonymous", // 策略名称或“默认”、“匿名”
        "CorsPolicy" : "Default", // 应用于此路由的CorsPolicy名称或“默认”，“禁用”
        "Match": {
          "Path": "/something/{**remainder}", // 要匹配的路径使用ASP.Net的语法。
          "Hosts" : [ "www.aaaaa.com", "www.bbbbb.com"], // 要匹配的主机名，未指定为any
          "Methods" : [ "GET", "PUT" ], // 匹配的HTTP方法，指定的就是全部
          "Headers": [ // 要匹配的头信息，未指定为any
            {
              "Name": "MyCustomHeader", // 标头名称
              "Values": [ "value1", "value2", "another value" ], // 匹配是针对这些值中的任何一个
              "Mode": "ExactHeader", // 或者 "HeaderPrefix", "Exists" , "Contains", "NotContains"
              "IsCaseSensitive": true
            }
          ],
          "QueryParameters": [ // 要匹配的查询参数，未指定为any
            {
              "Name": "MyQueryParameter", // 要匹配的查询参数，未指定为any
              "Values": [ "value1", "value2", "another value" ], // 匹配是针对这些值中的任何一个
              "Mode": "Exact", // 或 "Prefix", "Exists" , "Contains", "NotContains"
              "IsCaseSensitive": true
            }
          ]
        },
        "MetaData" : { // 可由自定义扩展使用的键值对列表
          "MyName" : "MyValue"
        },
        "Transforms" : [ // 变换列表。有关详细信息，请参阅Transforms文章
          {
            "RequestHeader": "MyHeader",
            "Set": "MyValue"
          } 
        ]
      }
    },
    // 集群告诉代理在哪里以及如何转发请求
    "Clusters": {
      "minimumcluster": {
        "Destinations": {
          "example.com": {
            "Address": "http://www.example.com/"
          }
        }
      },
      "allclusterprops": {
        "Destinations": {
          "first_destination": {
            "Address": "https://contoso.com"
          },
          "another_destination": {
            "Address": "https://10.20.30.40",
            "Health" : "https://10.20.30.40:12345/test" // 覆盖活动运行状况检查
          }
        },
        "LoadBalancingPolicy" : "PowerOfTwoChoices", // 或者 "FirstAlphabetical", "Random", "RoundRobin", "LeastRequests"
        "SessionAffinity": {
          "Enabled": true, // 默认'false'
          "Policy": "Cookie", // 默认, 选择 "CustomHeader"
          "FailurePolicy": "Redistribute", // 默认, 选择 "Return503Error"
          "Settings" : {
              "CustomHeaderName": "MySessionHeaderName" // Defaults to 'X-Yarp-Proxy-Affinity`
          }
        },
        "HealthCheck": {
          "Active": { // 执行API调用以验证运行状况。
            "Enabled": "true",
            "Interval": "00:00:10",
            "Timeout": "00:00:10",
            "Policy": "ConsecutiveFailures",
            "Path": "/api/health" // 用于查询运行状况状态的API端点
          },
          "Passive": { // 禁用基于HTTP响应代码的目的地
            "Enabled": true, // 默认 false
            "Policy" : "TransportFailureRateHealthPolicy", // 必需
            "ReactivationPeriod" : "00:00:10" // 10s
          }
        },
        "HttpClient" : { // 用于联系目的地的HttpClient实例的配置
          "SSLProtocols" : "Tls13",
          "DangerousAcceptAnyServerCertificate" : false,
          "MaxConnectionsPerServer" : 1024,
          "EnableMultipleHttp2Connections" : true,
          "RequestHeaderEncoding" : "Latin1" // 如何解释头值中的非ASCII字符
        },
        "HttpRequest" : { // 发送请求到目的地的选项
          "ActivityTimeout" : "00:02:00",
          "Version" : "2",
          "VersionPolicy" : "RequestVersionOrLower",
          "AllowResponseBuffering" : "false"
        },
        "MetaData" : { // 自定义键值对
          "TransportFailureRateHealthPolicy.RateLimit": "0.5", //由被动运行状况策略使用
          "MyKey" : "MyValue"
        }
      }
    }
  }
}
```