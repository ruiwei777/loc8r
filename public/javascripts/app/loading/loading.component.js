(function(){
    angular.module('loading', [])

    .component('loading', {
        templateUrl: 'loading.html',
        controller: LoadingController
    });


    function LoadingController() {};

})();