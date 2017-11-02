(function () {
    'use strict';
    
    // Register
    angular
        .module('paApp')
        .controller('view2', view2);
        
    // Inject
    view2.$inject = ['paQlikService', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function view2(paQlikService, paUtilityService) {
        
        // Public
        var self = this;
        initialize();

        function initialize() {
            
            // Embed QV objects into divs
            paQlikService.embedObject('QV10', 'EWRFPDQ');
        }
        
        // Log
        console.log('Constructed component view2!', paUtilityService.cw(), self);
    }

})();