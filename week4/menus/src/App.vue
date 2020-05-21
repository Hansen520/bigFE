<template>
  <div id="app">
    <ul>
      <li>
        <router-link to="/">menus</router-link>
      </li>
      <li>
        <router-link to="/order">order</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>

  export default {
    name: 'app',
    components: {
      
    },
    mounted(){
      // console.log(this.$store.list)
    },
    data () {
      return {
        
      }
    }
  }
</script>

<style>
  *{
    padding: 0;
    margin: 0;
  }
  a{
    text-decoration: none;
  }
  
</style>
