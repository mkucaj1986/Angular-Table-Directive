/*jslint browser: true*/
/* jshint strict: false */
/*global $, jQuery*/

(function() {
    'use strict';

    angular
        .module('pro')
        .directive('tableDirective', tableDirective);

    /** @ngInject */
    function tableDirective($compile) {
        var directive = {
            link: link,
            bindToController: true,
            controller: directiveTableCOntroler,
            controllerAs: 'vm',
            scope: {},
            restrict: 'EA'
        };
        return directive;
        /** @ngInject */
        function link(scope, element, attrs, vm) {
            console.log(scope);
            console.log(element);
            console.log(attrs);

            var table, thead, tableHead, cells, template, compileScope, template, tableBody, cellsLength, newRow;

            compileScope = scope;
            cells = angular.element($('td'));
            table = angular.element($('table'));
            thead = angular.element($('th'));
            newRow = '';
            cellsLength = table[0].rows[0].cells.length;
            scope.thRows = [];

            angular.forEach(thead, function(item) {
                return scope.thRows.push(item.innerHTML);
            });

            for (var i = 0; i < cellsLength; i++) {
                newRow += '<td></td>';
            }
            tableHead = '<thead><tr><th class="thclass" ng-repeat="th in thRows">{{th}}</th></tr></thead>';
            tableBody = '<tbody><tr class="tbodyRow">' + newRow + '</tr></tbody>';

            template = angular.element(tableHead + tableBody);
            console.log(template);
            $compile(template)(compileScope);
            element.html(template);
        }

        function directiveTableCOntroler() {


        }
    }

})();