(function() {
    'use strict';

    // Register
    angular
        .module('paApp')
        .service('paQlikService', paQlikService);
    
    // Inject
    paQlikService.$inject = ['$timeout', 'qlik', 'paQlikAppConfig', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function paQlikService($timeout, qlik, paQlikAppConfig, paUtilityService) {
        /**
         * QlikService
         *
         * Manages all interactions with Qlik engine.
         *
         * VARIABLES:
         *
         *     qlik:
         *     The Qlik Sense 'Root API' object.
         *
         *     app:
         *     The Qlik Sense 'App API' object.  Represents a single QVF file.
         *
         *     selectionState:
         *     The Qlik Sense 'Selection API' object.  Represents the user's current selections in
         *     an app.
         *
         *     listenerRegistry:
         *     A list of callbacks that will be called whenever the Qlik data model changes, e.g.
         *     a selection occurs.
         */

        // Variables
        var self = this;
        self.qlik = qlik;
        self.app = qlik.openApp(paQlikAppConfig.app, config); // TODO:  Remove global 'config' variable?
        self.selectionState = self.app.selectionState();
        self.listenerRegistry = [];
        
        // Methods
        self._initialize = _initialize;
        self.listen = listen;
        self.addListener = addListener;
        self.removeListener = removeListener;
        self.embedObject = embedObject;
        self.resize = resize;
        self.select = select;
        self.clear = clear;
        self.back = back;
        self.forward = forward;
        self.getFieldData = getFieldData;
        self._getFieldDataLoop = _getFieldDataLoop;
        self.setDimension = setDimension;
        self.createListBox = createListBox;
        self.download = download;
        
        // Do initialization
        self._initialize();
        
        
        
        
        
        function _initialize() {
            /**
             * Initialization logic.
             */
            
            // Subscribe to Qlik 'OnData' event
            self.selectionState.OnData.bind(self.listen);
        }
        
        function listen() {
            /**
             * This is the ONLY function directly binded to the Qlik 'OnData' event.  So, it is the
             * entry point to all 'OnData' callbacks.  So, if some logic needs to occur first, it
             * can be written here.  Then, after that, we call all registered callbacks.
             */
            
            // Log
            console.log('Selection state changed!', self.selectionState);
            
            // Call registered callbacks
            self.listenerRegistry.forEach(f => { f(); });
        }
        
        function addListener(f) {
            /**
             * Registers a listener to the Qlik 'OnData' event.  Whenever the Qlik data model
             * changes, the given function will be called.
             *
             * Args:
             *     f:  A callback function.
             */
            
            // Check if callback has already been added
            if (self.listenerRegistry.indexOf(f) == -1) {
                // Add callback to registry
                self.listenerRegistry.push(f);
            }
        }
        
        function removeListener(f) {
            /**
             * Unregisters a listener to the Qlik 'OnData' event.  The given function will no
             * longer be called in response to a Qlik data model change.
             *
             * Args:
             *     f:  A callback function.
             */
            
            // First, get index
            var index = self.listenerRegistry.indexOf(f);
            // If exists, remove
            if (index != -1) { self.listenerRegistry.splice(index, 1) };
        }
        
        function embedObject(elementID, objectID) {
            /**
             * Embeds a Qlik visualization object into a DOM element.
             *
             * Args:
             *     elementID:  A DOM element ID.
             *     objectID:  A Qlik Sense object ID.
             *
             * Returns:
             *     A promise of a QV object.
             */
            return self.app.getObject(elementID, objectID);
        }
        
        function resize() {
            /**
             * Sends a resize event to all Qlik objects.
             */
             self.qlik.resize();
        }
        
        function select(fieldName, fieldValues) {
            /**
             * Asks engine to select values in a field.
             *
             * Args:
             *     fieldName:  A field to make selections on.
             *     fieldValues:  An array of field value strings.
             *
             * Returns:
             *     A promise.
             */
            
            // The Qlik engine expects us to provide strings and numbers as separate types
            fieldValues = paUtilityService.tryToNumber(fieldValues);
            
            // Ask Qlik engine to perform selection
            console.log('Asking engine to select...', fieldName, fieldValues);
            return self.app.field(fieldName).selectValues(fieldValues, true);
        }
        
        function clear() {
            /**
             * Asks engine to clear all selections.
             */
            return self.app.clearAll();
        }
        
        function back() {
            /**
             * Asks engine to step back in the history of selections.
             */
            return self.app.back();
        }
        
        function forward() {
            /**
             * Asks engine to step forward in the history of selections.
             */
            return self.app.forward();
        }
        
        function _getJSONCreateList(fieldName, top, height) {
            /**
             * Constructs a 'createList' engine request JSON.
             *
             * Args:
             *     fieldName:  A field to obtain information about.
             *     top, height:
             *         Assume the engine stores a million values in a giant array.  Then, we will
             *         request indices [top, top + height - 1].
             * 
             * Returns:
             *     A JSON.
             */
            return {
                "qDef": {
                    "qFieldDefs": [
                        fieldName
                    ]
                },
                "qAutoSortByState": {
                    "qDisplayNumberOfRows": 1
                },
                "qShowAlternatives": true,
                "qInitialDataFetch": [{
                    "qTop": top,
                    "qLeft": 0,
                    "qHeight": height,
                    "qWidth": 1
                }]
            };
        }
        
        function getFieldData(fieldName) {
            /**
             * Asks engine to retrieve values (and selection info) for a given field.
             *
             * Args:
             *     fieldName:  A field to retrieve values for.
             * 
             * Returns:
             *     A promise.
             */
            return new Promise((resolve, reject) => {
                var data = [];
                _getFieldDataLoop(fieldName, data, resolve, reject);
            });
        }
        
        function _getFieldDataLoop(fieldName, data, resolve, reject) {
            /**
             * A recursive step to the function above.  If a field has a million values, then we
             * will need to extract them one chunk at a time.  This method will obtain a single
             * chunk.
             */
            
            // How many values have we already loaded?
            var top = data.length;
            // What is our chunk size?
            var height = 10000;
            // Construct engine request
            var request = _getJSONCreateList(fieldName, top, height);
            
            // Send request
            self.app.createList(request)
                .then(response => {
                    // console.log('response', response);
                    
                    // Extract matrix
                    var matrix = response.layout.qListObject.qDataPages[0].qMatrix;
                    
                    // Insert matrix data into our array
                    matrix.forEach(value => {
                        data.push({
                            qElemNumber: value[0].qElemNumber,
                            qNum: value[0].qNum,
                            qState: value[0].qState,
                            qText: value[0].qText
                        });
                    });
                    
                    // If the matrix length is less than our chunk size, we are done
                    if (matrix.length >= height) {
                        // console.log('Keep going...');
                        getFieldDataLoop(fieldName, data);
                    } else {
                        console.log('Done getFieldData', fieldName, data.length, { data: data });
                        resolve(data);
                    }
                });
        }
        
        function setDimension(qObject, fieldName, fieldLabel) {
            /**
             * Sets the first dimension (and label) of a Qlik object.
             *
             * Args:
             *     qObject:  The Qlik object to modify.
             *     fieldName:  We will set the dimension to this.
             *     fieldLabel:  We will set the dimension label to this.
             *
             * Returns:
             *     A promise of a Qlik engine reply,
             */
            
            // Note:  To inspect a Qlik object's property tree, you can do this:
            // app.getFullPropertyTree('pmmeW').then(response => { console.log(response); });
            
            // The property paths depend on the object type
            var qObjectType = qObject.layout.visualization;
            if (qObjectType == 'listbox') {
                var fieldNamePath = '/qListObjectDef/qDef/qFieldDefs/0';
                var fieldLabelPath = '/qListObjectDef/qDef/qFieldLabels/0';
            }
            else {
                var fieldNamePath = '/qHyperCubeDef/qDimensions/0/qDef/qFieldDefs/0';
                var fieldLabelPath = '/qHyperCubeDef/qDimensions/0/qDef/qFieldLabels/0';
            }
            
            // Create a list of property modifications (i.e. 'patches') we want to apply
            var patches = [ {
                'qOp': 'replace',
                'qPath': fieldNamePath,
                'qValue': '"' + fieldName + '"'
            }, {
                'qOp': 'replace',
                'qPath': fieldLabelPath,
                'qValue': '"' + fieldLabel + '"'
            } ];
            
            // Ask engine to apply them
            return qObject.applyPatches(patches, true);
        }
        
        function createListBox(fieldName, fieldLabel) {
            /**
             * Creates a listbox object.
             *
             * Note:
             *     I'm using the undocumented approach discovered here:
             *     https://community.qlik.com/thread/232642
             *
             * Args:
             *     fieldName:  The list box field.
             *     fieldLabel:  The list box field label.
             *
             * Returns:
             *     A promise of a QVisualization object.
             */
            
            // First, we prepare the engine request JSON
            var json = {
                /*"title": fieldLabel,*/
                "qListObjectDef": {
                    "qDef": {  
                        "qFieldDefs": [ fieldName ],
                        "qFieldLabels": [ fieldLabel ]
                    }
                }
            };
            
            // Next, we call the Visualization API
            return self.app.visualization.create('listbox', null, json);
        }
        
        function download(qObject, format) {
            /**
             * Allows user to download a Qlik object as a data file.
             *
             * Args:
             *     qObject:  The Qlik object to download.
             *     format:  Either 'OOXML' or 'CSV_C'.
             */
            
            // Specify export options
            var options = {
                format: format,
                download: true
            };
            
            // Old way.  Apparently this broke in Qlik Sense 3.2:
            // https://github.com/stefanwalther/sense-export/issues/17
            // 
            // self.qlik.table(qObject).exportData(options);
            
            // Workaround hack.  Copied from here:
            // https://github.com/stefanwalther/sense-export/blob/master/src/swr-sense-export.js
            //
            qObject.find('.qv-object').scope().ext.model.exportData(options.format, '/qHyperCubeDef', options.filename, options.download).then(response => {
                var qUrl = response.result ? response.result.qUrl : response.qUrl;
                var prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf('/sense') + 1);
                var url = window.location.href;
                url = url.split('/');
                var basePath = url[0] + '//' + url[2] + ((prefix[prefix.length - 1] === '/') ? prefix.substr(0, prefix.length - 1) : prefix);
                var link = basePath + qUrl;
                window.open(link);
            });
        }
        
        // Log
        console.log('Constructed paQlikService!', paUtilityService.cw(), self);
    }
    
})();