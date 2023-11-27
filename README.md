<h1 align="center">ChatCard</h1>

- 这是一个基于 OpenAI API 的前端项目，可进行私有化部署

## 更新日志

- 11/26 完成基础功能

## 项目功能

- 基本问答界面
  - 支持 GPT-4-vision 对图片提问
- 多会话和上下文逻辑
  - 新增/删除会话
- 问答使用卡片展示 💥
  - 渲染 (markdown 支持数学公式、代码高亮、图片、emoji 表情)
  - 折叠 (可折叠回答，减少翻页滚动)
  - 跳过 (跳过其中部分问题/回答,即让模型丢失部分知识)
  - 编辑 (编辑问题/回答)
  - 重发 (重发问题/回答)
  - 删除 (删除问题/回答)
- 可前端设置 OPENAI_API_KEY
- 响应式、支持移动端

## 快速开始

### 本地部署

- 安装依赖、打包、运行

```sh
npm install
npm run build
npm run start
```

在浏览器打开`http://127.0.0.1:3000/`即可

- 你也可以直接启动项目

```sh
npm install
npm run dev
```

### 使用 Docker 部署

```sh
docker build -t chatcard .
docker run --name chatcard --rm -it -p 3000:3000 -d chatcard
```

- 访问主机地址`http://localhost:3000`即可
