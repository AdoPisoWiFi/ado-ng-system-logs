angular.module('ado.system-logs.tpls', []).run(['$templateCache', function($templateCache) {$templateCache.put('./system-logs.html','\n<div ng-if="$ctrl.logs.length === 0">\n  <strong>\n    No logs to show.\n  </strong>\n</div>\n\n\n<p>\n<button type="button" class="btn btn-danger" ng-click="$ctrl.clear()" ng-show="$ctrl.logs.length > 0">Clear Logs</button>\n</p>\n\n<table class="table table-bordered" ng-show="$ctrl.logs.length > 0">\n  <thead>\n    <tr>\n      <th>Type</th>\n      <th>Message</th>\n      <th>Date</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="log in $ctrl.logs">\n      <td>{{log.type}}</td>\n      <td>{{log.message}}</td>\n      <td>{{log.date | date:\'medium\'}}</td>\n    </tr>\n  </tbody>\n</table>\n\n\n\n');}]);
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
    .provider('adoSystemLogsConfig', function adoSystemLogsConfig() {

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
      'adoSystemLogsConfig',
      'toastr',
      function ($http, httpError, adoSystemLogsConfig, toastr) {

        var $ctrl = this;

        $ctrl.$onInit = function () {

          $ctrl.device = $ctrl.device || {id: 0};
          return $http.get(adoSystemLogsConfig.logs_url + "?id=" + $ctrl.device.id)
            .then(function (res) {
              $ctrl.logs = res.data;
            })
            .catch(function(res) {
              var err = httpError(res);
              toastr.error(err);
            });
        };

        $ctrl.clear = function () {

          if (!window.confirm("Are you sure?")) return;

          $http.delete(adoSystemLogsConfig.logs_url + "?id=" + $ctrl.device.id)
            .then(function (res) {
              $ctrl.logs = [];
              toastr.success("System logs cleared successfully");
            })
            .catch(function (res) {
              var err = httpError(res);
              toastr.error(err);
            });
        };

      }]);

})();
