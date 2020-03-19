<template>
    <el-row>
        <el-col v-for="( i, key ) in dist" :key="key" :span="12">
            <Guard :Guard="i" />
        </el-col>
    </el-row>
</template>

<script>
import { getDailyGuardRecordsPointer, getDailyGuardRecords } from '../data/logs';
import Guard from '../components/items/Guard';

export default {
    name : 'GuardDisplayWindow',
    components : { Guard },
    data : () => ({
        dist : []
    }),
    methods : {
        get(){
            this.dist = getDailyGuardRecordsPointer();
        }
    },
    mounted(){
        this.get();
    }
}
</script>