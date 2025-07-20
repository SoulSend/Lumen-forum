# lumen-forum后端

### 一、环境部署

本地必须有docker 所有的中间件和数据库都依赖docker

```
# redis镜像拉取和运行
docker run -d --name redis -p 6379:6379 redis:7.0

# mysql镜像拉取和运行
docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql:8.0

# nacos配置中心镜像拉取和运行
docker run -d --name nacos -p 8848:8848 -p 9848:9848 -p 9849:9849 -e MODE=standalone nacos/nacos-server:v2.2.0
```

唯一需要注意 nacos启动的时候不能只启动一个端口 否则其他服务无法注册 还需要开启另外两个端口 提供给服务注册

### 二、项目启动



### 三、项目详细

##### 1、请求的流程

用户发起请求--->gateway网关->通过全局过滤器过滤（未通过就直接驳回请求即可）-->路由到指定的服务-->该服务的拦截器-->请求控制器处理

```mermaid
sequenceDiagram
    actor 用户
    participant Gateway as Gateway网关
    participant GlobalFilter as 全局过滤器
    participant Service as 指定服务
    participant Interceptor as 服务拦截器
    participant Controller as 请求控制器

    用户->>Gateway: 发起请求
    Gateway->>GlobalFilter: 通过全局过滤器
    alt 未通过过滤
        GlobalFilter-->>用户: 驳回请求
    else 通过过滤
        GlobalFilter->>Service: 路由到服务
        Service->>Interceptor: 进入拦截器
        Interceptor->>Controller: 请求处理
        Controller-->>Interceptor: 返回结果
        Interceptor-->>Service: 返回响应
        Service-->>Gateway: 返回响应
        Gateway-->>用户: 返回响应
    end
```

##### 2、服务之间调用

服务调用发起者发起feign调用-->feign的拦截器拦截添加上下文请求头-->发起请求-->服务处理者处理请求-->处理完毕响应-->服务发起者方接收到响应，如果请求响应结果状态码为非200，则触发错误解码器解析响应结果然后抛出错误

```mermaid
sequenceDiagram
    participant ServiceCaller as 服务调用者
    participant FeignInterceptor as Feign拦截器
    participant Feign as Feign客户端
    participant ServiceHandler as 服务处理者
    participant ErrorDecoder as 错误解码器

    ServiceCaller->>FeignInterceptor: 发起Feign调用
    FeignInterceptor->>FeignInterceptor: 添加请求头
    FeignInterceptor->>Feign: 转发请求
    Feign->>ServiceHandler: 发送请求
    ServiceHandler-->>Feign: 返回响应
    alt 状态码=200
        Feign-->>FeignInterceptor: 返回成功响应
        FeignInterceptor-->>ServiceCaller: 返回结果
    else 状态码≠200
        Feign->>ErrorDecoder: 触发错误解码
        ErrorDecoder->>ErrorDecoder: 解析响应结果
        ErrorDecoder-->>Feign: 抛出错误
        Feign-->>FeignInterceptor: 传递错误
        FeignInterceptor-->>ServiceCaller: 抛出错误
    end
```

##### 3、登录请求

用户发起请求->网关过滤器白名单直接放行并路由到auth服务-->auth服务接收请求然后处理：先从redis中获取验证码，和用户的验证码比对，一致则继续，反之则报错。然后发起远程调用查看用户是否存在，如果不存在则创建，存在则响应用户的实体类。获取到用户的实体类以后调用操作redis的方法，首先用UUID生成一个token这个token作为键映射用户的id，然后用户的id作为键映射用户的缓存信息，然后再将用户的id作为键使用redis的集合集合里面存储着所有指向这个id的token。完成这些缓存工作，就将token和缓存的用户信息作为响应体响应给前端

```mermaid
sequenceDiagram
    actor 用户
    participant Gateway as Gateway网关
    participant AuthService as Auth服务
    participant Redis as Redis
    participant UserService as 用户服务

    用户->>Gateway: 发起登录请求
    Gateway->>Gateway: 白名单放行
    Gateway->>AuthService: 路由到Auth服务
    AuthService->>Redis: 获取存储的验证码
    Redis-->>AuthService: 返回验证码
    alt 验证码匹配
        AuthService->>UserService: 远程调用查询用户
        UserService-->>AuthService: 返回用户实体
        AuthService->>Redis: 存储Token(三键映射)
        Redis-->>AuthService: 存储成功
        AuthService-->>Gateway: 返回Token+用户信息
        Gateway-->>用户: 返回登录成功
    else 验证码不匹配
        AuthService-->>Gateway: 返回错误
        Gateway-->>用户: 返回验证码错误
    end
```





