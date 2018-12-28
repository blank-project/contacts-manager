<template>
    <div class="tag" :style="{ backgroundColor: tag.color, color: tag.textColor}">
        <span>{{ tag.name }}</span><span v-if="removable" class="tag-remove">x</span>
    </div>
</template>

<script>
  export default {
    data() {
        return {
            removable: false
        }
    },
    props : ['tag']
  }
</script>