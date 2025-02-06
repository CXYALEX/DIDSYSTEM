## 去中心化身份系统方案

### 概述
去中心化身份系统方案设计。其中issuer,holder,verifier的部分运行在用户的前端，用vue实现，它们在本地管理自己的私钥。后端通过数据库来管理issuer和holder的dids和credentials的信息。VDR包括区块链和IPFS，holder在区块链上注册自己的DID，issuser在blockchain上注册用户的credential ID.
![Alt text](figs/scheme.png)

### 设计目标
* 选择性披露
* 不可转让性
* 不可链接性
* 凭证撤销
### 系统架构

#### 架构图

```plaintext
+--------------------+        +--------------------+
|                    |        |                    |
|      Frontend      |        |       Backend      | 
|    (Vue.js App)    |        |      (Flask)       |
|                    |        |                    |
|  +--------------+  | <----> |  +--------------+  |
|  | BBS+ Sig/Ver |  |        |  |   Database   |  |
|  +--------------+  |        |  +--------------+  |
|                    |        |                    |
|                    |        |                    |
+--------------------+        +--------------------+
          |                              |
          v                              v
+--------------------+        +--------------------+
|                    |        |                    |
|       IPFS         |        |     Blockchain     |
|                    |        |                    |
|  +--------------+  |        |  +--------------+  |
|  |  Creds State |  |        |  |   DID Mgmt   |  |
|  +--------------+  |        |  | SmartContract|  |
|                    |        |  +--------------+  |
|                    |        |                    |
+--------------------+        +--------------------+
```

#### 技术栈

- **前端**
  - Vue
  - web3.js
  - Axios
  - JSON-lD & BBS+ 签名库 (ref:https://github.com/mattrglobal/jsonld-signatures-bbs)
- **后端**
  - Flask
  - Flask-login
  - SQLAlchemy
  - blockchain

### 系统模块设计

#### 1. 用户注册与登录

- **注册**
  - 参数：`username`, `password`,`role` 
  - 流程：
    1. 前端收集用户信息并发送 POST 请求到 `/api/register`。
    2. 后端存储用户信息。
    3. 返回注册成功消息。

- **登录**
  - 参数：`username`, `password`
  - 流程：
    1. 前端发送 POST 请求到 `/api/login`。
    2. 后端验证凭据，保存用户id到session
    3. 重定向到主页

#### 2. Holder (持有者)

- **注册DID** + 包括用别人DID
  - 方法：POST
  - 路径：`/api/holder/{username}/registerdid`
  - 流程：
    1. 用户通过前端的web3.js直接与区块链进行交互，在区块链上注册DID
    2. 显示用户注册的DID列表

- **申请凭证**  + 添加凭证
  - 方法：POST
  - 路径：`/api/holder/{username}/credentials/apply-credential`
  - 参数：`username`,`did` `issuer`, `scheme`, `attribute`
  - 流程：
    1. 前端发送credential的申请表单到后端
    2. 后端将credential的申请加入到对应issuer的`waited issued list`(DB of Backend)

- **查看凭证** 
  - 方法：GET 
  - 路径：`/api/holder/{username}/credenitals/{credentialID}`
  - 流程：
    1. 查看特定的credenital

- **生成Credenital Presentation**
  - 方法：POST
  - 路径：`/api/holder/{username}/credenitals/presentation-credential`
  - 参数：`predicate`
  - 流程：
    1. 前端通过BBS+算法生成derived credential
    2. 显示Presentation (json)  
    3. 未来可以考虑生成Presentation的二维码


#### 3. Issuer (发行者)

- **创建凭证模版**
  - 方法：POST
  - 路径：`/api/issuer/{username}/template/create-template`
  - 流程：
    1. issuer在前端输入template的属性（json），通过bbs+算法初始化参数。
    2. 前端发送template和bbs+对应的参数到后端。
    3. 后端保存credential的模版到模版表template List。

- **凭证颁发**
  - 方法：POST
  - 路径：`/api/issuer/{username}/credentials/issue-credential`
  - 流程：
    1. 在前端显示对应issuer的`waited issued list`。
    2. 选择其中一个credential，用bbs+算法生成签名。
    3. credential和签名被发送到后端。
    4. 后端保存credential到凭证表valid credential list.
    5. 后端上传credentailID到blochchain（智能合约）

- **撤销凭证**
  - 方法：POST
  - 路径：`/api/holder/{username}/credentials/revoke-credential`
  - 参数：`credentialID`
  - 流程：
    1. 从blochchain中移除credenialID

### JSON-lD & BBS+ 签名库
参考：1. https://trinsic-id.github.io/json-bbs-signatures/#using-json-path
2. https://www.w3.org/TR/json-ld11/#advanced-concepts
3. https://github.com/mattrglobal/jsonld-signatures-bbs/tree/master
#### 功能设计
用javascript实现BBS+签名算法。
1. 实现credential template, credentail, credential presentation
2. 实现credentialSignature基类，BBS+Signature算法类，Signature适配器.

- **initCreds：初始化参数**
  - input: credential模版
  - output: generaters, parameters of BBS

- **signCreds：签名credenital**
  - input: credential request(json)，issuer public key
  - output: credential & proof（json）

- **verifyCreds：验证credentail**
  - input: credential & proof(json)
  - output: 1/0

- **createPres：创建veriable presentation**
  - input: credential & proof（json) 
  - output: veriable presentation(json)

