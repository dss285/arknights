<script setup lang="ts">
let distinctionCertificateAmounts: number[] = [10, 18, 40, 70, 120];
let items: string[] = [
  "1x Headhunting Permit",
  "2x Headhunting Permit",
  "5x Headhunting Permit",
  "1x Ten Roll Headhunting Permit",
  "2x Ten Roll Headhunting Permit",
];
</script>

<template>
  <table id="distinctionTable">
    <tr>
      <th>Items</th>
      <th>Certificates</th>
      <th>Certificates Total</th>
    </tr>
    <tr v-for="index in 5" :key="index - 1">
      <td>{{ items[index - 1] }}</td>
      <td>{{ distinctionCertificateAmounts[index - 1] }}</td>
      <td>
        {{
          distinctionCertificateAmounts
            .slice(0, index)
            .reduce((a, b) => a + b, 0)
        }}
      </td>
    </tr>
  </table>
</template>

<style>
#distinctionTable {
  padding: 0.3em;
  width: 100%;
}
#distinctionTable th {
  font-weight: bold;
  border-bottom: 0.1em solid white;
}
#distinctionTable td {
  padding: 0.2em;
}
</style>
