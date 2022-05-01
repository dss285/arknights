<script setup lang="ts">
import {
  type Item,
  type Formula,
  Stage,
  type Matrix,
} from "@/components/models";
import { ref, type Ref } from "vue";
const arknights = {
  stages: async (): Promise<Stage[]> => {
    return await (
      await fetch("https://dss285.github.io/arknights/stages.json")
    ).json();
  },
  items: async (): Promise<Item[]> => {
    return await (
      await fetch("https://dss285.github.io/arknights/items.json")
    ).json();
  },
  formulas: async (): Promise<Formula[]> => {
    return await (
      await fetch("https://dss285.github.io/arknights/formulas.json")
    ).json();
  },
  penguinStats: async (): Promise<Matrix[]> => {
    return (
      await (
        await fetch(
          "https://penguin-stats.io/PenguinStats/api/v2/result/matrix?show_closed_zones=true&server=CN"
        )
      ).json()
    ).matrix;
  },
};

var penguinStats = await arknights.penguinStats();
var formulas = await arknights.formulas();
var items: Item[] = await arknights.items();
var stages = await arknights.stages();

var stages_where_there_are_data = stages.filter((stage) =>
  new Set(penguinStats.map((p) => p.stageId)).has(stage.id)
);
var items_where_there_are_data = items.filter((item) =>
  new Set(penguinStats.map((p) => p.itemId)).has(item.id)
);

var selectedItem: Ref<Item | undefined> = ref();
var selectedItemBestSanityCost: Ref<
  { value: number; stage: Stage; workshop: boolean } | undefined
> = ref();
var sortedItems: Ref<
  { objekti: Matrix; stage: Stage | undefined }[] | undefined
> = ref();
var bestSanityCost = (
  item: Item
): { value: number; stage: Stage; workshop: boolean } => {
  //TODO:FIX
  let drops = penguinStats.filter((e) => {
    item.id == e.itemId;
  });
  let formula = formulas.find((e) => {
    item.id == e.item_id;
  });
  let bestValue: {
    value: number;
    stage: Stage;
    workshop: boolean;
  } = {
    value: 0,
    stage: new Stage(),
    workshop: false,
  };
  let formula_sanity_cost = 0;
  if (formula != null) {
    let formula_items = formula.costs.split("");
    for (let x of formula_items) {
      let splitted = x.split("|");
      let item_object = items.find((t) => t.id == splitted[0]);
      let item_amount = parseInt(splitted[1]);
      if (item_object != null && item_object != undefined)
        formula_sanity_cost += bestSanityCost(item_object).value * item_amount;
    }
  }

  for (let x of drops) {
    let dropRate = x.times != 0 ? x.quantity / x.times : 0;
    if (dropRate != 0) {
      console.log(bestValue);
      let stage = stages.find((e) => e.id == x.stageId);
      console.log(stage);
      if (stage == null || stage == undefined) continue;
      if (bestValue.value == null) {
        bestValue.value = stage.sanity_cost / dropRate;
        bestValue.stage = stage;
      } else {
        if (bestValue.value > stage.sanity_cost / dropRate) {
          bestValue.value = stage.sanity_cost / dropRate;
          bestValue.stage = stage;
        }
      }
    }
  }

  if (bestValue.value > formula_sanity_cost && formula_sanity_cost > 0) {
    bestValue.value = formula_sanity_cost;
    bestValue.stage = new Stage();
    bestValue.workshop = true;
  }
  return bestValue;
};

function changeItem() {
  if (selectedItem.value != null && selectedItem.value != undefined) {
    try {
      selectedItemBestSanityCost.value = bestSanityCost(selectedItem.value);
      sortedItems.value = penguinStats
        .filter(
          (e) =>
            e.itemId == selectedItem.value?.id &&
            stages_where_there_are_data.find((i) => i.id == e.stageId) != null
        )
        .map((t) => {
          return { objekti: t, stage: stages.find((x) => x.id == t.stageId) };
        })
        .sort((a, b) => {
          if (a.stage != null && b.stage != null) {
            let dropRateA = a.objekti.quantity / a.objekti.times;
            let dropRateB = b.objekti.quantity / b.objekti.times;
            return (
              a.stage.sanity_cost / dropRateA - b.stage.sanity_cost / dropRateB
            );
          }
          return 0;
        });
    } catch (e) {
      console.log(e);
    }
  }
}
</script>

<template>
  <div class="stage"></div>
  <div class="item">
    <div class="item-target">
      <h2 v-if="selectedItem">
        {{ selectedItem.name }}
        <template v-if="selectedItemBestSanityCost != undefined">
          {{ selectedItemBestSanityCost?.value.toFixed(2) }}
          {{
            selectedItemBestSanityCost?.workshop
              ? "WORKSHOP"
              : selectedItemBestSanityCost?.stage.code
          }}
        </template>
      </h2>
      <select @change="changeItem" v-model="selectedItem" class="form-select">
        <option :value="undefined">Not selected</option>
        <option
          v-for="item in items_where_there_are_data"
          :value="item"
          :key="item.id"
        >
          {{ item.name }}
        </option>
      </select>
      <div v-if="selectedItem">
        <ul class="itemList">
          <li v-for="item in sortedItems" :key="item.stage?.id">
            {{ item.stage?.code }} {{ item.stage?.name }},
            {{ item.stage?.sanity_cost }} Sanity
            <p>
              {{
                ((item.objekti.quantity / item.objekti.times) * 100).toFixed(2)
              }}% Drop Rate
            </p>
            <p v-if="item.stage != undefined">
              {{
                (
                  item.stage.sanity_cost /
                  (item.objekti.quantity / item.objekti.times)
                ).toFixed(4)
              }}
              Sanity/Drop
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
ul.itemList {
  padding: 0;
  list-style: none;
  width: 100%;
  margin-top: 5px;
}
ul.itemList li {
  border: 1px solid white;
  padding: 5px;
  border-collapse: collapse;
  font-size: large;
  width: 100%;
}
</style>
