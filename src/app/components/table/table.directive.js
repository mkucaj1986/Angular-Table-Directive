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

            var table, thead, tableHead, cells, template, compileScope, template, tableBody, cellsLength, newRow, rowCount;

            compileScope = scope;
            cells = angular.element($('td'));
            table = angular.element($('table'));
            thead = angular.element($('th'));
            console.log(thead);
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
            for (var i = 0; i < rowCount; i++) {
                newRow += '<tr class="tbodyRow" ><td ng-repeat="n in newArr[' + i + '] track by $index">{{n}}</td></tr>';
            }
            tableHead = '<thead><tr><th ng-click="sortData($index)" class="thclass" ng-repeat="th in thRows track by $index">{{th}}</th></tr></thead>';
            tableBody = '<tbody>' + newRow + '</tbody>';
            template = angular.element(tableHead + tableBody);
            $compile(template)(compileScope);
            element.replaceWith(template);
            // Sort data Types function
            scope.sortData = function($index) {
                scope.index = $index;
               
                scope.newArr.toggled_sort = function() {
                    var self = this;
                    this.asc = !this.asc;
                    return this.sort(function(l, r) {
                        var isnum = /^\d+$/.test(l[$index]);
                        var floatExtract = /(([1-9][0-9]*\.?[0-9]*)|(\.[0-9]+))([Ee][+-]?[0-9]+)?/.test(l[$index]);
                        var isDate = getDate(l[$index]);
                        if (isnum) {
                            return parseInt(l[$index]) > parseInt(r[$index]) ? (self.asc ? 1 : -1) : parseInt(l[$index]) < parseInt(r[$index]) ? (self.asc ? -1 : 1) : 0;
                        } else if (isDate) {
                            return new Date(l[$index]) > new Date(r[$index]) ? (self.asc ? 1 : -1) : new Date(l[$index]) < new Date(r[$index]) ? (self.asc ? -1 : 1) : 0;
                        } else if (floatExtract && !isDate) {
                            return parseFloat(l[$index]) > parseFloat(r[$index]) ? (self.asc ? 1 : -1) : parseFloat(l[$index]) < parseFloat(r[$index]) ? (self.asc ? -1 : 1) : 0;
                        } else {
                            return l[$index] > r[$index] ? (self.asc ? 1 : -1) : l[$index] < r[$index] ? (self.asc ? -1 : 1) : 0;
                        }
                    });
                };
                scope.newArr.toggled_sort();

                function getDate(string) {
                    if (typeof string !== 'string') {
                        return false;
                    }
                    // Match format: 1/1/2015
                    var regex1 = /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4}/;
                    if (regex1.test(string)) {
                        return true;
                    }
                    // Match format: Wed Sep 09 2015 23:11:46 GMT+0100 (WEST)
                    var regex2 = /^[MTWFS]{1}(?:on|ue|ed|ur|ri|at|un)\s[JFMASOND](?:an|eb|ar|pr|ay|un|ul|ug|ep|ct|ov|ec)\s[0-9]{2}\s[0-9]{4}\s[0-9]{2}:[0-9]{2}:[0-9]{2}\s[A-Z]{3}\+[0-9]{4}\s\([A-Z]{3,}\)/;
                    if (regex2.test(string)) {
                        return true;
                    }
                    // Match format: Friday, 1, 2015 06:00 AM
                    var regex3 = /^(?:Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day,\s(?:[1-9]{1}|1[0-9]{0,1}|2[0-9]{0,1}|3[01]{1}),\s[0-9]{4}\s[0-9]{2}:[0-9]{2}\s(?:AM|PM)/;
                    if (regex3.test(string)) {
                        return true;
                    }
                    // Match format: Jan 18, 2001 09:12 AM
                    var regex4 = /^[JFMASOND](?:an|eb|ar|pr|ay|un|ul|ug|ep|ct|ov|ec)\s(([0]?[1-9])|([1-2][0-9])|(3[01])),\s[0-9]{4}\s(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;
                    if (regex4.test(string)) {
                        return true;
                    }
                    return false;
                }
            };
        }

        function directiveTableCOntroler() {}
    }
})();