# DIDSYSTEM 
scheme: [DID scheme](scheme.md)
| Library | Function |
|-----------------|-------|
| api           | Backend |
| src            | Frontend      |
| DIDContract          |   Link：[https://github.com/CXYALEX/DIDContract](https://github.com/CXYALEX/DIDContract)  |
| BBS+ Library   |   Link：[https://github.com/kfxp12138/jsonld-signatures-bbs](https://github.com/kfxp12138/jsonld-signatures-bbs) |
## Dependencies

| Software/Library | Version              | 
|-----------------|----------------------|
| Python          | 3.8.10                 | 
| Node.js         | v16.x            |    


### Create virtual env and install flask dependencies
1. Creaet the python3.8 virtual env. (Before, make sure you have install Python3.8)
```bash
# Create virtual environment
python3.8 -m venv myenv

# Activate environment
# Windows:
myenv\Scripts\activate
# Linux/Mac:
source myenv/bin/activate

# Deactivate environment
deactivate
```
2. Install dependencies
```bash
# install python dependencies
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
mkdir logs
$(venv) flask db init  # Initialize database
$(venv) flask db migrate # Generate migration scripts
$(venv) flask db upgrade # Apply database schema
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


