var app = angular.module('test-app', ['bc.angular-directives']);

app.controller('MainCtrl', function MainCtrl ($scope, $filter) {

  $scope.tableConfig = {
    tableClass: 'table-class',
    lineClick: function (line) {
      alert(line.money);
    }
  }

  $scope.tableHeaderModel = [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Money', key: 'money', sortable: true, format: function (value) { return $filter('currency')(value); } }
  ];

  $scope.tableModel = [
    {
      name: 'Homer',
      money: '1000'
    },
    {
      name: 'Luke',
      money: '5000'
    }
  ];

});