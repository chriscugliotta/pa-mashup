(function() {
    'use strict';
    
    // Define
    var paVizContainerComponent = {
        bindings: { data: '<' },
        controller: paVizContainer,
        controllerAs: 'self',
        templateUrl: 'app/components/vizContainer/vizContainer.html'
    };
    
    // Register
    angular
        .module('paApp')
        .component('paVizContainer', paVizContainerComponent);
    
    // Inject
    paVizContainer.$inject = ['$element', 'paQlikAppConfig', 'paQlikService', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function paVizContainer($element, paQlikAppConfig, paQlikService, paUtilityService) {
        /**
         * VizContainer
         *
         * The visualization container controller.  This is a portlet that encapsulates a Qlik
         * visualization.
         *
         * VARIABLES:
         *
         *
         *     qObjectId:
         *     The Qlik object's unique ID.
         *
         *     qObject:
         *     The Qlik object's representation in JavaScript.
         *
         *     height:
         *     The container's overall height.
         *
         *     title (optional):
         *     The visualization's title text.
         *
         *     subTitle (optional):
         *     The visualization's subtitle text.
         *
         *     cycleGroup (optional):
         *     The cycle group, defined in paQlikAppConfig.
         *
         *     $element:
         *     This controller's root DOM element.
         */
        
        // Variables
        var self = this;
        self.qObjectId = self.data.qObjectId;
        self.qObject = undefined;
        self.title = self.data.title;
        self.subTitle = self.data.subTitle;
        self.height = self.data.height;
        self.cycleGroup = undefined;
        
        // Cached DOM elements
        self.$element = $element;
        self.$vizContainer = self.$element.find('.pa-viz-container');
        self.$vizHeader = self.$element.find('.pa-viz-header');
        self.$vizBody = self.$element.find('.pa-viz-body');
        self.$vizObject = self.$element.find('.qvobject');
        self.$expandIcon = self.$element.find('.fa-expand');
        
        // Methods
        self._initialize = _initialize;
        self._setHeight = _setHeight;
        self.toggleFullscreen = toggleFullscreen;
        self.pickDimension = pickDimension;
        self.download = download;
        
        // Do initialization
        self._initialize();
        
        
        
        
        
        function _initialize() {
            /**
             * Initialization logic.
             */
            
            // If a cycle group name was provided, get the cycle group data
            if(self.data.cycleGroup != undefined) {
                self.cycleGroup = paUtilityService.getFieldGroup(self.data.cycleGroup);
            }
            
            // Embed Qlik object in <div>.  Then, store reference to Qlik object.
            paQlikService.embedObject(self.$vizObject, self.qObjectId).then(qObject => {
                self.qObject = qObject;
            });
            
            // Initialize height.  We're waiting 1 tick, because we want this to happen AFTER
            // AngularJS compiles the HTML expressions.  There must be a better way...
            setTimeout(() => {
                self._setHeight(self.height);
            }, 500);
            
            // Window resize can cause the header height to grow, e.g. 1 long line gets squished
            // into 2 short lines, and thus Qlik height needs to be recalculated.
            $(window).resize(() => {
                self._setHeight(self.height);
            });
        }
        
        function _setHeight(height) {
            /**
             * Wrapper for setting the element's height property.
             *
             * Note:
             *     Qlik requires the 'qvobject' element height to be explicitly stated in pixels,
             *     not percentages.  We are using a flexbox to scale the container in fullscreen
             *     mode, so this pixel height is dynamic and unknown until run time.  Thus, we have
             *     to manually specify and sync the 'qvobject' height with our container.
             */
            
            // First, we temporarily remove the qvobject's hardcoded height.  This is important!
            // If we don't do this, the qvobject will push out the vizBody's height when flexbox is
            // recalculated.
            self.$vizObject.height('auto');
            
            // Next, set the vizContainer height equal to our desired height
            self.$vizContainer.outerHeight(height);
            
            // Next, sync qvobject height with vizBody
            self.$vizObject.height(self.$vizBody.height());
            
            // Lastly, ask Qlik to resize all objects
            paQlikService.resize();           
        }
        
        function toggleFullscreen() {
            /**
             * Toggles fullscreen mode.
             */
            if (!self.$vizContainer.hasClass('pa-viz-fullscreen')) {
                // 
                // CASE 1 OF 2:  NOT EXPANDED
                //
                self.$vizContainer.toggleClass('pa-viz-fullscreen');
                self.$expandIcon.toggleClass('fa-expand');
                self.$expandIcon.toggleClass('fa-compress');
                self._setHeight('100%');
            } else {
                // 
                // CASE 2 OF 2:  YES EXPANDED
                //
                self.$vizContainer.toggleClass('pa-viz-fullscreen');
                self.$expandIcon.toggleClass('fa-expand');
                self.$expandIcon.toggleClass('fa-compress');
                self._setHeight(self.height);
            }
        }
        
        function pickDimension($event) {
            /**
             * Picks a dimension from the cycle group dropdown.
             */
            
            // Get index of clicked field
            var fieldIndex = $event.target.getAttribute('field-index');
            
            // If clicked element didn't have a fieldIndex attribute, stop here
            if (fieldIndex == undefined) { return; }
            
            // Determine field name and label from index
            var fieldName = self.cycleGroup[fieldIndex].name;
            var fieldLabel = self.cycleGroup[fieldIndex].label;
            
            // Change dimension
            paQlikService.setDimension(self.qObject, fieldName, fieldLabel);
            
            // Change sub-title
            self.subTitle = 'by ' + fieldLabel;
        }
        
        function download(format) {
            /**
             * Downloads the visualization.
             */
            paQlikService.download(self.$element, format);
        }
        
        // Log
        console.log('Constructed component paVizContainer!', paUtilityService.cw(), self);
    }

})();