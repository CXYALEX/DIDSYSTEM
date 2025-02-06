import { Bls12381G2KeyPair } from "./signature/index";
// import attributeTemplate from "./basic-template/attributeTemplate.json";
import inputDocument from "./basic-template/inputDocument.json";

async function createIssuerKey(_publicKeyId, _issuerId) {
    const myLdKey = await Bls12381G2KeyPair.generate({
        id: _publicKeyId,
        controller: _issuerId
    })
    var keyPairOptions = {}
    keyPairOptions["id"] = _publicKeyId
    keyPairOptions["controller"] = _issuerId
    keyPairOptions["publicKeyBase58"] = myLdKey.publicKey
    keyPairOptions["privateKeyBase58"] = myLdKey.privateKey
    return keyPairOptions
}

function createVocab(template, templateName, items, url) {
    template["@context"][templateName] = require("./basic-template/attributeTemplate.json")
    template["@context"][templateName]["@id"] = url
    for (var item in items) {
        if (items[item] == "int") {
            template["@context"][templateName]["@context"][item] = { "@id": "test:" + item, "@type": "xsd:int" }
        } else if (items[item] == "dateTime") {
            template["@context"][templateName]["@context"][item] = { "@id": "test:" + item, "@type": "xsd:dateTime" }
        } else if (items[item] == "decimal") {
            template["@context"][templateName]["@context"][item] = { "@id": "test:" + item, "@type": "xsd:decimal" }
        } else {
            template["@context"][templateName]["@context"][item] = { "@id": "test:" + item, "@type": "xsd:normalizedString" }
        }
    }
    template["@context"][templateName]["@context"]["id"] = "@id"
    return template
}

const createControllerDoc = (template, issuerId, publicKeyId) => {
    template.id = issuerId;
    template.assertionMethod = template.assertionMethod || []; //Handle potential undefined array
    template.assertionMethod.push(publicKeyId);
    return template;
};

const createInputDocument = (vocabUrl, templateName, issuerId, attributes) => {
    const template = { ...inputDocument }; //Use spread syntax to create a copy
    template["@context"].push(vocabUrl);
    template.credentialSubject.type.push(templateName);
    template.issuer = issuerId;
    Object.assign(template.credentialSubject, attributes); //More efficient way to add attributes

    const issueTime = new Date();
    const expireTime = new Date();
    expireTime.setMonth(issueTime.getMonth() + 1);
    template.issuanceDate = issueTime;
    template.expirationDate = expireTime;
    const identifier = Math.round(Math.random() * 100000);
    template.identifier = identifier;
    template.id = `${template.id}${identifier}`; //Template literal for string concatenation
    return template;
};

async function createTemplate(items, issuerId, publicKeyId, templateName) {
    var publicKeyId = issuerId + '#' + publicKeyId
    var keyPairOptions = await createIssuerKey(publicKeyId, issuerId)
    var exampleControllerDoc = createControllerDoc(require("./basic-template/controllerDocument.json"), issuerId, publicKeyId)
    var bbsContext = require("./basic-template/bbs.json");
    var vocabUrl = "https://w3id.org/test/" + Math.round(Math.random() * 100000) + "/" + templateName
    var vocab = createVocab(require("./basic-template/vocab.json"), templateName, items, vocabUrl)
    var credentialContext = require("./basic-template/credentialsContext.json")
    var suiteContext = require("./basic-template/suiteContext.json")
    var documents = {
        "https://w3id.org/security/bbs/v1": bbsContext,
        "https://www.w3.org/2018/credentials/v1": credentialContext,
        "https://w3id.org/security/suites/jws-2020/v1": suiteContext,
    }
    documents[issuerId] = exampleControllerDoc
    documents[publicKeyId] = keyPairOptions
    documents[vocabUrl] = vocab
    return {
        "documents": documents,
        "vocabUrl": vocabUrl,
        "templateName": templateName,
        "issuerId": issuerId,
        "publicKeyId": publicKeyId
    }
    //在公开出去之前 需要将keyPairOptions.privateKeyBase58置空
}

function getVocabFromTemplate(template) {
    var vocabUrl = template["vocabUrl"]
    var templateName = template["templateName"]
    var documents = template["documents"]
    var items = documents[vocabUrl]['@context'][templateName]["@context"]
    var ignoreItems = ["@version", "@protected", "type", "test", "schema", "xsd"]
    var result = {}
    for (var item in items) {
        if (ignoreItems.indexOf(item) >= 0)
            continue
        else {
            result[item] = items[item]
        }
    }
    result.id = { '@id': 'test:id', '@type': 'xsd:string' }
    return result
}

function createInputDoc(template, attributes) {
    var vocabUrl = template.vocabUrl
    var templateName = template.templateName
    var issuerId = template.issuerId
    return createInputDocument(vocabUrl, templateName, issuerId, attributes)
}

function createRevealDoc(template, revealedAttributes) {
    var deriveDoc = require("./basic-template/deriveProofFrame.json")
    deriveDoc["@context"].push(template["vocabUrl"])
    deriveDoc["credentialSubject"]["type"].push(template["templateName"])
    for (var item in revealedAttributes) {
        deriveDoc["credentialSubject"][item] = revealedAttributes[item]
    }
    return deriveDoc
}

export {
    getVocabFromTemplate,
    createInputDoc,
    createTemplate,
    createInputDocument,
    createControllerDoc,
    createIssuerKey,
    createVocab,
    createRevealDoc
};