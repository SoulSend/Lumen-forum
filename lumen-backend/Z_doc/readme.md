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

### 

### 三、流程图

登录授权流程

这个流程下要防止重复点击登录按钮，发起多次重复的登录请求，即维护登录的幂等性，确保一个验证码只能登陆一次，我在后端校验验证码以后直接删除验证码，然后再继续。前端也需要做防抖处理。



