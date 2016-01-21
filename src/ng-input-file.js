'use strict';

angular
  .module('ngInputFile', [])
  .directive('input', function ($q, $parse) {

    function readAsType (type) {
      if (/^text\//.test(type)) {
        return 'text';
      }
      if (/^application\/json/.test(type)) {
        return 'json';
      }
      return 'binary';
    }

    function readFile (file) {
      var deferred = $q.defer();
      var reader = new FileReader();
      var type  = readAsType(file.type);

      function loadHandler (event) {
        var body = event.target.result;
        if (type === 'binary') {
          body = btoa(body);
        }
        if (type === 'json') {
          body = JSON.parse(body);
        }
        deferred.resolve({
          updatedAt: file.lastModifiedDate.toJSON(),
          size: file.size,
          type: file.type,
          name: file.name,
          body: body,
          $$file : file
        });
      }

      reader.onload = loadHandler;

      if (type === 'binary') {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsText(file);
      }

      return deferred.promise;
    }
    
    return {
      restrict: 'E',
      require: 'ngModel',
      link: function (scope, elem, attr, ngModel) {
        if (attr.type !== 'file') {
          return;
        }

        elem.bind('change', function (event) {
          var promises = [];
          angular.forEach(event.target.files, function (file) {
            promises.push(readFile(file));
          });
          $q.all(promises)
            .then(function (value) {
              $parse(attr.ngModel)
                .assign(scope, value);
            });
        });
      }
    };
  });