- **verifyCreds：验证veriable presentation**
  - input: veriable presentation(json)
  - output: 1/0

#### Example
1. 基于BBS+对Json-LD document进行签名.
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/citizenship/v1",
    "https://w3id.org/security/bbs/v1"
  ],
  "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
  "type": ["VerifiableCredential", "PermanentResidentCard"],
  "issuer": "did:example:489398593",
  "identifier": "83627465",
  "name": "Permanent Resident Card",
  "description": "Government of Example Permanent Resident Card.",
  "issuanceDate": "2019-12-03T12:19:52Z",
  "expirationDate": "2029-12-03T12:19:52Z",
  "credentialSubject": {
    "id": "did:example:b34ca6cd37bbf23",
    "type": ["PermanentResident", "Person"],
    "givenName": "JOHN",
    "familyName": "SMITH",
    "gender": "Male",
    "image": "data:image/png;base64,iVBORw0KGgokJggg==",
    "residentSince": "2015-01-01",
    "lprCategory": "C09",
    "lprNumber": "999-999-999",
    "commuterClassification": "C1",
    "birthCountry": "Bahamas",
    "birthDate": "1958-07-17"
  },
  "proof": {
    "type": "BbsBlsSignature2020",
    "created": "2020-04-26T04:21:07Z",
    "verificationMethod": "did:example:489398593#test",
    "proofPurpose": "assertionMethod",
    "proofValue": "jx2VhjyZqUT91e2OhzweJA7G2u2UvmiDtIfmr+wUWNHWno+UOAh0FaNpM8Br+5j2JBkH981/nO1I7/9PFaRrng6NXu7vzDroKtuyj6nHGkMmGq4OMmBzIqRnG3ybin/Sxmu5YwqOxPMRsWH3H+2wSA=="
  }
}
```
2. 选择性披露：
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/citizenship/v1",
    "https://w3id.org/security/bbs/v1"
  ],
  "id": "https://issuer.oidp.uscis.gov/credentials/83627465",
  "type": ["PermanentResidentCard", "VerifiableCredential"],
  "description": "Government of Example Permanent Resident Card.",
  "identifier": "83627465",
  "name": "Permanent Resident Card",
  "credentialSubject": {
    "id": "did:example:b34ca6cd37bbf23",
    "type": ["Person", "PermanentResident"],
    "familyName": "SMITH",
    "gender": "Male",
    "givenName": "JOHN"
  },
  "expirationDate": "2029-12-03T12:19:52Z",
  "issuanceDate": "2019-12-03T12:19:52Z",
  "issuer": "did:example:489398593",
  "proof": {
    "type": "BbsBlsSignatureProof2020",
    "created": "2020-05-25T23:07:10Z",
    "verificationMethod": "did:example:489398593#test",
    "proofPurpose": "assertionMethod",
    "proofValue": "ABgA/4N3qygQRJlX3gmQOlJRGbO1KTXKQUmaN02xl+FiNZUDmGfa5OoKtg0RJ4wxxA08t3Vut61G/pq4yN0bygaFk5EJF6j7zFXmz9Vc7EdlDAvUkXqPaKA8inSBNv97HiZ1o5hIpoRnepW89p4JXPVrFi8XbDARSZpCg18GUuUMaPQLHKU82M/9l8tqqG1lKBOs+sRAAAAAdKRrRPj6zAz5LPZgDZJ0J2rNJjQI+JNYbV4AYEVwW37sxQ99aGGvmBk3DL0sod1V/gAAAAJMLYjmrb92zV087wO8UtFLwMj7qJuqV9VkMDghdrrc3BGtJuQgKx2GTrOb4CQxI1bf+iG0USjTktcjTlKv3X5spg3+ihOnyve0HnMWWggAW22j8b78jbl7lkYGJvzIXTzrVJ5KdYp3tXMDTAX7CLEXAAAACVY8oocA9Bz1w42F8Yv7UAPHv4pSvunXqndFOet3kWtzYHYEbO5gc42wPQtLmTtmqP6kUbQv6ruxzRmANulB8fUfy2jah/QeHKvsp907YDnSfo2wofRxa/vzsZnVriw0UmZnP0sYjbhmCkhoQZkxhqel3IkOF+H80wzvCKCl6eq5biEFMYA4bXpDX6Ap5/6WS5SSFaJRWxW+hpR/9EuQE11sGtk2W2Wn4eBrQUgVqYgPLI+U/ONaUJrh+GVJ/XXx7xxbAUf/NeQ/13AkTnYNn1fUdiOJ2oKl1lGr59udFq2tBBsyC3msTtQPYJS084355GRBur5jnzPNJ2W6Gu3ZqqQeRrVyw1gzdhVDNOE8KUm9OQ3AvCuxo8PHNrqzNvc6VA==",
    "nonce": "37pdwue1a8FWLqgwCd0QJ0IJTFhp609KtxeCTWZGnfAVE+sOBDffYez+TY/bmVy+6z4="
  }
}
```
3. 谓词证明Predicate proof. (Zero-knowledge proof)
在web端实现predicate proof.
  * ref：https://github.com/iden3/wasmsnark 
  * 需求：a is in commitment（bbs+）同时 a 满足一个predicate.
  * 高级需求：recursive snark.

