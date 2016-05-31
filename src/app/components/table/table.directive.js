/*jslint browser: true*/
/* jshint strict: false */
/*global $, jQuery*/
(function() {
    'use strict';
    angular
        .module('pro')
        .directive('tableDirective', tableDirective)
        .directive('draggable', draggable)
        .directive('droppable', droppable);
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
            var table, thead, tableHead, cells, template, compileScope, tableBody, cellsLength, newRow, rowCount;
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
            if(thead.length === 0){
                for (var i = 0; i < cellsLength; i++) {
                    scope.thRows.push([i]);
                }
            }else{
                angular.forEach(thead, function(item) {
                    return scope.thRows.push(item.innerHTML);
                });
            }
            angular.forEach(cells, function(item) {
                scope.tdRows.push(item.innerHTML);
            });
            scope.tmpArray = [];
            for (var i = 0; i < scope.tdRows.length; i++) {
                if (!scope.tmpArray[i % cellsLength]) {
                    scope.tmpArray[i % cellsLength] = [];
                }
                scope.tmpArray[i % cellsLength].push(scope.tdRows[i]);
            }
            while (scope.tdRows.length) {
                scope.newArr.push(scope.tdRows.splice(0, cellsLength));
            }
            for (var i = 0; i < rowCount; i++) {
                newRow += '<tr class="tbodyRow" ><td ng-class=" { \'test\': $index === num} " ng-repeat="n in newArr[' + i + '] track by $index">{{n}}</td></tr>';
            }
            tableHead = '<thead><tr><th style="cursor:move" draggable drag="handleDrag"  dragData="{{th}}" dragImage="{{dragImageId}}" droppable drop="handleDrop" ng-class=" { \'test\': $index === num} " ng-click="sortData($index)" class="thclass" ng-repeat="th in thRows track by $index">{{th}}</th></tr></thead>';
            tableBody = '<tbody>' + newRow + '</tbody>';
            template = angular.element(tableHead + tableBody);
            $compile(template)(compileScope);
            element.replaceWith(template);
            // Sort data Types function
            scope.sortData = function($index) {
                scope.num = $index;
                scope.newArr.toggled_sort = function() {
                    var self = this;
                    self.asc = !self.asc;
                    return this.sort(function(l, r) {
                        var isnum = /^\d+$/.test(l[$index]);
                        var isCurency = /^(\$?\d{1,3}(,?\d{3})?(\.\d\d?)?|\(\$?\d{1,3}(,?\d{3})?(\.\d\d?)?\))$/.test(l[$index]);
                        var floatExtract = /(([1-9][0-9]*\.?[0-9]*)|(\.[0-9]+))([Ee][+-]?[0-9]+)?/.test(l[$index]);
                        var isDate = getDate(l[$index]);
                        if (isnum) {
                            return parseInt(l[$index]) > parseInt(r[$index]) ? (self.asc ? 1 : -1) : parseInt(l[$index]) < parseInt(r[$index]) ? (self.asc ? -1 : 1) : 0;
                        } else if (isCurency) {
                            return Number(l[$index].replace(/(^\$|,)/g, '')) > Number(r[$index].replace(/(^\$|,)/g, '')) ? (self.asc ? 1 : -1) : Number(l[$index].replace(/(^\$|,)/g, '')) < Number(r[$index].replace(/(^\$|,)/g, '')) ? (self.asc ? -1 : 1) : 0;
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
            // Default sort by first Column
            scope.sortData('0');
            // Drag && Drop
            scope.handleDrag = function(tmpArrayIndexDrag) {
                scope.tmpArrayIndexDrag = tmpArrayIndexDrag;
                return scope.tmpArrayIndexDrag;
                scope.$apply(function() {
                    scope.tmpArrayIndexDrag;
                });
            };
            scope.handleDrop = function(tmpArrayIndexDrop, tmpArrayIndexDrag) {
                var tmpArrayIndexDrag, swapArrayElement, srcInd, destInd;
                scope.handleDrag(tmpArrayIndexDrag);

                function swapArrayElements(array_object, index_a, index_b) {
                    var temp = array_object[index_a];
                    array_object[index_a] = array_object[index_b];
                    array_object[index_b] = temp;
                }
                srcInd = tmpArrayIndexDrag;
                destInd = tmpArrayIndexDrop;
                swapArrayElements(scope.thRows, srcInd, destInd);
                swapArrayElements(scope.tmpArray, srcInd, destInd);

                scope.newArr = scope.tmpArray[0].map(function(col, i) {
                    return scope.tmpArray.map(function(row) {
                        return row[i];
                    });
                });
            };
        }

        function directiveTableCOntroler() {}
    }

    function draggable() {
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;
        /** @ngInject */
        function link(scope, elem, attr, vm) {
            elem.attr("draggable", true);
            var dragDataVal = '';
            attr.$observe('dragdata', function(newVal) {
                dragDataVal = newVal;
            });
            elem.on('dragstart', function(e, $index) {
                var tmpArrayIndexDrag;
                angular.forEach(scope.thRows, function(item) {
                    if (item === e.currentTarget.textContent) {
                        tmpArrayIndexDrag = scope.thRows.indexOf(item);
                        return tmpArrayIndexDrag;
                    }
                });
                var dragFn = attr.drag;
                if (dragFn !== 'undefined') {
                    scope.$apply(function() {
                        scope[dragFn](tmpArrayIndexDrag);
                    });
                }
            });
        }
    }

    function droppable() {
        var directive = {
            link: link,
            restrict: 'EA'
        };
        return directive;
        /** @ngInject */
        function link(scope, elem, attr, vm) {
            var tmpArrayIndexDrop, tmpArrayIndexDrag;

            function onDragOver(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                return false;
            }

            function onDrop(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                tmpArrayIndexDrag = scope.$parent.tmpArrayIndexDrag;
                angular.forEach(scope.thRows, function(item) {
                    if (item === e.currentTarget.textContent) {
                        tmpArrayIndexDrop = scope.thRows.indexOf(item);
                        return tmpArrayIndexDrop;
                    }
                });
                var dropFn = attr.drop;
                if (dropFn !== 'undefined') {
                    scope.$apply(function() {
                        scope[dropFn](tmpArrayIndexDrop, tmpArrayIndexDrag);
                    });
                }
            }
            elem.bind("dragover", onDragOver);
            elem.bind("drop", onDrop);
        }
    }
})();