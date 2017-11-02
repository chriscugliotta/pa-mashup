(function() {
    'use strict';
    
    // Define
    var paHeaderComponent = {
        bindings: { data: '<' },
        controller: paHeader,
        controllerAs: 'self',
        templateUrl: 'app/components/header/header.html'
    };
    
    // Register
    angular
        .module('paApp')
        .component('paHeader', paHeaderComponent);
    
    // Inject
    paHeader.$inject = ['$element', 'paQlikService', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function paHeader($element, paQlikService, paUtilityService) {
        /**
         * Header
         *
         * The header controller.  Contains logo and current selections.
         *
         * VARIABLES:
         *
         *     $element:
         *     This controller's root DOM element.
         */
        
        // Variables
        var self = this;
        self.$element = $element;
        self.paQlikService = paQlikService;
        
        // Methods
        self._initialize = _initialize;
        
        // Do initialization
        self._initialize();
        
        
        
        
        
        function _initialize() {
            /**
             * Initialization logic.
             */

            /* To test Qlik search API
            setTimeout(() => {
                var qTerms = ['Cancer'];
                var qPage = { qOffset: 0, qCount: 1000 };
                var qOptions = {};
                paQlikService.app.searchResults(qTerms, qPage, qOptions).then(reply => { 
                    console.log('*** SEARCH REPLY', reply);
                });
            }, 2000) */

            // To embed Qlik selections bar
            // paQlikService.app.getObject(self.$element, 'CurrentSelections');
        }
        
        // Log
        console.log('Constructed component paHeader!', paUtilityService.cw(), self);
    }

})();