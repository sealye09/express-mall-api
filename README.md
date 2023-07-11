## 羽毛球场地预约系统——后台

### 开始

##### 依赖安装

```bash
npm i install express@next 		# node.js 框架 开发接口
npm i install bcrypt			# 用于密码的加密
npm i install cors				# 跨域访问
npm i install jsonwebtoken		# 生成 token
npm i install mongoose 			# 连接数据库 (MongoDB)
npm i install rest				# 接口测试 (类似postman)
npm install -g nodemon			# 保存文件自动重启服务
# 或者
npm install						# 根据 package.json 安装依赖
```

##### 启动项目

```bash
nodemon server.js
```

### 数据库模型设计

##### 1. 用户模型

ObjectId（MongoDB 自动生成，唯一）

用户名（唯一）

密码（加密存放）

用户类型

购物车

订单（虚拟字段，通过 ObjectId 连接订单模型，用户查询）

##### 2. 商品模型

ObjectId

商品名称

价格

库存

商品描述

##### 4. 订单模型

ObjectId

订单时间

订单状态

#### 5. 购物车模型

##### 6. Banner
