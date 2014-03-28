'use strict';

angular.module('saasFinancialPlannerApp')
  .controller('MainCtrl', function ($scope) {
    $scope.chartData = [];
    $scope.simulation = {};
    $scope.simulations = [];


    $scope.xFunction = function () {
      return function (d) {
        return d.x;
      };
    };

    $scope.yFunction = function () {
      return function (d) {
        return d.y;
      };
    };

    $scope.yAxisTickFormatFunction = function () {
      return function (d) {
        return d3.format('f')(d);
      };
    };

    $scope.color = function () {
      return function (d) {
        return (d.y >= 0) ? 'green' : 'red';
      };
    };
    $scope.applySimulation = function (simulation) {
      $scope.simulation = angular.extend({}, simulation);
      $scope.updateChartData(simulation);
    };

    $scope.doSimulation = function () {
      var cashPosition = [];
      var nbrOfCustomersLastMonth = $scope.simulation.customersMonth0;
      var cummulativeRevenueLastMonth = $scope.simulation.capital;

      for (var i = 0; i < 72; i++) {
        var newCustomers = Math.round(0.01 * $scope.simulation.leadsPerMonth * $scope.simulation.conversionRate);
        var churnedCustomers = Math.round(0.01 * $scope.simulation.monthlyChurn * nbrOfCustomersLastMonth);
        var nbrOfCustomersThisMonth = nbrOfCustomersLastMonth + newCustomers - churnedCustomers;
        var costOfAcquisition = $scope.simulation.leadsPerMonth * $scope.simulation.leadCost + newCustomers * $scope.simulation.costOfSale;
        var personellCost = $scope.simulation.productStaff * 15000;
        var serviceCost = $scope.simulation.serviceCostPerCustomerPerMonth * nbrOfCustomersThisMonth;
        var revenueOfTheMonth = nbrOfCustomersThisMonth * $scope.simulation.monthlyFee - costOfAcquisition - personellCost - serviceCost;
        nbrOfCustomersLastMonth = nbrOfCustomersThisMonth;
        cummulativeRevenueLastMonth += revenueOfTheMonth;
        cashPosition.push({
          x: i,
          y: cummulativeRevenueLastMonth
        });
      }
      $scope.simulation.data = [{
        values: cashPosition,
        key: 'Cash'
      }];
      $scope.simulations.push(angular.extend({}, $scope.simulation));
      $scope.updateChartData($scope.simulation);
    };

    $scope.updateChartData = function (simulation) {
      $scope.chartData = simulation.data;
    };

  });