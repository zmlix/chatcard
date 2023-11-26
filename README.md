<h1 align="center">ChatCard</h1>

- 这是一个基于OpenAI ChatGPT3.5 模型API的前端项目，可进行私有化部署
- 基本功能可以在B站看 [功能演示](https://www.bilibili.com/video/BV1Dv4y1j7vy/?share_source=copy_web&vd_source=3b1c0e37d84e6bc8d15aca417cb59494)

## 更新日志

- 11/26 完成基础功能

## 项目功能

- 基本问答界面
- 多会话和上下文逻辑
    - 新增/删除会话
- 问答使用卡片展示💥
    - 渲染 (markdown支持数学公式、代码高亮、图片、emoji表情)
    - 折叠 (可折叠回答，减少翻页滚动)
    - 跳过 (跳过其中部分问题/回答,即让模型丢失部分知识)
    - 编辑 (编辑问题/回答)
    - 重发 (重发问题/回答)
    - 删除 (删除问题/回答)
- 可前端设置OPENAI_API_KEY
- 响应式、支持移动端

## 快速开始

### 本地部署
- 安装依赖、打包
```sh
npm install
npm run build
```

- 进入打包好的文件夹`\dist`
```sh
python -m http.server
或者
python3 -m http.server
````

在浏览器打开`http://127.0.0.1:8000/`即可

- 你也可以直接启动项目
```sh
npm install
npm run dev
```

### 使用Docker部署

```sh
docker build -t chatcard .
docker run --name chatcard --rm -it -p 5200:5200 -d chatcard
```

- 访问主机地址`http://localhost:5200`即可
