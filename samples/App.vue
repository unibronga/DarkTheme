<template>
    <!-- Шаблон Vue -->
    <div id="app" :class="{ dark: isDark }">
        <h1 v-if="user">Привет, {{ user.name }}!</h1>
        <p v-else>Загрузка…</p>

        <ul>
            <li v-for="(item, index) in items" :key="item.id" @click="select(item)">
                {{ index + 1 }}. {{ item.title.toUpperCase() }}
            </li>
        </ul>

        <BaseButton type="submit" :disabled="!items.length" @click.prevent="save">
            Сохранить
        </BaseButton>
        <input v-model.trim="query" placeholder="Поиск" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BaseButton from './BaseButton.vue';

interface Item {
    id: number;
    title: string;
}

const props = defineProps<{ initial?: Item[] }>();
const emit = defineEmits<{ (e: 'save', items: Item[]): void }>();

const user = ref<{ name: string } | null>(null);
const items = ref<Item[]>(props.initial ?? []);
const query = ref('');
const isDark = computed(() => query.value.length > 3);

function select(item: Item) {
    console.log('selected', item.id);
}

const save = () => emit('save', items.value);

onMounted(async () => {
    user.value = { name: 'Unibronga' };
});
</script>

<style scoped lang="scss">
$accent: #ff7010;

#app {
    padding: 16px;

    &.dark h1 {
        color: $accent;
    }
}
</style>
