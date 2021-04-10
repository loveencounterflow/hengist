
<!-- <script lang=coffeescript> -->
<!-- <script lang=coffeescript>
count = 0
  wrong indentation
increment = -> count++

#-----------------------------------------------------------------------------------------------------------
</script> -->

<script>
var count, increment;

count = 120;

increment = function() {
  return count++;
};

//-----------------------------------------------------------------------------------------------------------

</script>

<button on:click={increment}>
  Clicks: {count}
</button>

<style lang=scss>

//----------------------------------------------------------------------------------------------------------
$button-inactive-bgcolor: #00ff07;
$button-active-bgcolor:   rgba(255, 62, 0, 0.2);

//----------------------------------------------------------------------------------------------------------
button {
  font-family: inherit;
  font-size: inherit;
  padding: 1em 2em;
  color: #ff3e00;
  background-color:       $button-inactive-bgcolor;
  border-radius: 2em;
  border: 2px solid rgba(255, 62, 0, 0);
  outline: none;
  width: 200px;
  font-variant-numeric: tabular-nums; }

button:focus {
  border: 2px solid #ff3e00; }

button:active {
  background-color: $button-active-bgcolor; }

</style>
