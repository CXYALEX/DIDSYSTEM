# DIDSYSTEM 

| Library | Function |
|-----------------|-------|
| api           | Backend |
| src            | Frontend      |
| DIDContract          |   Link：[https://github.com/CXYALEX/DIDContract](https://github.com/CXYALEX/DIDContract)  |
| BBS+ Library   |   Link：[https://github.com/CXYALEX/DIDContract ](https://github.com/kfxp12138/jsonld-signatures-bbs) |
## Dependencies

| Software/Library | Version              | 
|-----------------|----------------------|
| Python          | 3.8.10                 | 
| Node.js         | v16.x            |    


### Create virtual env and install flask dependencies
1. Creaet the python3.8 virtual env. (Before, make sure you have install Python3.8)
```bash
# 创建虚拟环境
python3.8 -m venv myenv

# 激活虚拟环境
# Windows:
myenv\Scripts\activate
# Linux/Mac:
source myenv/bin/activate

# 退出虚拟环境
deactivate
```
2. Install dependencies
```bash
# 安装依赖
cd api/
pip3 install -r requirement.txt
```
### install vue dependencies
```
npm install 
```

# Backend
## DataBase
If you wan to init the db, please delete the `/migrations` directory.
```
$(venv) flask db init  # 初始化操作
$(venv) flask db migrate # 数据库迁移操作
$(venv) flask db upgrade # 数据模型升级操作
```
## Launch
```
cd api/
flask run
```
## Deploy Smartcontract
Link：https://github.com/CXYALEX/DIDContract



# Frontend

## Build Setup

```bash
# install dependency
npm install

# develop   
npm run dev
```

This will automatically open http://localhost:9528

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment, this will output /dist
npm run build:prod
```
