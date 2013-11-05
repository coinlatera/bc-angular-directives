(function(){angular.module("bc.angular-directives",["bc.table"])}).call(this),function(){angular.module("bc.table",["start-at","filtered-by"]).directive("bcTable",function(){return{restrict:"E",replace:!0,scope:{tableConfig:"=",headerModel:"=",tableModel:"="},template:'<div><table ng-class="config.tableClass"><tr><th ng-repeat="header in headers" ng-style="{width: header.width}" ng-class="header.classNames" ng-click="headerClick(header, $index)">{{header.label}}<span ng-show="header.sortable"><span ng-switch on="currentSort.headerIndex - $index"><span ng-switch-when="0"><i ng-show="currentSort.reverse" class="icon icon-caret-up"></i><i ng-hide="currentSort.reverse" class="icon icon-caret-down"></i></span><span ng-switch-default><i class="icon icon-sort"></i></span></span></span></th></tr><tr ng-repeat="line in data | filteredBy:filter.filterKeys:filter.filterValue | orderBy:currentSort.sortingKey:currentSort.reverse | startAt:(currentPage - 1) * pageSize | limitTo:pageSize" ng-click="lineClick(line)" ng-class="{\'clickable-row\': config.lineClick}"><td ng-repeat="header in headers" ng-switch on="line[header.key].type" class="wide middle"><div ng-switch-when="button"><span class="btn" href="#" ng-click="line[header.key].callback(line)" ng-class="line[header.key].classNames" ng-bind-html-unsafe="line[header.key].title"></span></div><div ng-switch-default ng-bind-html-unsafe="header.format(line[header.key])"></div></td></tr></table><div class="right" ng-show="showPagination"><pagination total-items="(data | filteredBy:filter.filterKeys:filter.filterValue).length || 1" items-per-page="pageSize" page="currentPage"></pagination></div></div>',link:function(a){var b;return a.currentSort={headerIndex:-1,sortingKey:"",reverse:!1},a.$watch("tableConfig",function(){return b()},!0),a.$watch("headerModel",function(){return b()},!0),a.$watch("tableModel",function(){return b()},!0),b=function(){var b,c,d,e;for(a.headers=a.headerModel,a.data=a.tableModel,a.config=a.tableConfig,a.filter=exist(a.config.filter)?a.config.filter:{},exist(a.config.pagination)?(a.showPagination=!0,a.pageSize=a.config.pagination.pageSize,a.currentPage=a.config.pagination.currentPage):(a.showPagination=!1,a.pageSize=a.data.length,a.currentPage=1),e=a.headers,c=0,d=e.length;d>c;c++)b=e[c],exist(b.format)&&"function"===type(b.format)?(b.classNames="left",exist(b.sortable)&&(b.classNames+=" sortable-header"),exist(b.customClass)&&(b.classNames+=" "+b.customClass)):b.format=function(a){return a}},a.headerClick=function(b,c){return b.sortable?(a.currentSort.reverse=a.currentSort.headerIndex===c&&!a.currentSort.reverse,a.currentSort.headerIndex=c,a.currentSort.sortingKey=b.key):void 0},a.lineClick=function(b){return exist(a.config.lineClick)?a.config.lineClick(b):void 0}}}})}.call(this),function(){angular.module("filtered-by",[]).filter("filteredBy",function(){return function(a,b,c){var d,e,f,g,h,i,j;if(!exist(b)||0===b.length||!exist(c)||!type("string"===c)||""===c)return a;for(d=[],g=0,i=a.length;i>g;g++)for(f=a[g],h=0,j=b.length;j>h;h++)if(e=b[h],exist(f[e].indexOf)&&exist(f[e].toLowerCase())&&-1!==f[e].toLowerCase().indexOf(c.toLowerCase())){d.push(f);break}return d}})}.call(this),function(){angular.module("start-at",[]).filter("startAt",function(){return function(a,b){return exist(a)?a.slice(b,a.length):a}})}.call(this);