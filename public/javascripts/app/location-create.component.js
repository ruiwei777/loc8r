(function () {
  angular.module('locations')
    .component('locationCreate', {
      templateUrl: '/templates/location-create.html',
      controller: ['$filter', '$state', 'create', LocationCreateController],
      controllerAs: 'createCtrl'
    });


  function LocationCreateController($filter, $state, create) {
    var ctrl = this;

    ctrl.$onInit = $onInit;

    ctrl.deleteFacility = deleteFacility;
    ctrl.deleteTime = deleteTime;
    ctrl.onSubmit = onSubmit;
    ctrl.onAddOpeningTime = onAddOpeningTime;
    ctrl.onFacilityChange = onFacilityChange;
    ctrl.onFacilityBlur = onFacilityBlur;

    function deleteTime(index){
      ctrl.openingTimes.splice(index, 1);
    }

    function deleteFacility(index) {
      ctrl.facilities.splice(index, 1);
    }

    function onSubmit() {
      var data = {
        name: ctrl.name,
        address: ctrl.address,
        facilities: ctrl.facilities,
        coords: [ctrl.lng, ctrl.lat],
        openingTimes: ctrl.openingTimes,
        rating: parseInt(ctrl.rating)
      };

      ctrl.loading = true;
      create(data)
        .then(res => {
          ctrl.loading = false;
          var toParams = {
            locationId: res.data._id,
            location: res.data
          };
          $state.go("locationDetail", toParams);
        })
        .catch(res => {
          ctrl.loading = false;
          alert(res);
        })
    }


    // when lose focus, push one facility to the array
    function onFacilityBlur() {
      var target = ctrl.facilityString.trim();
      if (target.length > 0 && !ctrl.facilities.includes(target)) {
        ctrl.facilities.push(target);
        ctrl.facilityString = "";
      }
    }

    // when hit space, push one facility to the array
    function onFacilityChange() {
      var target = ctrl.facilityString.trim();
      if (ctrl.facilityString.slice(-1) === " " && target.length > 0 && !ctrl.facilities.includes(target)) {
        ctrl.facilities.push(target);
        ctrl.facilityString = "";
      }
    }

    function onAddOpeningTime() {
      var data = ctrl.currTime;

      if (!data.fromDay ||
        !data.toDay ||
        !Date.parse(data.opening) ||
        !Date.parse(data.closing)) {
          alert("Invalid date format");
          return;
      }

      // `opening`
      var from = new Date(data.opening);
      from = $filter('date')(from, 'shortTime');
      data.opening = from;

      // `closing`
      var to = new Date(data.closing);
      to = $filter('date')(to, 'shortTime');
      data.closing = to;

      // `days`
      data.days = data.fromDay + " - " + data.toDay;
      delete data.fromDay;
      delete data.toDay;

      // TODO `closed`
      data.closed = false;

      ctrl.openingTimes.push(data);
      ctrl.currTime = {};
    }

    function $onInit() {
      ctrl.openingTimes = [];
      ctrl.facilities = [];
      ctrl.currTime = {};
      ctrl.currTime.fromDay = "Monday";
      ctrl.currTime.toDay = "Friday";
      ctrl.rating = "5";

      ctrl.loading = false;
    }
  }
})();