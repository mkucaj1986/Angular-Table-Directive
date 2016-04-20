/*jslint browser: true*/
/* jshint strict: false */
/*global $, jQuery*/

(function() {
    'use strict';

    angular
        .module('pro')
        .directive('tableDirective', tableDirective);

    /** @ngInject */
    function tableDirective() {
        var directive = {
            link: link,
            bindToController: true,
            controller: directiveTableCOntroler,
            controllerAs: 'vm',
            scope: {},
            restrict: 'EA',
            templateUrl: 'app/components/table/table.html',
            transclude: true
        };
        return directive;
        /** @ngInject */
        function link(scope, element, attrs, vm) {

            scope.sortReverse = false;

            scope.sortData = function(orderField) {
                scope.sortReverse = !scope.sortReverse;
                scope.orderByField = orderField;
            };

            scope.addRow = function() {
                vm.companies.push({
                    'name': vm.name,
                    'employees': vm.employees,
                    'age': vm.age
                });
                vm.name = '';
                vm.employees = '';
                vm.age = '';
            };
        }

        function directiveTableCOntroler() {
            /*jshint validthis: true */
            var vm = this;
            vm.companies = [];
        }
    }

})();