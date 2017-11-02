// Temporary hack
var _cw;

(function() {
    'use strict';
    
    // Register
    angular
        .module('paApp')
        .service('paUtilityService', paUtilityService);
        
    // Inject
    paUtilityService.$inject = ['paQlikAppConfig'];
    
    
    
    
    
    // Construct
    function paUtilityService(paQlikAppConfig) {
        /**
         * UtilityService
         *
         * Helps with miscellaneous tasks.
         */
        
        // Methods
        var self = this;
        self.tryToNumber = tryToNumber;
        self.getFieldGroup = getFieldGroup;
        self.cw = cw;
        _cw = cw;
        
        
        
        
        
        function tryToNumber(array) {
            /**
             * Converts an array of strings to numbers (when possible).
             * For example, we will convert ['A', '123', 'B12'] to ['A', 123, 'B12'].
             */
            
            // Loop
            for (var i = 0; i < array.length; i++) {
                
                // Get current element (which is a string)
                var s = array[i];
                
                // Try cast as number
                var n = Number(s);
                
                // If valid, use number value instead of string
                if (!isNaN(n)) { array[i] = n; }
                
            }

            // Return
            return array;
        }
        
        function getFieldGroup(fieldGroupName) {
            /**
             * In the Qlik app config JSON, field groups are stored as lists of strings, like this:
             *
             * [
             *     'Member ID',
             *     'HIC',
             *     'Contract Number'
             * ]
             *
             * This is nice, because it's compact and easy to write/edit.  However, the application
             * often needs access to a list of fields OBJECTS (not STRINGS), like this:
             * 
             * [
             *     {
             *         name: 'Member ID',
             *         label: 'Member',
             *         sort: 'number ascending'
             *     },
             *     {
             *         name: 'HIC',
             *         label: 'HIC',
             *         sort: 'text ascending'
             *     },
             *     {
             *         name: 'Contract Number',
             *         label: 'Contract Nbr'
             *         sort: 'text ascending'
             *     }
             * ]
             *
             * This function will perform the desired conversion.
             */
            
            // Initialize result
            var result = [];
            
            // Loop over field names
            paQlikAppConfig.fieldGroups[fieldGroupName].forEach(fieldName => {
                
                // Get field object
                var field = paQlikAppConfig.fields.find(x => { return x.name == fieldName; })
                
                // Add to list
                result.push(field);
                
            });
            
            // Return
            return result;
        }
        
        function cw() {
            /**
             * Counts the total number of watchers on a page.
             * See this:  https://stackoverflow.com/questions/18499909/how-to-count-total-number-of-watches-on-a-page
             */
            
            var root = angular.element(document.getElementsByTagName('body'));

            var watchers = [];

            var f = function (element) {
                angular.forEach(['$scope', '$isolateScope'], function (scopeProperty) { 
                    if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
                        angular.forEach(element.data()[scopeProperty].$$watchers, function (watcher) {
                            watchers.push(watcher);
                        });
                    }
                });

                angular.forEach(element.children(), function (childElement) {
                    f(angular.element(childElement));
                });
            };

            f(root);

            var watchersWithoutDuplicates = [];
            angular.forEach(watchers, function(item) {
                if(watchersWithoutDuplicates.indexOf(item) < 0) {
                     watchersWithoutDuplicates.push(item);
                }
            });

            return watchersWithoutDuplicates.length;
        }
        
        // Log
        console.log('Constructed paUtilityService!', cw(), self);
    }

})();