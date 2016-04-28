/*jslint browser: true*/
/* jshint strict: false */
/*global $, jQuery*/
(function() {
    'use strict';
    angular
        .module('pro')
        .directive('tableDirective', tableDirective);
    /** @ngInject */
    function tableDirective($compile, $filter) {
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
            var table, thead, tableHead, cells, template, compileScope, template, tableBody, cellsLength, newRow, rowCount;
            compileScope = scope;
            cells = angular.element($('td'));
            table = angular.element($('table'));
            thead = angular.element($('th'));
            rowCount = element.find($('tr')).length;
            newRow = '';
            cellsLength = table[0].rows[0].cells.length;
            scope.thRows = [];
            scope.tdRows = [];
            scope.newArr = [];
            angular.forEach(thead, function(item) {
                return scope.thRows.push(item.innerHTML);
            });
            angular.forEach(cells, function(item) {
                scope.tdRows.push(item.innerHTML);
            });
            while (scope.tdRows.length) {
                scope.newArr.push(scope.tdRows.splice(0, cellsLength));
            }
            // Add <td></td>  dependent  on cellsLength
            for (var i = 0; i < rowCount; i++) {
                newRow += '<tr class="tbodyRow" ><td ng-repeat="n in newArr[' + i + '] track by $index">{{n}}</td></tr>';
            }
            tableHead = '<thead><tr><th ng-click="sortData($index)" class="thclass" ng-repeat="th in thRows">{{th}}</th></tr></thead>';
            tableBody = '<tbody>' + newRow + '</tbody>';
            template = angular.element(tableHead + tableBody);
            $compile(template)(compileScope);
            element.replaceWith(template);
            scope.sortData = function($index) {
                scope.index = $index;
                scope.indexes = [];
                $filter('filter')(scope.newArr, function(item) {
                    return scope.indexes.push(item[$index]);
                });
                scope.newArr.toggled_sort = function() {
                    var self = this;
                    this.asc = !this.asc;
                    return this.sort(function(l, r) {
                        return l[$index] > r[$index] ? (self.asc ? 1 : -1) : l[$index] < r[$index] ? (self.asc ? -1 : 1) : 0;
                    });
                };
                scope.newArr.toggled_sort();
            };
        }

        function directiveTableCOntroler() {}
    }
})();