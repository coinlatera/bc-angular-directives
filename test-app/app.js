var app = angular.module('test-app', ['bc.angular-directives', 'bc.angular-notification', 'bc.angular-models']);

app.service('NotificationsStore', ['NotificationsBuilder', function(NotificationsBuilder) {
  this.getNotification = function(type, message, detailedMessage, displayMode, urgent, showInDropdown, params, duration) {
    NotificationBuilder.buildNotification(type, message, detailedMessage, displayMode, urgent, showInDropdown, params, duration);
  };
}]);

app.controller('MainCtrl', function MainCtrl ($scope, $filter, $timeout, $q) {
  ///////////////
  // BC-TABLE
  $scope.tableConfig = {
    tableClass: 'table-class',
    lineClick: function (line) {
      // alert(line.money);
    }
  }

  $scope.tableHeaderModel = [
    { label: 'Name', key: 'name', sortable: true },
    { label: function () { return 'Money'; }, key: 'money', sortable: true, format: function (value) { return $filter('currency')(value); } },
    { label: 'Button', key: 'button' },
    { label: 'Link', key: 'link' }
  ];

  $scope.tableModel = [
    {
      name: 'Homer',
      money: '1000',
      button: {
        type: 'button',
        title: 'Button',
        callback: function (line) {
          alert(line.money);
        }
      },
      link: {
        type: 'link',
        title: 'Link',
        callback: function (line) {
          alert(line.money);
        }
      }
    },
    {
      name: 'Luke',
      money: '5000',
      button: {
        type: 'button',
        title: 'Button',
        callback: function (line) {
          alert(line.money);
        }
      },
      link: {
        type: 'link',
        title: 'Link',
        callback: function (line) {
          alert(line.money);
        }
      }
    }
  ];

  ///////////////
  // BC-CHOSEN
  $scope.selected = '';
  $scope.items = [];
  $timeout(function () {
    $scope.items = ['01 - Banana', '02 - Apple', '03 - Orange'];
  });

  $scope.emptySelected = '';
  $scope.emptyItems = [];

  $scope.form = {
    text: '',
    select: ''
  };
  $scope.formItems = [
    {
      name: 'Item 1'
    },
    {
      name: 'Item 2'
    },
    {
      name: 'Item 3'
    }
  ];
  $scope.onFormSubmit = function() {
    alert('Cool! Submit!');
  
    var res = $q.defer();
    res.resolve({});
    return res.promise
  };
  $scope.onFormSuccess = function() {
    $scope.form.text = '';
    $scope.form.select = '';
  };
});
