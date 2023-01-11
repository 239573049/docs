---
sidebar_position: 1
---

# 记录.Net Core 实现简单的上传文件功能实现

1. 安装 Microsoft.AspNetCore.StaticFiles

2. 在 Startup.cs 文件中添加以下代码：

   ```c#
   public void ConfigureServices(IServiceCollection services)
   {
       services.AddMvc();
   }

   public void Configure(IApplicationBuilder app, IHostingEnvironment env)
   {
        // 使用静态文件中间件
       app.UseStaticFiles();
       app.UseMvc();
   }
   ```

   [UseStaticFiles 中间件文档](https://learn.microsoft.com/zh-cn/aspnet/core/fundamentals/static-files?view=aspnetcore-7.0)

3. 在 Controller 中添加以下代码：

   ```c#
   [HttpPost]
   public async Task<string> UploadFile(IFormFile file)
   {
       if (file == null || file.Length == 0)
           return Content("未选择文件");

        var fileName = file.GetFilename();
       // 获取文件保存的目录
        var path = Path.Combine(
                   Directory.GetCurrentDirectory(), "wwwroot",fileName);
       // 将上传的Stream 直接Copy到新建的文件中
       using (var stream = new FileStream(path, FileMode.Create))
       {
           await file.CopyToAsync(stream);
       }

       // 由于路由不需要添加wwwroot所以直接返回文件名称 
       return fileName;
   }
   ```

4. 在 View 中添加以下代码：

html上传文件代码

   ```html
   <form
     asp-controller="Home"
     asp-action="UploadFile"
     enctype="multipart/form-data"
     method="post"
   >
    <input type="file" name="file" />  <!-- 选择文件 -->
     <input type="submit" value="Upload" />  <!-- 提交按钮 -->
   </form>
   ```

axios上传文件代码

```js
// 创建FormData对象
let formData = new FormData();
// 通过append()方法添加文件
formData.append('file', file);
// 发送请求
axios.post('/api/upload', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
```
