---
sidebar_position: 5
---

# ASP.NET Core 依赖注入

ASP.NET Core 支持依赖关系注入 (DI) 软件设计模式，这是一种在类及其依赖关系之间实现控制反转 (IoC) 的技术。

有关特定于 MVC 控制器中依赖关系注入的详细信息，请参阅在 ASP.NET Core 中将依赖关系注入控制器。

若要了解如何在 Web 应用以外的应用程序中使用依赖关系注入，请参阅 .NET 中的依赖关系注入。

有关选项的依赖关系注入的详细信息，请参阅 ASP.NET Core 中的选项模式。

本主题介绍 ASP.NET Core 中的依赖关系注入。 有关使用依赖关系注入的主要文档包含在 .NET 中的依赖关系注入。

## 依赖关系注入概述

依赖项是指另一个对象所依赖的对象。 使用其他类所依赖的 WriteMessage 方法检查以下 MyDependency 类：

```c#
public class MyDependency
{
    public void WriteMessage(string message)
    {
        Console.WriteLine($"MyDependency.WriteMessage called. Message: {message}");
    }
}
```

类可以创建 `MyDependency` 类的实例，以便利用其 `WriteMessage` 方法。 在以下示例中，MyDependency 类是 `IndexModel` 类的依赖项：

```c#
public class IndexModel : PageModel
{
    private readonly MyDependency _dependency = new MyDependency();

    public void OnGet()
    {
        _dependency.WriteMessage("IndexModel.OnGet");
    }
}
```

- 该类创建并直接依赖于 MyDependency 类。 代码依赖项（如前面的示例）会产生问题，应避免使用，原因如下：
  - 要用不同的实现替换 MyDependency，必须修改 IndexModel 类。
  - 如果 MyDependency 具有依赖项，则必须由 IndexModel 类对其进行配置。 在具有多个依赖于 MyDependency 的类的大型项目中，配置代码将分散在整个应用中。
  - 这种实现很难进行单元测试。

- 依赖关系注入通过以下方式解决了这些问题：
  - 使用接口或基类将依赖关系实现抽象化。
  - 在服务容器中注册依赖关系。 ASP.NET Core 提供了一个内置的服务容器 IServiceProvider。 服务通常已在应用的 Program.cs 文件中注册。
  - 将服务注入到使用它的类的构造函数中。 框架负责创建依赖关系的实例，并在不再需要时将其释放。

接口定义 WriteMessage 方法：

```c#
public interface IMyDependency
{
    void WriteMessage(string message);
}
```

此接口由具体类型 MyDependency 实现：

```c#
public class MyDependency : IMyDependency
{
    public void WriteMessage(string message)
    {
        Console.WriteLine($"MyDependency.WriteMessage Message: {message}");
    }
}
```

示例应用使用具体类型 `MyDependency` 注册 `IMyDependency` 服务。 `AddScoped` 方法使用范围内生存期（单个请求的生存期）注册服务。 本主题后面将介绍服务生存期。

```c#
using DependencyInjectionSample.Interfaces;
using DependencyInjectionSample.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

builder.Services.AddScoped<IMyDependency, MyDependency>();

var app = builder.Build();
```

在示例应用中，请求 `IMyDependency` 服务并用于调用 `WriteMessage` 方法：

```c#
public class Index2Model : PageModel
{
    private readonly IMyDependency _myDependency;

    public Index2Model(IMyDependency myDependency)
    {
        _myDependency = myDependency;            
    }

    public void OnGet()
    {
        _myDependency.WriteMessage("Index2Model.OnGet");
    }
}
```

- 通过使用 DI 模式，控制器或 Razor 页面：
  - 不使用具体类型 MyDependency，仅使用它实现的 IMyDependency 接口。 这样可以轻松地更改实现，而无需修改控制器或 Razor 页面。
  - 创建 MyDependency 的实例，这由 DI 容器创建。

可以通过使用内置日志记录 API 来改善 IMyDependency 接口的实现：

```c#
public class MyDependency2 : IMyDependency
{
    private readonly ILogger<MyDependency2> _logger;

    public MyDependency2(ILogger<MyDependency2> logger)
    {
        _logger = logger;
    }

    public void WriteMessage(string message)
    {
        _logger.LogInformation( $"MyDependency2.WriteMessage Message: {message}");
    }
}
```

更新的 Program.cs 会注册新的 IMyDependency 实现：

```c#
using DependencyInjectionSample.Interfaces;
using DependencyInjectionSample.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

builder.Services.AddScoped<IMyDependency, MyDependency2>();

var app = builder.Build();
```

`MyDependency2` 依赖于 `ILogger<TCategoryName>`，并在构造函数中对其进行请求。 `ILogger<TCategoryName>` 是`ILogger<TCategoryName>`。

以链式方式使用依赖关系注入并不罕见。 每个请求的依赖关系相应地请求其自己的依赖关系。 容器解析图中的依赖关系并返回完全解析的服务。 必须被解析的依赖关系的集合通常被称为“依赖关系树”、“依赖关系图”或“对象图”。

容器通过利用（泛型）开放类型解析 `ILogger<TCategoryName>`，而无需注册每个（泛型）构造类型。

