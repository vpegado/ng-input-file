'use strict';

angular
  .module('exampleApp', [
    'ngInputFile'
  ])
  .controller('ExampleCtrl', function ($scope) {

    $scope.displayType = function (type) {
      if (/^image\//.test(type)) {
        return 'image';
      }
      switch (type) {
        case 'application/pdf':
          return 'pdf';
        case 'text/html':
          return 'html';
        case 'application/json':
          return 'json';
        default:
          return 'other';
      }
    };

  });