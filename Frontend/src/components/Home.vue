<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ content }}</h3>
    </header>
  </div>

  <!--
  Element Plus Components
  https://element-plus.org/en-US/component/overview.html
  -->


  <!--
  Vue Examples
  https://vuejs.org/examples/#hello-world
  -->

  <!--
  -->

  <footer>
    Vectors and icons by <a href="https://www.svgrepo.com" target="_blank">SVG Repo</a>
  </footer>
</template>

<script>
import UserService from "../services/user.service";
// import data from "../assets/d20pfsrd-beastiary.csv";


export default {
  name: "Home",
  data() {
    return {
      content: "",
    };
  },
  mounted() {
    UserService.getPublicContent().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );

    console.log('fetch csv');

    // console.log(data);

    this.$papa.parse('/assets/d20pfsrd-beastiary.csv', {
      download: true,
      complete: function(results) {
        console.log(results);
      }
    });


    // fetch("../assets/d20pfsrd-beastiary.csv")
    //   .then((res) => {
    //     console.log(res.body);
    //     this.$papa.parse(res.body, {
    //     // Papa.parse(res.body, {
    //     // // Papa.parse(fileInput.files[0], {
    //       complete: function(results) {
    //         console.log(results);
    //       }
    //     });
    //   })
    //   // res.text())
    //   // .then((text) => {
    //   //   console.log('hello?');
    //   //   console.log(text);
    //   //  })
    //   .catch((e) => console.error(e));


  },
};
</script>
