<script setup lang="ts">
import { useRouter } from 'vue-router';
import AuthService from '@/api/auth/auth.service';
import { useUserStore } from '@/stores/user.store';

const service = new AuthService();
const router = useRouter();
const userStore = useUserStore();

const login = () => {
  service.login({ username: 'test', password: 'test', withoutCaptcha: true }).then((res) => {
    userStore.setUser(res.data);
    router.push('/');
  });
}

const regist = () => {}
</script>

<template>
  <div class="wrapper">
    <canvas ref='canvas'></canvas>
    <div class="login-wrap">
      <div class="login-html">
        <input id="tab-1" type="radio" name="tab" class="sign-in" cursor-pointer checked><label for="tab-1" class="tab">Sign In</label>
        <input id="tab-2" type="radio" name="tab" class="sign-up" cursor-pointer><label for="tab-2" class="tab">Sign Up</label>
        <div class="login-form">
          <div class="sign-in-htm">
            <h1>Welcome</h1>
            <form class="form">
              <input type="text" placeholder="Username">
              <input type="password" placeholder="Password">
              <button type="button" @click="login()">Login</button>
            </form>
          </div>
          <div class="sign-up-htm">
            <form class="form">
              <input type="text" placeholder="Username">
              <input type="password" placeholder="Password">
              <input type="password" placeholder="Repeat Password">
              <input type="text" placeholder="Email Address">
              <button type="submit"  @click="regist()">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
h1{
  font-size: 40px;
  transition-duration: 1s;
  color: white;
  text-align: center;
}

a {
  color: inherit;
  text-decoration: none
}

.wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #50a3a2;
  //background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
  //background: -moz-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
  //background: -o-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
  //background: linear-gradient(to bottom right, #50a3a2 0%, #53e3a6 100%);
  //background-image: conic-gradient(#f0d9b5 25%, #b58863 0% 50%, #f0d9b5 50% 75%, #b58863 75%);
  //background-image: conic-gradient(#50a3a2 25%, #53e3a6 0% 50%, #50a3a2 50% 75%, #53e3a6 75%);
  //background-size: 300px 300px;
}


form{
  padding: 20px 0;
  position: relative;
  z-index: 2;

  input{
    display: block;
    appearance: none;
    outline: 0;
    border: 1px solid fade(white, 40%);
    background-color: fade(white, 20%);
    width: 250px;

    border-radius: 3px;
    padding: 10px 15px;
    margin: 0 auto 10px auto;
    text-align: center;
    font-size: 18px;

    color: white;

    transition-duration: 0.25s;
    font-weight: 300;

    &:hover{
      background-color: fade(white, 40%);
    }

    &:focus{
      background-color: white;
      width: 300px;

      color: #53e3a6;
    }
  }

  button{
    appearance: none;
    outline: 0;
    background-color: white;
    border: 0;
    padding: 10px 15px;
    color: #53e3a6;
    border-radius: 3px;
    display: block;
    margin: 0 auto;
    width: 250px;
    cursor: pointer;
    font-size: 18px;
    transition-duration: 0.25s;

    &:hover{
      background-color: rgb(245, 247, 249);
    }
  }
}

.login-wrap {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  max-width: 525px;
  min-height: 670px;
  position: relative;
  z-index: 10;
}

.login-html {
  width: 100%;
  height: 100%;
  position: absolute;
  .sign-in, .sign-up{
    display: none;
  }
  .tab {
    font-size: 22px;
    padding-bottom: 5px;
    margin: 0 15px 10px 0;
    display: inline-block;
    border-bottom: 2px solid transparent;
  }
  .sign-in:checked + .tab,.sign-up:checked + .tab {
    color: #fff;
    border-color: #1161ee;
  }
  .sign-in:checked + .tab + .sign-up + .tab + .login-form .sign-in-htm {
    transform: rotate(0);
  }
  .sign-up:checked + .tab + .login-form .sign-up-htm {
    transform: rotate(0);
  }
}

.login-html .sign-in-htm,
.login-html .sign-up-htm {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  transform: rotateY(180deg);
  backface-visibility: hidden;
  transition: all .4s linear;
}

.login-form {
  min-height: 345px;
  position: relative;
  perspective: 1000px;
  transform-style: preserve-3d;
}
</style>
