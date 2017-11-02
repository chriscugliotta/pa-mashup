(function() {
    'use strict';
    
    // Define
    var paNavBaseComponent = {
        bindings: {
            componentType: '<',
            componentData: '<',
            navParent: '<',
            navRoot: '<',
            linkText: '<'
        },
        controller: paNavBase,
        controllerAs: 'self',
        templateUrl: 'app/components/nav/navBase.html'
    };
    
    // Register
    angular
        .module('paApp')
        .component('paNavBase', paNavBaseComponent);
    
    // Inject
    paNavBase.$inject = ['$element', 'paQlikService', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function paNavBase($element, paQlikService, paUtilityService) {
        /**
         * NavBase
         *
         * The base navigation controller.  More specific navigation controllers will inherit this
         * base functionality.
         *
         * VARIABLES:
         *
         *     componentType:
         *     The child component's type.
         *
         *     componentData:
         *     The child component's data input.
         *
         *     navChild:
         *     The child component's controller.  By design, there will always be exactly 1 child.
         *
         *     navParent:
         *     The parent component's controller.
         *
         *     navRoot:
         *     The root component's controller.
         *
         *     linkText:
         *     The link text in the parent menu.
         *
         *     $element:
         *     This controller's root DOM element.
         *
         *     $menu:
         *     The slide-in menu element.
         */
        
        // Variables
        var self = this;
        self.componentType = self.componentType;
        self.componentData = self.componentData;
        self.navChild = undefined;
        self.navParent = self.navParent;
        self.navRoot = self.navRoot;
        self.linkText = self.linkText;
        self.$element = $element;
        self.$menu = $element.find('.pa-nav-menu').first();
        
        // Methods
        self.toggleMenu = toggleMenu;
        
        
        
        
        
        function toggleMenu() {
            /**
             * Opens or closes the menu.
             * Also, we keep track of which menu is 'active', i.e. open and on top.
             */
            
            // If we're about to open a fieldValueList menu, first update its DOM
            if (self.componentType == 'fieldValueList' && !self.$menu.hasClass('pa-nav-open')) {
                self.navChild.getListBox();
            }
            
            // Toggle 'open' class
            self.$menu.toggleClass('pa-nav-open');
            
            // What menu is currently visible?
            // If we just opened this menu, then it is currently visible.
            // If we just closed this menu, then its parent is currently visible.
            if (self.$menu.hasClass('pa-nav-open')) {
                self.navRoot.navActive = self;
            }
            else {
                self.navRoot.navActive = self.navParent.navBase;
            }
            
            // Log
            // console.log('navActive', self.navRoot.navActive);
        }
        
        // Log
        console.log('Constructed component paNavBase!', paUtilityService.cw(), self);
    }

})();