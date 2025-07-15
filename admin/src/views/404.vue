<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">404</div>
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">请检查您输入的URL是否正确，或点击下方按钮返回首页</div>
        <router-link to="/" class="bullshit__return-home">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  computed: {
    message() {
      return '您访问的页面不存在...'
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http404-container{
  transform: translate(-50%,-50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.wscn-http404 {
  position: relative;
  width: 800px;
  padding: 0 50px;
  overflow: hidden;
  .pic-404 {
    position: relative;
    float: left;
    width: 400px;
    overflow: hidden;
    &__parent {
      width: 100%;
    }
  }
  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 30px 0;
    overflow: hidden;
    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      margin-bottom: 20px;
    }
    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      margin-bottom: 10px;
    }
    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      margin-bottom: 30px;
    }
    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      text-decoration: none;
    }
  }
}

@media screen and (max-width: 768px) {
  .wscn-http404 {
    width: 90%;
    .pic-404 {
      width: 100%;
      margin-bottom: 30px;
    }
    .bullshit {
      width: 100%;
      padding: 0;
    }
  }
}
</style>