4. 凭证撤销证明。

   1.开发一个credential的智能合约 

   2. non-memship /membership proof 低
### 数据库设计

#### 1. 用户表（users）

| 列名              | 类型         | 描述                     |
|-------------------|--------------|--------------------------|
| username          | VARCHAR(50)  | 用户名          |
| userid                | SERIAL       | 用户ID                     |
| Hash of password            | SERIAL | 密码        |

#### 2. 用户did表（user did list）

| 列名              | 类型         | 描述                     |
|-------------------|--------------|--------------------------|
| userid                | SERIAL       | 用户ID                     |
| userDID         | VARCHAR(50)  | 用户 DID         |
| public key         | VARCHAR(50)  | 用户公钥       |




#### 3. 凭证请求表（Cred Req list）

| 列名              | 类型         | 描述                     |
|-------------------|--------------|--------------------------|
| CredentialID          | SERIAL       | 凭证ID           |
| issuer DID         | SERIAL  | 发行者 ID        |
| Credentail Req            | JSON | 凭证请求   |

#### 4. 凭证表（Cred list）

| 列名              | 类型         | 描述                     |
|-------------------|--------------|--------------------------|
| credential ID               | SERIAL       | 凭证ID        |
| holder DID         | SERIAL  | 用户名          |
| expirationDate          | VARCHAR(50) | 过期时间       |
| issueDate          | VARCHAR(50) | 发布时间      |
| credentialState         | BOOL | 是否被撤销       |

#### 4. 凭证模版表（Cred template list）

### 开发计划 JSON-lD & BBS+ 

3周  deadline ：12月16号 -17号

#### 分工
| 类型             | 功能        | 预计时间                    |
|-------------------|--------------|--------------------------|
| 后端 蔡     | 代码重构       | 15人天         |
|             | 用户管理  |        |
|             | template管理  |        |
|             | 凭证管理  |       |
|             | 联调 |    |
| 前端 王       | 私钥管理      | 15人天         |
|             | credential template |         |
|             | 凭证创建和签名  |       |
|             | 联调 |    |
| JSON-lD & BBS+ 谢斌和宋 | 签名算法设计       | 30人天         |
|             | 签名算法开发  |       |
|             | 联调|    |
| ZK 崔       |        | 15人天         |



