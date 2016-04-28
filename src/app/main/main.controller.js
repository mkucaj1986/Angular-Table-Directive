(function() {
  'use strict';

  angular
    .module('pro')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, webDevTec, toastr) {
    var vm = this;

    vm.arr = ["5", "Eve", "Jackson", "94", "2", "John", "Doe", "80", "3", "Adam", "Johnson", "67", "4", "Jill", "Smith", "50"];
  }
})();
