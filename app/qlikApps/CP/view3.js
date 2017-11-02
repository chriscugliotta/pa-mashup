(function () {
    'use strict';
    
    // Register
    angular
        .module('paApp')
        .controller('view3', view3);
        
    // Inject
    view3.$inject = ['paQlikService', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function view3(paQlikService, paUtilityService) {
        
        // Public
        var self = this;
        self.x = 'XYZ';
        self.y = '789';
        
        // Log
        console.log('Constructed component view3!', paUtilityService.cw(), self);
    }

})();