var mainapp =
    angular.module('gruntApp', ["ui.router", "MainCtrl", "TestService"]);
mainapp.run(
    ['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
);
mainapp
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider) {
            // enable html5Mode for pushstate ('#'-less URLs)
            // $locationProvider.html5Mode(true);
            // $locationProvider.hashPrefix('!');
            $urlRouterProvider.otherwise('/login');

            $stateProvider
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/student.login.html'
                })
                .state('signup', {
                    url: '/signup',
                    templateUrl: 'views/student.signup.html'
                })
                .state('form', {
                    url: '/form',
                    templateUrl: 'views/student.form.html'
                })
                .state('success', {
                    url: '/success',
                    templateUrl: 'views/success.html'
                });


        }]);
