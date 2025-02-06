import fs from 'fs';
import VDR_json from "./VDR.json";
import Web3 from 'web3';

export class VDRContract {
    constructor(provider, contractAddress) {
        this.web3 = new Web3(provider);
        this.contractAddress = contractAddress;
        const abi = VDR_json["abi"];
        this.contract = new this.web3.eth.Contract(abi, contractAddress);
    }

    async registerDID(accountAddress, did) {
        console.log("registerDID");
        const receipt = await this.contract.methods.registerDID(did).send({ from: accountAddress });
        console.log("receipt-registerDID");
        return receipt;
    }

    async getDID(did) {
        try {
            return await this.contract.methods.getDID(did).call();
        } catch (err) {
            console.error(`Error fetching DID: ${err.message}`);
        }
    }

    async registerIssuer(accountAddress, did, methodType, publicKey) {
        console.log("registerIssuer");
        try {
            const receipt = await this.contract.methods.registerIssuer(did, methodType, publicKey).send({ from: accountAddress });
            console.log("receipt-registerIssuer");
            return receipt;
        } catch (err) {
            console.error(`Error in registerIssuer: ${err.message}`);
            throw err;
        }
    }

    async getIssuer(did) {
        console.log("getIssuer");
        try {
            const issuer = await this.contract.methods.getIssuer(did).call();
            console.log("issuer", issuer);
            return issuer;
        } catch (err) {
            console.error(`Error fetching Issuer: ${err.message}`);
            throw err;
        }
    }

    async removeIssuer(accountAddress, did) {
        console.log("removeIssuer");
        try {
            const receipt = await this.contract.methods.removeIssuer(did).send({ from: accountAddress });
            console.log("receipt-removeIssuer");
            return receipt;
        } catch (err) {
            console.error(`Error in removeIssuer: ${err.message}`);
            throw err;
        }
    }

    async checkRevocation(issuerDid, credId) {
        console.log("checkRevocation");
        try {
            const isRevoked = await this.contract.methods.checkRevocation(issuerDid, credId).call();
            console.log("isRevoked-inside", isRevoked);
            return isRevoked;
        } catch (err) {
            console.error(`Error checking revocation: ${err.message}`);
            throw err;
        }
    }
    async revoke(accountAddress, did, credId) {
        console.log("revoke");
        try {
            const receipt = await this.contract.methods.revoke(did, credId).send({ from: accountAddress });
            console.log("receipt-revoke");
            return receipt;
        } catch (err) {
            console.error(`Error in revoke: ${err.message}`);
            throw err;
        }
    }

    // Helper methods
    async buildTransaction(method, from) {
        const gas = await method.estimateGas({ from });
        const gasPrice = await this.web3.eth.getGasPrice();
        const nonce = await this.web3.eth.getTransactionCount(from);

        return {
            to: this.contractAddress,
            data: method.encodeABI(),
            gas,
            gasPrice,
            nonce,
        };
    }

    async sendTransaction(txData, privateKey) {
        const signedTx = await this.web3.eth.accounts.signTransaction(txData, privateKey);
        return await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }
}