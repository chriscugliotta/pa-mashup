(function() {
    'use strict';
    
    // Define
    var paNavFieldListComponent = {
        bindings: {
            navBase: '<'
        },
        controller: paNavFieldList,
        controllerAs: 'self',
        templateUrl: 'app/components/nav/navFieldList.html'
    };
    
    // Register
    angular
        .module('paApp')
        .component('paNavFieldList', paNavFieldListComponent);
    
    // Inject
    paNavFieldList.$inject = ['$element', 'paQlikService', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function paNavFieldList($element, paQlikService, paUtilityService) {
        /**
         * NavFieldList
         *
         * The fieldList navigation controller.  This is where users can pick a field they wish to
         * make selections on.
         *
         * VARIABLES:
         *
         *     navBase:
         *     The base navigation controller.
         *
         *     fields:
         *     A list of Qlik fields to display in this nav menu.
         */
        
        // Variables
        var self = this;
        self.navBase = self.navBase;
        self.fields = paUtilityService.getFieldGroup('nav');
        
        // Methods
        self._initialize = _initialize;
        
        // Do initialization
        self._initialize();
        
        
        
        
        
        function _initialize() {
            /**
             * Initialization logic.
             */
            
            // Add self to base
            self.navBase.navChild = self;
        }
        
        // Log
        console.log('Constructed component paNavFieldList!', paUtilityService.cw(), self);
    }

})();