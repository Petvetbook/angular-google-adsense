(function () {

    'use strict';

    angular.module('morrr-angular-google-adsense', []).

    service('Adsense', [function(){
        this.url = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        this.isAlreadyLoaded = false;
    }]).

    directive('adsense', function () {
        return {
            restrict: 'E',
            replace: true,
            scope : {
                adClient : '@',
                adSlot : '@',
                inlineStyle : '@',
                minWidth: '@',
                maxWidth: '@'
            },
            template: '<div class="ads" ng-if="visible"><ins class="adsbygoogle" data-ad-client="{{adClient}}" data-ad-slot="{{adSlot}}" style="{{inlineStyle}}"></ins></div>',
            controller: ['Adsense', '$timeout', '$scope', '$window', function (Adsense, $timeout, $scope, $window) {
                $scope.getWindowWidth = function() {
                    return angular.element($window).width();
                };

                $scope.$watch($scope.getWindowWidth, function(newValue, oldValue) {
                    $scope.visible = false;
                    $scope.maxWidth = $scope.maxWidth? $scope.maxWidth: newValue;
                    $scope.minWidth = $scope.minWidth? $scope.minWidth: 0;
                    if ($scope.maxWidth >= newValue && $scope.minWidth <= newValue) {
                        $scope.visible = true;
                    }
                });

                if (!Adsense.isAlreadyLoaded) {
                    var s = document.createElement('script');
                    s.type = 'text/javascript';
                    s.src = Adsense.url;
                    s.async = true;
                    document.body.appendChild(s);

                    Adsense.isAlreadyLoaded = true;
                }
                /**
                 * We need to wrap the call the AdSense in a $apply to update the bindings.
                 * Otherwise, we get a 400 error because AdSense gets literal strings from the directive
                 */
                $timeout(function(){
                     (window.adsbygoogle = window.adsbygoogle || []).push({});
                });
            }]
        };
    });
}());
