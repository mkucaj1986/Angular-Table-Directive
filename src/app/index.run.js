(function() {
  'use strict';

  angular
    .module('pro')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
