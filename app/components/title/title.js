(function() {
    'use strict';
    
    // Define
    var paTitleComponent = {
        bindings: { data: '<' },
        controller: paTitle,
        controllerAs: 'self',
        templateUrl: 'app/components/title/title.html'
    };
    
    // Register
    angular
        .module('paApp')
        .component('paTitle', paTitleComponent);
    
    // Inject
    paTitle.$inject = ['$element', 'paQlikAppConfig', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function paTitle($element, paQlikAppConfig, paUtilityService) {
        /**
         * Header
         *
         * The title controller.  Contains view title and subtitle.
         *
         * VARIABLES:
         *
         *     title:
         *     The view title.  Displayed at top of page.
         *
         *     subTitle:
         *     The view subtitle.  Displayed at top of page.
         *
         *     $element:
         *     This controller's root DOM element.
         *
         *     paQlikAppConfig:
         *     Added as an instance variable, so it can be referenced in HTML expressions.
         */
        
        // Variables
        var self = this;
        self.title = self.data.title;
        self.subTitle = self.data.subTitle;
        self.$element = $element;
        self.paQlikAppConfig = paQlikAppConfig;
        
        // Log
        console.log('Constructed component paTitle!', paUtilityService.cw(), self);
    }

})();