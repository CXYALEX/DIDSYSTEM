const DB_VERSION = 1;
const DID_STORE_NAME = 'dids';
const TEMPLATE_STORE_NAME = 'templates'; // New store for templates
const CREDENTIAL_STORE_NAME = 'credentials'; // New store for credentials

// 打开或创建数据库，依据 userId 生成数据库名称
function openDB(userId) {
    const DB_NAME = `did_database_${userId}`; // 根据用户ID创建数据库名称

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => reject('打开数据库失败');
        request.onsuccess = (event) => resolve(event.target.result);

        // 初始化数据库结构
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(DID_STORE_NAME)) {
                db.createObjectStore(DID_STORE_NAME, { keyPath: 'id' }); // 使用DID的ID作为主键
            }
            if (!db.objectStoreNames.contains(TEMPLATE_STORE_NAME)) {
                db.createObjectStore(TEMPLATE_STORE_NAME, { keyPath: 'id' }); // 使用模板的ID作为主键
            }
            if (!db.objectStoreNames.contains(CREDENTIAL_STORE_NAME)) {
                db.createObjectStore(CREDENTIAL_STORE_NAME, { keyPath: 'id' }); // 使用凭证的ID作为主键
            }
        };
    });
}

// 存储DID
export const saveDID = async (userId, did) => {
    const db = await openDB(userId);
    const transaction = db.transaction(DID_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(DID_STORE_NAME);
    store.add({ id: did, createdAt: new Date().toISOString() });

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve('DID已保存');
        transaction.onerror = () => reject('保存DID失败');
    });
};

// 获取所有DID
export const getDIDs = async (userId) => {
    const db = await openDB(userId);
    const transaction = db.transaction(DID_STORE_NAME, 'readonly');
    const store = transaction.objectStore(DID_STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = () => reject('获取DID列表失败');
    });
};

// // 获取所有DID ID
// export const getAllDIDIds = async (userId) => {
//     const db = await openDB(userId);
//     const transaction = db.transaction(DID_STORE_NAME, 'readonly');
//     const store = transaction.objectStore(DID_STORE_NAME);
//     const request = store.getAll();

//     return new Promise((resolve, reject) => {
//         request.onsuccess = (event) => {
//             // 提取所有的 did.id
//             const dids = event.target.result;
//             const didIds = dids.map(did => did.id);
//             resolve(didIds); // 返回 did.id 的列表
//         };
//         request.onerror = () => reject('获取DID ID列表失败');
//     });
// };
// 获取所有DID ID
export const getAllDIDIds = async (userId) => {
    // 判断是否为测试账号（test-开头）
    if (userId && userId.startsWith('test-')) {
        // 测试账号直接返回预定义的DID IDs
        const didIds = [
            `did:${userId}:123`,
            `did:${userId}:456`
        ];
        return didIds;
    }

    // 非测试账号，正常从数据库获取
    const db = await openDB(userId);
    const transaction = db.transaction(DID_STORE_NAME, 'readonly');
    const store = transaction.objectStore(DID_STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            // 提取所有的 did.id
            const dids = event.target.result;
            const didIds = dids.map(did => did.id);
            resolve(didIds); // 返回 did.id 的列表
        };
        request.onerror = () => reject('获取DID ID列表失败');
    });
};

// 删除DID
export const deleteDID = async (userId, did) => {
    const db = await openDB(userId);
    const transaction = db.transaction(DID_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(DID_STORE_NAME);
    store.delete(did);

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve('DID已删除');
        transaction.onerror = () => reject('删除DID失败');
    });
};

// 存储模板
export const saveTemplate = async (userId, template) => {
    const db = await openDB(userId);
    const transaction = db.transaction(TEMPLATE_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(TEMPLATE_STORE_NAME);
    const id = template.id || new Date().getTime(); // Generate an ID if not provided
    store.add({ id, name: template.name, template_json: template.template_json, createdAt: new Date().toISOString() });

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve('模板已保存');
        transaction.onerror = () => reject('保存模板失败');
    });
};

// 获取所有模板
export const getTemplates = async (userId) => {
    const db = await openDB(userId);
    const transaction = db.transaction(TEMPLATE_STORE_NAME, 'readonly');
    const store = transaction.objectStore(TEMPLATE_STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = () => reject('获取模板列表失败');
    });
};

// 删除模板
export const deleteTemplate = async (userId, templateId) => {
    const db = await openDB(userId);
    const transaction = db.transaction(TEMPLATE_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(TEMPLATE_STORE_NAME);
    store.delete(templateId);

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve('模板已删除');
        transaction.onerror = () => reject('删除模板失败');
    });
};

// 存储凭证
export const saveCredential = async (userId, credential) => {
    const db = await openDB(userId);
    const transaction = db.transaction(CREDENTIAL_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(CREDENTIAL_STORE_NAME);
    const id = credential.id || new Date().getTime(); // Generate an ID if not provided
    store.add({ id, name: credential.name, data: credential.data, createdAt: new Date().toISOString() });

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve('凭证已保存');
        transaction.onerror = () => reject('保存凭证失败');
    });
};

// 获取所有凭证
export const getCredentials = async (userId) => {
    const db = await openDB(userId);
    const transaction = db.transaction(CREDENTIAL_STORE_NAME, 'readonly');
    const store = transaction.objectStore(CREDENTIAL_STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = () => reject('获取凭证列表失败');
    });
};

// 删除凭证
export const deleteCredential = async (userId, credentialId) => {
    const db = await openDB(userId);
    const transaction = db.transaction(CREDENTIAL_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(CREDENTIAL_STORE_NAME);
    store.delete(credentialId);

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve('凭证已删除');
        transaction.onerror = () => reject('删除凭证失败');
    });
};