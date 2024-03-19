<script lang="ts">
  import { handle, doc } from '$lib/stores/handle'


  $: count = $doc?.counter?.value || 0

  const increment = () => {
    $handle.change((d) => {
			if (!d.counter) return
			
      d.counter.increment(1)
    })
  }
</script>

<button on:click={increment}>
  count is {count}
</button>
