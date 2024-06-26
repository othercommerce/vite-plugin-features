# Vite Plugin Features

This plugin generates a virtual module `$features` which provides a list of all
configured OtherCommerce features and their availability states.

Example usage:

```ts
import { Features } from '$features';

if (Features.affiliateProgram.isEnabled()) {
  // Do something only when certail feature is enabled...
}

if (Features.affiliateProgram.isDisabled()) {
  // Do something only when certail feature is disabled...
}
```

When you're using `@othercommerce/vite-storefront` plugin you can also use
global component property within Vue components templates:

```vue
<script setup>
  defineProps({
    points: { type: Number, required: false, default: 0 },
  });
</script>
<template>
  <div v-if="$features.loyaltyPoints.isEnabled() && points > 0">
    Available points: {{ points }}.
  </div>
</template>
```
