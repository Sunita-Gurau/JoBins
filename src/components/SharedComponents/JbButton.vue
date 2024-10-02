<template>
  <button
    class="rounded-lg transition duration-300"
    :class="[
      props.buttonBorder ? 'rounded-lg' : '',
      props.block ? 'w-full' : '',
      props.size ? 'btn-' + props.size : '',
      props.variant ? 'btn-' + props.variant : '',
      props.size === 'sm' ? 'text-xs' : 'text-sm',
      props.disabled ? 'cursor-not-allowed btn-disable' : '',
    ]"
    :disabled="props.disabled"
  >
    <slot>Submit</slot>
  </button>
</template>

<script setup lang="ts">
/**
 *
 * ## Props
 * - `disabled` (Boolean, default: `false`): Set to `true` to disable the button.
 * - `block` (Boolean, default: `false`): Set to `true` to make the button expand to the full width of its container.
 * - `variant` (String, default: `"primary"`): The variant style of the button. Possible values include `"primary"`, `"secondary"`, `"tertiary"`, etc.
 * - `size` (String, default: `"md"`): The size of the button. Possible values include `"sm"`, `"md"`, `"lg"`, `"xl"`, `"2xl"`, etc.
 */

type JbButtonProps = {
  disabled?: boolean;
  buttonBorder?: boolean;
  block?: boolean;
  variant?: string;
  size?: string;
};

const props = withDefaults(defineProps<JbButtonProps>(), {
  disabled: false,
  buttonBorder: false,
  block: false,
  variant: 'primary',
  size: 'md',
});
</script>

<style scoped>
.btn-primary {
  background-color: #0f60ff;
  color: #fff;
}
.btn-primary:hover {
  background-color: #0759fc;
}
.btn-secondary {
  background-color: #fff;
  color: #424142;
  border: 1px solid #eeeeee;
}
/* .btn-secondary:hover {
  background-color: #eeeeee;
} */

.btn-gray {
  background-color: #f8f8f8;
  border: 1px solid #eeeeee;
}

.btn-gray:hover {
  background-color: #eeeeee;
}

.btn-tertiary {
  background-color: #af9687;
  color: #fff;
}
.btn-tertiary:hover {
  background-color: #a88c7c;
}

.btn-disable {
  background-color: #f8f8f8;
  color: #424142;
  border: 1px solid #eeeeee;
}
.btn-disable:hover {
  background-color: #f8f8f8;
}
.btn-sm {
  padding: 4px 10px;
}
.btn-md {
  padding: 4px 10px;
}
.btn-lg {
  padding: 6px 12px;
}
.btn-xl {
  padding: 8px 14px;
}
.btn-2xl {
  padding: 10px 16px;
}
</style>
