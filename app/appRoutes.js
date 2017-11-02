(function() {
    'use strict';

    // Register
    angular
        .module('paApp')
        .config(configure);
    
    // Inject
    configure.$inject = ['$routeProvider', 'paQlikAppConfig'];
    
    
    
    
    
    // Configure
    function configure($routeProvider, paQlikAppConfig) {
        /**
         * Here, we are using the AngularJS routing module to associate browser URL's with 'views',
         * i.e. HTML templates and JavaScript controllers.  The list of registered views is not
         * hardcoded.  Instead, view parameters are read from the app config JSON.
         */
        
        // Loop over views in config
        paQlikAppConfig.views.forEach(view => {
            
            // Register view
            $routeProvider
                .when(view.path, {
                    controller: view.controller,
                    controllerAs: 'self',
                    templateUrl: view.templateUrl
                })
            
        });
        
        // Redirect
        $routeProvider
            .otherwise({
                redirectTo: paQlikAppConfig.views[0].path
            });
        
        // Log
        console.log('Done appRoutes');
    }

})();