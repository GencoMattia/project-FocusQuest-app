<script>
import { store } from '@/store';
import axios from 'axios';
export default {
    data() {
        return {
            store, 
            task: {}
        }
    },

    methods: {
        getTaskData($id){
            axios.get(`http://127.0.0.1:8000/api/${$id}}`)
            .then((response) =>{
                console.log('task recuperata con successo')
                this.task = response.data.task
            })
        }
    },

    mounted(){
        this.getTaskData()
    }
}
</script>

<template>

</template>

<style scoped></style>