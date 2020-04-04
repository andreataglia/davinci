<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" style="width: 100px;" />
    <h1>DaVinci Vouchers</h1>
    <div class="content">
      <div v-for="hour in differentHours" v-bind:key="hour" class="column">
        <h2>Hour: {{hour}}</h2>
        <div v-for="voucher in getVoucherPerHour(hour)" v-bind:key="voucher.id" class="voucher">
          Id: {{ voucher.id }}<br />
          Rag. Sociale: {{ voucher.ragione_sociale }}<br>
          Gratuito: {{ voucher.gratuito }}<br>
          Sconto: {{ voucher.sconto }}<br>
          Timestamp: {{ voucher.timestamp }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      vouchers: [],
    };
  },
  mounted() {
    axios
      .get('http://127.0.0.1:9000/read', { crossdomain: true })
      .then((response) => {
        this.vouchers = response.data;
      })
      .catch((error) => console.log(error));
  },
  methods: {
    getVoucherPerHour: function (hour) {
      return this.vouchers.filter(v => new Date(v.timestamp).getUTCHours() === hour);
    },
  },
  computed: {
    differentHours: function () {
      let arr = [];
      for (let i = 0; i < this.vouchers.length; i++) {
        arr.push(new Date(this.vouchers[i].timestamp).getUTCHours());
      }
      return arr.filter((value, index, self) => self.indexOf(value) === index);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.voucher {
  background-color: #2c3e50;
  color: white;
  border: 2px solid gray;
  margin-top: 5px;
  padding: 5px 5px 5px 5px;
  max-width: 400px;
  text-align: left;
}

.content {
  background-color: coral;
  display: flex;
  align-items: initial;
  justify-content: space-around;
}
</style>
