<template>
  <div class="two-column-list">
    <slot />
  </div>
</template>

<style>
.two-column-list > ol {
  --number-width: 3.5ch;
  --number-gap: 0.75ch;

  column-count: 2;
  column-gap: clamp(2.5rem, 9vw, 8rem);
  list-style: none;
  margin: 1.25rem 0;
  padding-left: 0;
}

.two-column-list > ol > li {
  break-inside: avoid;
  margin: 0 0 0.55rem;
  padding-left: calc(var(--number-width) + var(--number-gap));
  position: relative;
  line-height: 1.7;
}

.two-column-list > ol > li::before {
  content: counter(list-item) ".";
  position: absolute;
  left: 0;
  width: var(--number-width);
  text-align: left;
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .two-column-list > ol {
    column-count: 1;
  }
}
</style>
