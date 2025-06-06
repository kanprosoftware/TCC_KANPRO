<template>
    <router-view />
  </template>
  
  <script>
  export default {
    name: 'App'
  };
  </script>
  
  <style>
  /* Aqui você pode colocar estilos globais, se quiser */
  body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #1f1f1f;
    color: rgb(255, 255, 255);
    overflow: auto;
    /* overflow-y: auto; */
    /* overflow: hidden; */
  }
  .ql-snow .ql-tooltip {
    /* margin-left: 100px; */
    left: 0 !important;
    top: 40px !important;
    box-shadow: none !important;
  }

  .ql-toolbar.ql-snow .ql-stroke,
.ql-toolbar.ql-snow .ql-fill,
.ql-toolbar.ql-snow .ql-fill.ql-invert {
  stroke: rgb(211, 211, 211) !important;  
  color: rgb(211, 211, 211) !important;
  /* fill: white !important;     */
}
  </style>
  