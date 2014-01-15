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
    },
    filter: {
      filterValue: '',
      filterKeys: ['name']
    },
    radio: {
      filterValue: 'all',
      filterKeys: ['radio']
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
      radio: 'homer',
      money: '1000',
      button: {
        type: 'button',
        title: 'Homer Button',
        callback: function (line) {
          alert(line.money);
        }
      },
      link: {
        type: 'link',
        title: 'Homer Link',
        callback: function (line) {
          alert(line.money);
        }
      }
    },
    {
      name: 'Luke',
      radio: 'luke',
      money: '5000',
      button: {
        type: 'button',
        title: 'Luke Button',
        callback: function (line) {
          alert(line.money);
        }
      },
      link: {
        type: 'link',
        title: 'Luke Link',
        callback: function (line) {
          alert(line.money);
        }
      }
    },
    {
      name: 'Lucas',
      radio: 'luke',
      money: '10000',
      button: {
        type: 'button',
        title: 'Lucas Button',
        callback: function (line) {
          alert(line.money);
        }
      },
      link: {
        type: 'link',
        title: 'Lucas Link',
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
