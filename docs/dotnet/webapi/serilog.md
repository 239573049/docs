---
sidebar_position: 1
---

# Serilog 日志使用

使用 Serilog 日志更好的管理日志服务

简单示例：

添加 Nuget 包

```shell
dotnet add package Serilog
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
```

添加代码

```c#
using Serilog;

public class Program
{
    public static void Main()
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .WriteTo.Console()
            .WriteTo.File("log.txt",
                rollingInterval: RollingInterval.Day,
                rollOnFileSizeLimit: true)
            .CreateLogger();

        Log.Information("Hello, Serilog!");

        Log.CloseAndFlush();
    }
}
```

WebApi 简单使用：

添加 Nuget 包

```shell
dotnet add package Serilog.AspNetCore
```

添加代码

```c#
using Serilog.Events;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
    .AddEnvironmentVariables()
    .Build())
    .Enrich.FromLogContext()
    .CreateLogger();

Log.Information("启动主机");


try
{
    var builder = WebApplication.CreateBuilder(args);

    // 添加UseSerilog()
    builder.Host.UseSerilog();
    // Add services to the container.

    builder.Services.AddControllers();

    var app = builder.Build();


    app.UseAuthorization();

    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "主机意外终止");
}
finally
{
    Log.CloseAndFlush();
}

```

在`appsettings.json`中添加以下配置：

```json
{
   "Serilog": {
    "MinimumLevel": {
      "Default": "Debug", //最小记录日志级别
      "Override": {
        "Default": "Warning",
        "System": "Warning",
        "Microsoft": "Warning"
      }
    },
    "Enrich": [ "FromLogContext", "WithThreadId" ],
    "WriteTo": [
      {
        "Name": "Console",
        "Args": {
          "outputTemplate": "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} {SourceContext} {ThreadId} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
        }
      },
      {
        "Name": "Debug",
        "Args": {
          "outputTemplate": "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} {SourceContext} {ThreadId} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
        }
      },
      {
        "Name": "File",
        "Args": {
          "path": "E:/Logs/log.txt",
          "formatter": "Serilog.Formatting.Compact.CompactJsonFormatter",
          "rollingInterval": "Day",
          "outputTemplate": "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} {SourceContext} {ThreadId} [{Level:u3}] {Message:lj}{NewLine}{Exception}",
          "shared": true,
          "rollOnFileSizeLimit": true,
          "fileSizeLimitBytes": 102400000,
          "retainedFileCountLimit": 365
        }
      }
    ]
  }
}
```
