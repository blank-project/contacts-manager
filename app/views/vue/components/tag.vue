<template>
    <div class="tag" :style="{ backgroundColor: tag.color, color: tag.textColor}">
        <span>{{ tag.name }}</span><span v-if="removable" @click="$emit('remove', tag._id)" class="tag-remove clickable"><i class="material-icons">clear</i></span>
    </div>
</template>

<script>
  export default {
    props : {
        "tag" : Object,
        "removable" : {
            type: Boolean,
            default: false
        }
    }
  }
</script>
