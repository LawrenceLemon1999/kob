<template>
  <NavBar />
  <router-view></router-view>
</template>

<script>
import NavBar from './components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap"
// import $ from 'jquery'

export default {
  components: {
    NavBar
  },
  setup() {
    // $.ajax({
    //   url: "http://localhost:3000/user/account/token/",
    //   type: "POST",
    //   data: {
    //     username: "acs",
    //     password: "123",
    //   },
    //   success(resp) {
    //     console.log(resp);
    //   },
    //   error(resp) {
    //     console.log(resp);
    //   }
    // });

    // $.ajax({
    //   url: "http://localhost:3000/user/account/info/",
    //   type: "GET",
    //   headers: {
    //     Authorization: "Bearer " +
    //       "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmZGE0NmY1ZjdiNjg0NDFhYWUyOTEyOTA2ZmQ2ZGM1ZSIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTY1OTExMzIwMywiZXhwIjoxNjYwMzIyODAzfQ.eSGGF2KT3I_AfzVu8MGzaRALmw07hENqEGdf_Ytg3ZI"
    //   },
    //   success(resp) {
    //     console.log(resp);
    //   },
    //   error(resp) {
    //     console.log(resp);
    //   }
    // });

    // $.ajax({
    //   url: "http://localhost:3000/user/account/register/",
    //   type: "POST",
    //   data: {
    //     username: "gui",
    //     password: "123",
    //     confirmedPassword: "123",
    //   },
    //   success(resp) {
    //     console.log(resp);
    //   },
    //   error(resp) {
    //     console.log(resp);
    //   }
    // });
  }
}

</script>

<style>
body {
  background-image: url("@/assets/images/background.png");
  background-size: cover;
}
</style>

