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
    $scope.showSimulation = function (simulation) {
      $scope.simulation = angular.extend({}, simulation);
      $scope.uncheckAllSims();
      simulation.isChecked = true;
      $scope.updateChartData(simulation.data);
    };

    $scope.plotSelected = function () {
      var selectedSimData = [];
      angular.forEach($scope.simulations, function (sim) {
        if (sim.isChecked) {
          selectedSimData.push(sim.data[0]);
        }
      });
      $scope.updateChartData(selectedSimData);
    };

    $scope.doSimulation = function () {
      var cashPosition = [];
      var nbrOfCustomersLastMonth = 0;
      var cummulativeRevenueLastMonth = 0;
      $scope.simulation.name = $scope.simulations.length;
      $scope.simulation.isChecked = true;
      $scope.uncheckAllSims();

      for (var i = 0; i < 72; i++) {
        var churnedCustomers = Math.round(0.01 * $scope.simulation.monthlyChurn * nbrOfCustomersLastMonth);
        var nbrOfCustomersThisMonth = nbrOfCustomersLastMonth + $scope.simulation.numberOfNewCustomers - churnedCustomers;
        //var costOfAcquisition = $scope.simulation.leadsPerMonth * $scope.simulation.leadCost + $scope.simulation.numberOfNewCustomers * $scope.simulation.costOfSale;
        var revenueOfTheMonth = nbrOfCustomersThisMonth * $scope.simulation.monthlyFee - $scope.simulation.salesCost;
        nbrOfCustomersLastMonth = nbrOfCustomersThisMonth;
        cummulativeRevenueLastMonth += revenueOfTheMonth;
        cashPosition.push({
          x: i,
          y: cummulativeRevenueLastMonth
        });
      }
      $scope.simulation.data = [{
        values: cashPosition,
        key: $scope.simulation.name
      }];
      $scope.simulation.CAC = $scope.simulation.salesCost / $scope.simulation.numberOfNewCustomers;
      $scope.simulation.LTV = $scope.simulation.monthlyFee / (0.01 * $scope.simulation.monthlyChurn);
      $scope.simulations.push(angular.extend({}, $scope.simulation));
      $scope.updateChartData($scope.simulation.data);
    };

    $scope.uncheckAllSims = function () {
      angular.forEach($scope.simulations, function (sim) {
        sim.isChecked = false;
      });
    };

    $scope.updateChartData = function (data) {
      $scope.chartData = data;
    };

  });