(function() {
    'use strict';
    
    // Define
    var paNavRootComponent = {
        bindings: {
            navBase: '<'
        },
        controller: paNavRoot,
        controllerAs: 'self',
        templateUrl: 'app/components/nav/navRoot.html'
    };
    
    // Register
    angular
        .module('paApp')
        .component('paNavRoot', paNavRootComponent);
    
    // Inject
    paNavRoot.$inject = ['$element', 'paQlikAppConfig', 'paQlikService', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function paNavRoot($element, paQlikAppConfig, paQlikService, paUtilityService) {
        /**
         * NavRoot
         *
         * The root navigation controller.  This is the entry point to the navigation system.
         *
         * VARIABLES:
         *
         *     navBase:
         *     The base navigation controller.
         *
         *     navActive:
         *     The currently visible nav menu.
         *
         *     qlbViz:
         *     A Qlik list box object.  As a performance optimization, a single list box is shared
         *     and re-used across all fields.
         *
         *     qlbObject:
         *     An alternate representation of the above.  Weird Qlik API stuff.
         *
         *     qlbElement:
         *     The list box's root DOM element, created by Qlik.
         *
         *     qlbRequested:
         *     Equals true if we have asked the Qlik engine to create a list box object.
         *
         *     paQlikAppConfig:
         *     The Qlik app config file.  Contains various parameters that influence how the
         *     navigation menus are dynamically populated, e.g. view list, field list, etc.
         *
         *     paQlikService:
         *     Added as an instance variable, so it can be referenced in HTML expressions.
         */
        
        // Variables
        var self = this;
        self.navBase = self.navBase;
        self.navActive = self;
        self.qlbViz = undefined;
        self.qlbObject = undefined;
        self.qlbElement = undefined;
        self.qlbRequested = false;
        self.paQlikAppConfig = paQlikAppConfig;
        self.paQlikService = paQlikService;
        
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
            
            // We will apply special treatment to the root's base nav
            // We will say the root's parent is itself
            // This simplifies some nav hierarchy code in other areas
            self.navBase.navParent = self;
            self.navBase.navRoot = self;
        }

        // Log
        console.log('Constructed component paNavRoot!', paUtilityService.cw(), self);
    }

})();