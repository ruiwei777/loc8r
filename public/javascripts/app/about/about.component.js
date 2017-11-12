(function(){


    angular.module('about', [])

    .component('about', {
        templateUrl: 'about.html',
        controller: [AboutController],
        controllerAs: 'aboutCtrl'
    });

    function AboutController() {

    } 
})();