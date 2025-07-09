<template>
    <router-view />
  </template>
  
  <script>
  export default {
    name: 'App'
  };
  </script>
  
  <style>
  body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #1f1f1f;
    color: rgb(255, 255, 255);
    overflow: auto;
  }
  .ql-snow .ql-tooltip {
    left: 0 !important;
    top: 40px !important;
    box-shadow: none !important;
  }

  .ql-toolbar.ql-snow .ql-stroke,
.ql-toolbar.ql-snow .ql-fill,
.ql-toolbar.ql-snow .ql-fill.ql-invert {
  stroke: rgb(211, 211, 211) !important;  
  color: rgb(211, 211, 211) !important;
}
  </style>
  