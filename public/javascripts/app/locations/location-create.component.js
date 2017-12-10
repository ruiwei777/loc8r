(function () {
  angular.module('locations')
    .component('locationCreate', {
      templateUrl: 'location-create.html',
      controller: ['$filter', '$state','$timeout', 'locationService', LocationCreateController],
      controllerAs: 'createCtrl'
    });


  function LocationCreateController($filter, $state, $timeout, locationService) {
    var ctrl = this;

    ctrl.$onInit = $onInit;

    ctrl.deleteFacility = deleteFacility;
    ctrl.deleteTime = deleteTime;
    ctrl.onSubmit = onSubmit;
    ctrl.onAddOpeningTime = onAddOpeningTime;
    ctrl.onFacilityChange = onFacilityChange;
    ctrl.onFacilityBlur = onFacilityBlur;
    ctrl.resetForm = resetForm;

    function deleteTime(index) {
      ctrl.openingTimes.splice(index, 1);
    }

    function deleteFacility(index) {
      ctrl.facilities.splice(index, 1);
    }

    function onSubmit() {
      // this should never be triggered, because the UI has done validation.
      if (ctrl.locationForm.$invalid || !ctrl.facilities.length || !ctrl.openingTimes.length) {
        alert("Data validation failed. Something wrong happened.")
        console.log(ctrl.locationForm.$error)
        return;
      }

      // normal submit process begins here
      var data = {
        name: ctrl.name,
        address: ctrl.address,
        facilities: ctrl.facilities,
        openingTimes: ctrl.openingTimes
      };

      ctrl.loading = true;
      locationService.create(data)
        .then(function (res) {
          ctrl.loading = false;
          var toParams = {
            locationId: res.data._id,
            location: res.data
          };
          $state.go("locationDetail", toParams);
        })
        .catch(function (res) {
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
        !data.opening ||
        !data.closing) {
        alert("Invalid date format");
        return;
      }

      // `days`
      data.days = data.fromDay + " - " + data.toDay;
      delete data.fromDay;
      delete data.toDay;

      // TODO `closed`
      data.closed = false;

      ctrl.openingTimes.push(data);
      ctrl.currTime = {};
      ctrl.timeForm.$setDirty();
    }

    function resetForm(form){
      if(form.$name === "createCtrl.locationForm" && window.confirm("Are you sure to reset the form?")){
        ctrl.name = undefined;
        ctrl.address = undefined;
        ctrl.facilities = [];
        ctrl.facilityString = undefined;
        ctrl.openingTimes = [];
      }
    }

    function $onInit() {
      ctrl.openingTimes = [];
      ctrl.facilities = [];
      ctrl.facilityString = "";
      ctrl.currTime = {};
      ctrl.currTime.fromDay = "Monday";
      ctrl.currTime.toDay = "Friday";

      ctrl.loading = false;

      $timeout(function(){
        $("#timepickerFrom").timepicker();
        $("#timepickerTo").timepicker();

        ctrl.timeForm.$setPristine();
        ctrl.timeForm.$setUntouched();
      })
    }
  }
})();