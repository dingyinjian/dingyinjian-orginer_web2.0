<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 0.9rem;
    width: 100%;
    height: 100%;
  }

  .tooltip-inner {
    max-width: 500px !important;
    background-color: #e9eef3 !important;
    color: #666 !important;
    text-align: left !important;
  }

  .table th,
  .table td {
    padding: 0px;
    vertical-align: sub !important;
  }

  .card-body.p-0 .table tbody>tr>td:first-of-type,
  .card-body.p-0 .table tbody>tr>th:first-of-type,
  .card-body.p-0 .table thead>tr>td:first-of-type,
  .card-body.p-0 .table thead>tr>th:first-of-type {
    padding-left: .6rem !important;
  }

  .table-bordered th,
  .table-bordered td {
    white-space: nowrap;
  }
  .placeStyle .style-chooser .vs__search::placeholder {
    border-width: 0px;
  }
  .v-select {
    height: 38px;
  }

  .vs--searchable .vs__dropdown-toggle {
    height: 38px;
  }

  .style-chooser .vs__search::placeholder,
  .style-chooser .vs__dropdown-toggle,
  .style-chooser .vs__dropdown-menu {
    background: #ffffff;
    border: 1px solid #ced4da;
    text-transform: lowercase;
    font-variant: small-caps;
  }

</style>