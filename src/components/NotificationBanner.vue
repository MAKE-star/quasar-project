<template>
  <q-banner v-if="message" :class="type === 'positive' ? 'bg-positive' : 'bg-negative'" class="text-white q-ma-md">
    {{ message }}
    <template v-slot:action>
      <q-btn flat color="white" label="Dismiss" @click="dismiss" />
    </template>
  </q-banner>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotificationBanner',
  props: {
    message: {
      type: String,
      default: '',
    },
    type: {
      type: String as () => 'positive' | 'negative',
      default: 'positive',
    },
  },
  setup(props, { emit }) {
    function dismiss() {
      emit('dismiss');
    }

    return { dismiss };
  },
});
</script>
