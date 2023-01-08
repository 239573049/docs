---
sidebar_position: 1
---

# 记录.Net Core 跨域问题

CORS（跨域资源共享）是一种机制，它使用额外的HTTP头来告诉浏览器允许跨域请求。

在ASP.NET Core中，可以使用Cors服务来配置Cors策略。要使用Cors服务，首先需要在Startup.cs文件中添加以下代码：

```c#
public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder
                    .WithOrigins("http://example.com")  // 这里填写你允许访问的域名
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });
}
```

或者你嫌麻烦可以允许所有的来源

```c#

public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder.SetIsOriginAllowed((string _) => true).AllowAnyMethod().AllowAnyHeader()
                    .AllowCredentials();
            });
        });
}
```

然后，可以在Configure方法中添加以下代码：

```c#
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    app.UseCors();
}
```
