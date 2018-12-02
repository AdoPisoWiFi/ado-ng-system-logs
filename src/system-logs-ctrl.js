(function () {
  'use strict';

  angular.module('ado.system-logs', [
    'ado.http-error',
    'toastr',
    'ado.system-logs.tpls'
  ])
    .component('adoSystemLogs', {
      bindings: {
        device: '<'
      },
      controller: 'AdoSystemLogsCtrl',
      templateUrl: './system-logs.html'
    })
    .provider('adoSystemLogs', function adoSystemLogs() {

      var provider = {};
      var globalConfig = {
        logs_url: '/system-logs'
      };

      provider.config = function (config) {
        angular.extend(globalConfig, config);
      };

      provider.$get = [
        function() {
          return globalConfig;
        }
      ];

      return provider;

    })
    .controller('AdoSystemLogsCtrl', [
      '$http',
      'httpError',
      'adoSystemLogs',
      'toastr',
      function ($http, httpError, adoSystemLogs, toastr) {

        var $ctrl = this;

        $ctrl.$onInit = function () {

          $ctrl.device = $ctrl.device || {id: 0};
          return $http.get(adoSystemLogs.logs_url + "?id=" + $ctrl.device.id)
            .then(function (res) {
              $ctrl.logs = res.data;
            })
            .catch(function(res) {
              var err = httpError(res);
              toastr.error(err);
            });
        };

      }]);

})();
