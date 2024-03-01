<script setup>
import { ref, computed, defineProps } from 'vue'
const props = defineProps(['listeModels', 'object', 'fields'])

const searchModel = ref('')
const selectedModel = ref('')

const searchModels = computed(() => {
  let objectLabel = ''
  props.fields.forEach(field => {
    objectLabel += props.object[field]
    });
  
  console.log('searchModel = '+searchModel.value)
  console.log('objectLabel = '+objectLabel)
  console.log('object = '+props.object['titre'])
  if (searchModel.value === '' || (searchModel.value != '' && searchModel.value === objectLabel)) {
    return []
  }

  let matches = 0

  return props.listeModels.filter(model => {
    let label = ''
    props.fields.forEach(field => {
      label += model[field]
    });
    if (
      label.toLowerCase().includes(searchModel.value.toLowerCase())
      && matches < 10
    ) {
      matches++
      model.label = label
      return model
    }
  })
});

const selectModel = (model) => {
  let label = ''
    props.fields.forEach(field => {
      console.log(model[field])
      label += model[field]
    });
  selectedModel.value = model
  searchModel.value = label
}
 
</script>


<template>
    <input class="form-control" type="text" id="model" v-model="searchModel">

    <ul v-if="searchModels.length" class="list-group" style="position: absolute; z-index: 999;">
        <li
          v-for="model in searchModels"
          @click="selectModel(model)"
          class="list-group-item"
        >
          {{ model.label }}
        </li>
      </ul>
</template>