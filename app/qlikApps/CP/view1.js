(function () {
    'use strict';
    
    // Register
    angular
        .module('paApp')
        .controller('view1', view1);
        
    // Inject
    view1.$inject = ['paQlikService', 'paUtilityService'];
    
    
    
    
    
    // Construct
    function view1(paQlikService, paUtilityService) {

        // Methods
        var self = this;
        self._initialize = initialize;
        
        // Do initialization
        initialize();
        
        
        
        function initialize() {
            /**
             * Initialization logic.
             */
            
            // Embed QV objects into divs
            //paQlikService.embedObject('kpi1', 'PTBjM');
            //paQlikService.embedObject('kpi2', 'UQmyhRF');
            //paQlikService.embedObject('kpi3', 'gCxQqhA');
            //paQlikService.embedObject('kpi4', 'Pezty');
            
            //paQlikService.embedObject('treeMap1', 'pmmeW');
            //paQlikService.embedObject('pieChart1', 'qPayWQ');
            //paQlikService.embedObject('lineChart1', 'JJAE');
            
            //paQlikService.embedObject('barChart1', 'JHyHNa');
            //paQlikService.embedObject('barChart2', 'tTcCW');
            //paQlikService.embedObject('straightTable1', 'VpBjM');
        }

        // Log
        console.log('Constructed component view1!', paUtilityService.cw(), self);
    }
    
})();