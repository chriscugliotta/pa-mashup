(function() {
    'use strict';
    
    // Define
    var paKpiContainerComponent = {
        bindings: { data: '<' },
        controller: paKpiContainer,
        controllerAs: 'self',
        templateUrl: 'app/components/kpiContainer/kpiContainer.html'
    };
    
    // Register
    angular
        .module('paApp')
        .component('paKpiContainer', paKpiContainerComponent);
    
    // Inject
    paKpiContainer.$inject = ['$element', 'paQlikService', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function paKpiContainer($element, paQlikService, paUtilityService) {
        /**
         * KpiContainer
         *
         * Description
         *
         * VARIABLES:
         *
         *     qObject:
         *     The Qlik object's representation in JavaScript.
         *
         *     title:
         *     The component's title text.  Appears below top-left number.
         *
         *     subTitle:
         *     The component's subtitle text.  Appears below progress bar.
         *
         *     measure1:
         *     A Qlik expression, returning a number (converted to a string).
         *     Determines the top-left number.
         *
         *     measure2:
         *     A Qlik expression, returning a number between 0 and 1.
         *     Determines the progress bar length, and bottom-right percentage.
         */
        
        // Variables
        var self = this;
        self.title = self.data.title;
        self.subTitle = self.data.subTitle;
        self.measure1 = self.data.measure1;
        self.measure2 = self.data.measure2;
        
        // Cached DOM elements
        self.$measure1 = $element.find('h1');
        self.$measure2 = $element.find('.pa-kpi-row-right h3');
        self.$progress = $element.find('.pa-kpi-progress-filled');
        
        // Methods
        self._initialize = _initialize;
        self.update = update;
        self.$onDestroy = $onDestroy;

        // Do initialization
        self._initialize();
        
        
        
        
        
        function _initialize() {
            /**
             * Initialization logic.
             */
            
            // Create Qlik 'generic object definition'
            var param = {
                measure1: {
                    qStringExpression: self.measure1
                },
                measure2: {
                    qValueExpression: self.measure2
                }
            }
            
            // Create Qlik 'generic object'
            // Register 'update' as callback to data change event
            // Manually call 'update' once, to initialize DOM
            paQlikService.app.createGenericObject(param, self.update).then(qObject => {
                self.qObject = qObject;
                self.update();
            });
        }
        
        function update() {
            /**
             * Called whenever the Qlik 'generic object' data changes.
             * This function will update our component's DOM.
             */
            if (self.qObject != undefined) {
                
                // Fix null
                var value = self.qObject.layout.measure2;
                if (isNaN(value)) { value = 0; }
                
                // Clamp value between [0, 1]
                var clamp = Math.max(0, Math.min(1, value));
                
                // Get displayed percentage
                var display = Math.round(value * 100) + '%';
                
                // Get CSS positioning percentage
                var position = Math.round((clamp - 1) * 100) + '%';
                
                // Update DOM
                self.$measure1.text(self.qObject.layout.measure1);
                self.$measure2.text(display);
                self.$progress.css('transform', 'translate3d(' + position + ', 0, 0)');
                
                // Log
                // console.log(value, clamp, display, position);
            }
        }
        
        function $onDestroy() {
            /**
             * This Angular component is automatically destroyed on tab switching.  However, the
             * underlying Qlik object is NOT automatically destroyed.  We must kill it manually.
             */
            paQlikService.app.destroySessionObject(self.qObject.id);
        }
        
        // Log
        console.log('Constructed component paKpiContainer!', paUtilityService.cw(), self);
    }

})();