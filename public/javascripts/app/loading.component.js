(function(){
    angular.module('loading', [])

    .component('loading', {
        templateUrl: '/templates/loading.html',
        controller: LoadingController
    });


    function LoadingController() {};

})();