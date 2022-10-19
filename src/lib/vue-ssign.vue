<template>
  <canvas
    ref="vueSign"
    @mousedown="mousedown"
    @mousemove="mousemove"
    @mouseup="mouseup"
    @mouseleave="mouseup"
    @touchstart.stop="touchDown"
    @touchmove.stop="touchMove"
    @touchend.stop="touchUp"
    @touchcancel.stop="touchUp"
  />
</template>
<script>
export default {
  props: {
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 300
    },
    bgColor: {
      type: String,
      default: ''
    },
    lineWidth: {
      type: Number,
      default: 4
    },
    lineColor: {
      type: String,
      default: '#000000'
    },
    gapLeft: {
      type: Number,
      default: 5
    },
    gapRight: {
      type: Number,
      default: 5
    },
    gapTop: {
      type: Number,
      default: 5
    },
    gapBottom: {
      type: Number,
      default: 5
    },
    format: {
      type: String,
      default: ''
    },
    quality: {
      type: String,
      default: '0.92'
    },
    direction: {
      type: Number,
      default: 0
    },
    isCrop: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      sratio: 1,
      ctx: null,
      resImg: '',
      isMove: false, //控制线条是否画
      lastX: 0, //线条位置
      lastY: 0,
      offset: null
    }
  },
  computed: {
    fillbg() {
      return this.bgColor ? this.bgColor : 'rgba(255,255,255,0)'
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.initCanvas)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.initCanvas)
  },
  mounted() {
    this.initCanvas()
  },
  methods: {
    // 初始化
    initCanvas() {
      const vueSign = this.$refs.vueSign
      const ratio = this.height / this.width
      this.ctx = vueSign.getContext('2d',{willReadFrequently:true})
      this.offset = vueSign.getBoundingClientRect()
      vueSign.height = this.height
      vueSign.width = this.width
      vueSign.style.width = this.width>window.innerWidth?window.innerWidth+ 'px':this.width + 'px'
      const realw = parseFloat(window.getComputedStyle(vueSign).width)
      vueSign.style.height = ratio * realw + 'px'
      vueSign.style.background = this.fillbg
      this.ctx.scale(1 * this.sratio, 1 * this.sratio)
      this.sratio = realw / this.width
      this.ctx.scale(1 / this.sratio, 1 / this.sratio)
    },

    mousedown(e) {
      this.isMove = true
      this.drawLine(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false)
    },

    mousemove(e) {
      if (this.isMove) {
        this.drawLine(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true)
      }
    },

    mouseup(e) {
      this.isMove = false
    },

    touchDown(e) {
      this.isMove = true
      this.drawLine(
        e.changedTouches[0].clientX - this.offset.left,
        e.changedTouches[0].clientY - this.offset.top,
        false
      )
    },

    touchMove(e) {
      if (this.isMove) {
        this.drawLine(
          e.changedTouches[0].clientX - this.offset.left,
          e.changedTouches[0].clientY - this.offset.top,
          true
        )
      }
    },

    touchUp(e) {
      this.isMove = false
    },
    //画线
    drawLine(x, y, isT) {
      if (isT) {
        this.ctx.beginPath()
        this.ctx.lineWidth = this.lineWidth //设置线宽状态
        this.ctx.strokeStyle = this.lineColor //设置线的颜色状态
        this.ctx.lineCap = 'round'
        this.ctx.lineJoin = 'round'
        this.ctx.moveTo(this.lastX, this.lastY)
        this.ctx.lineTo(x, y)
        this.ctx.stroke()
        this.ctx.closePath()
      }
      // 每次移动都要更新坐标位置
      this.lastX = x
      this.lastY = y
    },
    //清空画图
    clearCanvas() {
      this.ctx.beginPath()
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.ctx.closePath() //可加入，可不加入
    },
    //线条粗细
    lineCrude() {
      linWidthVal = selWidth[activeIndex].value
    },
    //改变颜色
    setColor() {
      let activeIndex = selColor.selectedIndex
      colorVal = selColor[activeIndex].value
    },
    //保存图片
    createImg() {
      return new Promise((resolve)=>{
        const resImgData = this.ctx.getImageData(0, 0, this.$refs.vueSign.width, this.$refs.vueSign.height)
        const crop_area = this.getImgArea(resImgData.data)
        const crop_canvas = document.createElement('canvas')
        const crop_ctx = crop_canvas.getContext('2d')
        crop_canvas.width = crop_area[2] - crop_area[0]
        crop_canvas.height = crop_area[3] - crop_area[1]
        const crop_imgData = this.ctx.getImageData(...crop_area)
        crop_ctx.globalCompositeOperation = 'destination-over'
        crop_ctx.putImageData(crop_imgData, 0, 0)
        crop_ctx.fillStyle = this.fillbg
        crop_ctx.fillRect(0, 0, crop_canvas.width, crop_canvas.height)
        let imgType = 'image/'+this.format
        let resImg = crop_canvas.toDataURL(imgType, this.quality)
        if(!this.isCrop){
          const ssign = this.$refs.vueSign
          this.ctx.globalCompositeOperation = "destination-over"
          this.ctx.fillStyle = this.fillbg
          this.ctx.fillRect(0, 0, ssign.width, ssign.height)
          resImg = ssign.toDataURL(imgType, this.quality)
          this.ctx.clearRect(0, 0, ssign.width ,ssign.height)
          this.ctx.putImageData(resImgData, 0, 0)
          this.ctx.globalCompositeOperation = "source-over"
        }
        if(this.direction>0&&this.direction%90==0){
          this.rotateBase64Img(resImg,this.direction,imgType).then(res=>{
            resolve(res)
          })
        }else{
          resolve(resImg)
        }
      })
    },
    // 获取图片区域
    getImgArea(imgData) {
      const vueSign = this.$refs.vueSign
      let left = vueSign.width,
          top = vueSign.height,
          right = 0,
          bottom = 0
      for (let i = 0; i < vueSign.width; i++) {
        for (let j = 0; j < vueSign.height; j++) {
          let k = (i + vueSign.width * j) * 4
          if (imgData[k] > 0 || imgData[k + 1] > 0 || imgData[k + 2] || imgData[k + 3] > 0) {
            bottom = Math.max(j, bottom)
            right = Math.max(i, right)
            top = Math.min(j, top)
            left = Math.min(i, left)
          }
        }
      }
      left++
      right++
      top++
      bottom++
      const data = [
        left - this.gapLeft,
        top - this.gapTop,
        right + this.gapRight,
        bottom + this.gapBottom
      ]
      return data
    },
    // 将base64图片转个角度并生成新的base64
    rotateBase64Img(src, edg,imgType) {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        let imgW,imgH,size// canvas初始大小
        if (edg % 90 != 0) {
          console.error('旋转角度必须是90的倍数!')
        }
        const quadrant = (edg / 90) % 4 // 旋转象限
        const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 } // 裁剪坐标
        const image = new Image()
        image.crossOrigin = 'anonymous'
        image.src = src
        image.onload = function() {
          imgW = image.width
          imgH = image.height
          size = imgW > imgH ? imgW : imgH
          canvas.width = size * 2
          canvas.height = size * 2
          switch (quadrant) {
            case 0:
              cutCoor.sx = size
              cutCoor.sy = size
              cutCoor.ex = size + imgW
              cutCoor.ey = size + imgH
              break
            case 1:
              cutCoor.sx = size - imgH
              cutCoor.sy = size
              cutCoor.ex = size
              cutCoor.ey = size + imgW
              break
            case 2:
              cutCoor.sx = size - imgW
              cutCoor.sy = size - imgH
              cutCoor.ex = size
              cutCoor.ey = size
              break
            case 3:
              cutCoor.sx = size
              cutCoor.sy = size - imgW
              cutCoor.ex = size + imgH
              cutCoor.ey = size + imgW
              break
          }
          ctx.translate(size, size)
          ctx.rotate(edg * Math.PI / 180)
          ctx.drawImage(image, 0, 0)
          var imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey)
          if (quadrant % 2 == 0) {
            canvas.width = imgW
            canvas.height = imgH
          } else {
            canvas.width = imgH
            canvas.height = imgW
          }
          ctx.putImageData(imgData, 0, 0)
          // 获取旋转后的base64图片
          resolve(canvas.toDataURL(imgType,this.quality))
        }
    })
    }
  }
}
</script>
<style scoped>
canvas {
  max-width: 100%;
  display: block;
}
</style>
