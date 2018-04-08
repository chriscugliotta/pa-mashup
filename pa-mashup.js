// RequireJS configuration
var prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf('/extensions') + 1);

var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === 'https:'
};

require.config({
	baseUrl: (config.isSecure ? 'https://' : 'http://') + config.host + (config.port ? ':' + config.port : '') + config.prefix + 'resources',
    paths: {
        /* 
         * This dictionary contains a list all modules recognized by RequireJS.
         * In other words, a 'define' or 'require' statement can only reference
         * modules specified here.  Note that Qlik has already pre-populated
         * this list with several items.  To see the complete list, try this:
         *
         * console.log(requirejs.s.contexts._.config.paths);
         *
         * For instance, there is no need to specify a 'jquery' path, because
         * Qlik already included that.  We will add all remaining third party
         * dependencies below.
         */
        'bootstrap' : 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min',
        'test'      : '/extensions/pa-mashup/test'
    },
    shim: {
        'bootstrap': { 'deps': ['jquery'] }
    }
});





require([
    'bootstrap',
    'jquery',
    'js/qlik'
], function(
    bootstrap,
    $,
    qlik
) {

    // Entry point
    'use strict';
    initialize();
    
    // Loads all JSON dependencies, and then starts up Angular
    function initialize() {
        
        // Load JSON files
        var promises = [
            promiseJSON('app/qlikApps/ExecutiveDashboard/qlikAppConfig.json')
        ];
        
        // Wait until all JSON files are loaded
        Promise.all(promises).then(result => {
            
            // Extract JSON's
            console.log('Loaded all JSON files!', result);
            var qlikAppConfig = result[0];
            
            // Wait until all dynamic dependencies are loaded
            require(qlikAppConfig.dependencies, function() {
                
                // Register external libraries as Angular constants
                angular.module('paApp')
                    .constant('$', $)
                    .constant('qlik', qlik)
                    .constant('paQlikAppConfig', qlikAppConfig);
                
                // Finally, we can start up the Angular modules.
                // The timing of this line of code is important.
                // Angular requires it to happen AFTER all modules are defined.
                // Qlik requires it to happen before any Qlik API's are touched.
                // console.log('Begin angular bootstrap');
                angular.bootstrap(document, ['paApp', 'qlik-angular']);
                // console.log('End angular bootstrap');
            });

        });
    }
    
    // Loads a JSON and returns a promise
    function promiseJSON(url) {
        return new Promise((resolve, reject) => {
            $.getJSON(url)
            .done(o => { resolve(o) } )
            .fail(o => { reject(o) } );
        });
    }
    
});


