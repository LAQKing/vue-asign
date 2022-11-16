<template>
  <div>
    <div class="title">vue-asign</div>
    <div class="menu">
      <div class="item">
        旋转角度<select v-model="direction">
          <option>0</option>
          <option>90</option>
          <option>180</option>
          <option>270</option>
        </select>
      </div>
      <div class="item">
        画笔颜色<span class="colorBox" @click="showColor1=!showColor1" :style="{background:lineColor}"></span>
        <Chrome class="chrome" v-show="showColor1" v-model="colors" @click="setFontColor('line')" />
      </div>
      <div class="item">
        画笔粗细 <input v-model="lineWidth"/>
      </div>
      <div class="item">
        背景色<span class="colorBox" @click="showColor2=!showColor2" :style="{background:bgColor}"></span>
        <Chrome class="chrome" v-show="showColor2" v-model="colors" @click="setFontColor" />
      </div>
      <div class="item">
        是否裁剪 
        <select v-model="isCrop">
          <option>是</option>
          <option>否</option>
        </select>
      </div>
      <div class="item">
        图片左边距 <input v-model="gapLeft"/>
      </div>
      <div class="item">
        图片上边距 <input v-model="gapTop"/>
      </div>
      <div class="item">
        图片右边距 <input v-model="gapRight"/>
      </div>
      <div class="item">
        图片下边距 <input v-model="gapBottom"/>
      </div>
    </div>
    <vueAsign ref="ssign" :width="500" :height="300" :isCrop="isCrop=='是'?true:false" :direction="direction" :lineWidth="lineWidth" :lineColor="lineColor" :bgColor="bgColor" :gapLeft="gapLeft" :gapRight="gapRight" :gapTop="gapTop" :gapBottom="gapBottom" />
    <div class="btnBox">
      <button @click="repaint">重绘</button>
      <button @click="createImg">生成图片</button>
    </div>
    <img :src="resImg" alt="">
  </div>
</template>



<script>
import { Chrome } from '@ans1998/vue3-color'

export default {
  name: 'App',
  components:{Chrome},
  data(){
    return {
      resImg:'',
      lineWidth:1,
      lineColor:'#000',
      bgColor:'green',
      direction:0,
      isCrop:'是',
      colors:'',
      gapLeft: 5,
      gapRight: 5,
      gapTop:5,
      gapBottom:5,
      showColor1:false,
      showColor2:false,
    }
  },
  methods:{
    setFontColor(type){
      if(type=='line'){
        this.lineColor = this.colors.hex8
        this.showColor1 = false
      }else{
        this.bgColor = this.colors.hex8
        this.showColor2 = false
      }
    },
    repaint(){
      this.$refs.ssign.clearCanvas()
      this.resImg = ''
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
  color: #2c3e50;
  max-width: 500px;
  margin: 60px auto;
}
.title{
  font-size: 30px;
  margin-bottom: 30px;
}
.menu{
  display: flex;
  flex-wrap: wrap;
}
.item{
  margin: 10px;
  position: relative;
}
.chrome{
  position: absolute;
  z-index: 99;
}
.colorBox{
  display: inline-block;
  vertical-align: middle;
  width: 40px;
  height: 15px;
  border: 1px solid;
  margin-left: 5px;
}
.btnBox{
  margin: 20px 0;
  text-align: left;
}
input{
  width: 50px;
}
.btnBox button{
  border: none;
  background-color: #db7c08;
  margin-right: 15px;
  width: 80px;
  height: 40px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

img{
  max-width: 100%;
}
</style>
