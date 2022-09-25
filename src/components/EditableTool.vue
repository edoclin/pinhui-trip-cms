<template>
    <div style="margin-top: -100px">
        {{editable}}
    </div>
</template>

<script setup>

const editable = defineProps(['editable'])

</script>
<script>
import {registerMixin} from "@vuemap/vue-amap";
import {defineComponent} from "vue";

export default defineComponent({
name: "EditableTool",
props: ["editable"],
mixins: [registerMixin],
methods: {
    __initComponent(){
    }
}
})
</script>