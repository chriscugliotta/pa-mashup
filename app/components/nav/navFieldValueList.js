(function() {
    'use strict';
    
    // Define
    var paNavFieldValueListComponent = {
        bindings: {
            navBase: '<',
            field: '<'
        },
        controller: paNavFieldValueList,
        controllerAs: 'self',
        templateUrl: 'app/components/nav/navFieldValueList.html'
    };
    
    // Register
    angular
        .module('paApp')
        .component('paNavFieldValueList', paNavFieldValueListComponent);
    
    // Inject
    paNavFieldValueList.$inject = ['$element', 'paQlikService', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function paNavFieldValueList($element, paQlikService, paUtilityService) {
        /**
         * NavFieldValueList
         *
         * The fieldValueList navigation controller.  This is where users can make selections on a
         * specific field.
         *
         * VARIABLES:
         *
         *     navBase:
         *     The base navigation controller.
         *
         *     field:
         *     The Qlik field displayed in this nav menu.
         *
         *     $listBox:
         *     The element containing the Qlik list box.
         */
        
        // Variables
        var self = this;
        self.navBase = self.navBase;
        self.field = self.field;
        self.$listBox = $element.find('.pa-listbox');
        
        // Methods
        self._initialize = _initialize;
        self.getListBox = getListBox;
        
        // Do initialization
        self._initialize();
        
        
        
        
        
        function _initialize() {
            /**
             * Initialization logic.
             */

            // Add self to base
            self.navBase.navChild = self;
            
            // Initialize shared list box
            var root = self.navBase.navRoot;
            if (root.qlbRequested == false) {
                root.qlbRequested = true;
                paQlikService.createListBox(self.field.name, self.field.label).then(qViz => {
                    root.qlbViz = qViz;
                    root.qlbViz.show(self.$listBox);
                    paQlikService.app.getObject(qViz.id).then(qObject => {

                        // For some reason, qv-object-wrapper doesn't exist immediately...
                        setTimeout(() => {
                            root.qlbObject = qObject;
                            root.qlbElement = self.$listBox.find('.qv-object-wrapper');
                        }, 500)

                    });
                });
            }
        }
        
        function getListBox() {
            /**
             * As a performance optimization, all navFieldValueLists share a single Qlik list box
             * object.  We create an illusion, so it seems like each menu has its own list box.
             * Whenever a menu is opened, we move the shared list box into the recently-opened
             * menu, and change its dimension accordingly.
             */
            
            // Move shared list box into my own DOM tree
            self.navBase.navRoot.qlbElement.appendTo(self.$listBox);
            
            // Change list box dimension
            paQlikService.setDimension(self.navBase.navRoot.qlbObject, self.field.name, self.field.label);
        }
        
        // Log
        console.log('Constructed component paNavFieldValueList!', paUtilityService.cw(), self);
    }

})();