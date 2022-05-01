<script setup lang="ts">
import ArknightsDistinctionTable from "@/components/ArknightsDistinctionTable.vue";
import ArknightsDrops from "@/components/ArknightsDrops.vue";
</script>
<style>
.header {
  text-align: center;
}
.sectionAK {
  padding: 1%;
  border: 1px solid white;
  text-align: center;
}
</style>

<template>
  <main>
    <h1 class="header">Arknights</h1>
    <div class="container-fluid">
      <div class="row">
        <div class="sectionAK col-md-6">
          <ArknightsDistinctionTable></ArknightsDistinctionTable>
        </div>
        <div class="sectionAK col-md-6">
          <Suspense>
            <ArknightsDrops></ArknightsDrops>
          </Suspense>
        </div>
      </div>
    </div>
  </main>
</template>
