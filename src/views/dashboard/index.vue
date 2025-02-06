<template>
  <div class="container">
    <button @click="connectWallet">Connect to Wallet</button>
    <p v-if="account">Connected Account: {{ account }}</p>
    <p v-else>Please connect your MetaMask wallet.</p>

    <!-- 
    <div v-if="account">
      <input v-model="recipient" placeholder="Recipient Address" />
      <input v-model.number="amount" placeholder="Amount (ETH)" type="number" />
      <button @click="sendTransaction">Send Transaction</button>
    </div> 
    -->
  </div>
</template>
<script>
import detectEthereumProvider from '@metamask/detect-provider';
import wasmPath from '@/utils/bbs/wasm_bg.wasm';

console.log("WASM File Path:", wasmPath);
export default {
  data() {
    return {
      account: null, // 存储连接的账户地址
      recipient: '', // 收款地址
      amount: 0, // 转账金额
      provider: null
    };
  },
  methods: {
    async connectWallet() {
      this.provider = await detectEthereumProvider();
      if (this.provider) {
        try {
          const accounts = await this.provider.request({
            method: 'eth_requestAccounts',
          });
          this.account = accounts[0];
          await this.$store.dispatch('web3/changeWeb3Account', this.account);
        } catch (error) {
          console.error('User rejected the request:', error);
        }
      } else {
        alert('MetaMask is not installed. Please install it to use this feature.');
      }
    },
    // async sendTransaction() {
    //   if (!this.recipient || !this.amount) {
    //     alert('Please enter a valid recipient address and amount.');
    //     return;
    //   }

    //   try {
    //     const transactionParameters = {
    //       to: this.recipient, // 收款地址
    //       from: this.$store.state.web3.web3account, // 当前账户地址
    //       value: (this.amount * (10 ** 18)).toString(16), // 转账金额（转换为 wei）
    //     };

    //     await this.provider.request({
    //       method: 'eth_sendTransaction',
    //       params: [transactionParameters],
    //     });
    //     alert('Transaction sent!');
    //   } catch (error) {
    //     console.error('Transaction failed:', error);
    //   }
    // },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* 使容器填满整个视口高度 */
}

button {
  padding: 10px 20px;
  background-color: #f6851b;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #e76e05;
}

input {
  margin: 5px 0;
  padding: 10px;
  width: calc(100% - 22px);
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>