- 在依赖项注入术语中，服务：
  - 通常是向其他对象提供服务的对象，如 IMyDependency 服务。
  - 与 Web 服务无关，尽管服务可能使用 Web 服务。

框架提供可靠的日志记录系统。 编写上述示例中的 `IMyDependency` 实现来演示基本的 DI，而不是来实现日志记录。 大多数应用都不需要编写记录器。 下面的代码演示如何使用默认日志记录，这不需要注册任何服务：

```c#
public class AboutModel : PageModel
{
    private readonly ILogger _logger;

    public AboutModel(ILogger<AboutModel> logger)
    {
        _logger = logger;
    }
    
    public string Message { get; set; } = string.Empty;

    public void OnGet()
    {
        Message = $"About page visited at {DateTime.UtcNow.ToLongTimeString()}";
        _logger.LogInformation(Message);
    }
}
```

使用前面的代码时，无需更新 Program.cs，因为框架提供Program.cs。

## 使用扩展方法注册服务组

ASP.NET Core 框架使用一种约定来注册一组相关服务。 约定使用单个 Add{GROUP_NAME} 扩展方法来注册该框架功能所需的所有服务。 例如，AddControllers 扩展方法会注册 MVC 控制器所需的服务。

下面的代码通过个人用户帐户由 Razor 页面模板生成，并演示如何使用扩展方法 AddDbContext 和 AddDefaultIdentity 将其他服务添加到容器中：

```c#
using DependencyInjectionSample.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddRazorPages();

var app = builder.Build();
```

考虑下面的方法，该方法可注册服务并配置选项：

```c#
using ConfigSample.Options;
using Microsoft.Extensions.DependencyInjection.ConfigSample.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

builder.Services.Configure<PositionOptions>(
    builder.Configuration.GetSection(PositionOptions.Position));
builder.Services.Configure<ColorOptions>(
    builder.Configuration.GetSection(ColorOptions.Color));

builder.Services.AddScoped<IMyDependency, MyDependency>();
builder.Services.AddScoped<IMyDependency2, MyDependency2>();

var app = builder.Build();
```

可以将相关的注册组移动到扩展方法以注册服务。 例如，配置服务会被添加到以下类中：

```c#
using ConfigSample.Options;
using Microsoft.Extensions.Configuration;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class MyConfigServiceCollectionExtensions
    {
        public static IServiceCollection AddConfig(
             this IServiceCollection services, IConfiguration config)
        {
            services.Configure<PositionOptions>(
                config.GetSection(PositionOptions.Position));
            services.Configure<ColorOptions>(
                config.GetSection(ColorOptions.Color));

            return services;
        }

        public static IServiceCollection AddMyDependencyGroup(
             this IServiceCollection services)
        {
            services.AddScoped<IMyDependency, MyDependency>();
            services.AddScoped<IMyDependency2, MyDependency2>();

            return services;
        }
    }
}
```

剩余的服务会在类似的类中注册。 下面的代码使用新扩展方法来注册服务：

```c#
using Microsoft.Extensions.DependencyInjection.ConfigSample.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddConfig(builder.Configuration)
    .AddMyDependencyGroup();

builder.Services.AddRazorPages();

var app = builder.Build();
```

**注意**：每个 `services.Add{GROUP_NAME}` 扩展方法添加并可能配置服务。 `例如，AddControllersWithViews` 会添加带视图的 MVC 控制器所需的服务，`AddRazorPages` 会添加 Razor Pages 所需的服务。

## 服务生存期

要在中间件中使用范围内服务，请使用以下方法之一：

将服务注入中间件的 Invoke 或 InvokeAsync 方法。 使用构造函数注入会引发运行时异常，因为它强制使范围内服务的行为与单一实例类似。 生存期和注册选项部分中的示例演示了 方法。
使用基于工厂的中间件。 使用此方法注册的中间件按客户端请求（连接）激活，这也使范围内服务可注入中间件的构造函数。

## 服务注册方法

在为测试模拟类型时，使用多个实现很常见。

仅使用实现类型注册服务等效于使用相同的实现和服务类型注册该服务。 因此，我们不能使用捕获显式服务类型的方法来注册服务的多个实现。 这些方法可以注册服务的多个实例，但它们都具有相同的实现类型 。

上述任何服务注册方法都可用于注册同一服务类型的多个服务实例。 下面的示例以 IMyDependency 作为服务类型调用 `AddSingleton` 两次。 第二次对 AddSingleton 的调用在解析为 `IMyDependency` 时替代上一次调用，在通过 `IEnumerable<IMyDependency>` 解析多个服务时添加到上一次调用。 通过 `IEnumerable<{SERVICE}>` 解析服务时，服务按其注册顺序显示。

```c#
services.AddSingleton<IMyDependency, MyDependency>();
services.AddSingleton<IMyDependency, DifferentDependency>();

public class MyService
{
    public MyService(IMyDependency myDependency, 
       IEnumerable<IMyDependency> myDependencies)
    {
        Trace.Assert(myDependency is DifferentDependency);

        var dependencyArray = myDependencies.ToArray();
        Trace.Assert(dependencyArray[0] is MyDependency);
        Trace.Assert(dependencyArray[1] is DifferentDependency);
    }
}
```
