(function(){
  angular.module("statusPage", [])
  .component("notFound", {
    templateUrl: "404.html",
    controller: [NotFoundController],
    controllerAs: "notFoundCtrl"
  })



  function NotFoundController(){
    
  }
})();