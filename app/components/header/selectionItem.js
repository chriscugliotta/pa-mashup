(function() {
    'use strict';
    
    // Define
    var paSelectionItemComponent = {
        bindings: { data: '<' },
        controller: paSelectionItem,
        controllerAs: 'self',
        templateUrl: 'app/components/header/selectionItem.html'
    };
    
    // Register
    angular
        .module('paApp')
        .component('paSelectionItem', paSelectionItemComponent);
    
    // Inject
    paSelectionItem.$inject = ['$element', 'paQlikService', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function paSelectionItem($element, paQlikService, paUtilityService) {
        
        // Variables
        var self = this;
        self.$element = $element;
        self.sel = self.data.sel;
        self.fieldName = self.data.fieldName;
        self.fieldValues = self.data.fieldValues;
        self.paQlikService = paQlikService;
        
        // Methods
        self._initialize = _initialize;
        
        // Do initialization
        self._initialize();
        
        
        
        
        
        function _initialize() {
            /**
             * Initialization logic.
             */

            // If value list is too long, abbreviate
            if (self.fieldValues.length > 20) {
                self.fieldValues = self.sel.selectedCount + ' of ' + self.sel.totalCount;
            }
        }
        
        // Log
        // console.log('Constructed component paSelectionItem!', paUtilityService.cw(), self);
    }

})();