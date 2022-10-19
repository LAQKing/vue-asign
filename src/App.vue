<template>
  <div>
    <vueSsign ref="ssign" :width="500" :height="300" :lineWidth="1" :lineColor="'red'" :bgColor="'green'" />
    <div style="text-align: center">
      <button @click="repaint">重绘</button>
      <button @click="createImg">生成图片</button>
    </div>
    <img :src="resImg" alt="">
  </div>
</template>



<script>

export default {
  name: 'App',
  data(){
    return {
      resImg:''
    }
  },
  methods:{
    repaint(){
      this.$refs.ssign.clearCanvas()
    },
    createImg(){
      this.$refs.ssign.createImg().then(res=>{
        this.resImg = res
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img{
  max-width: 100%;
}
</style>
