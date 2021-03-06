(function () {

  angular.module('App.nfcHandler', [])

    .factory('NFCHandler', ['$q', function ($q) {
      var _url = undefined;

      function checkInviteURL(inviteURL) {
        var parser = document.createElement('a');
        parser.href = inviteURL;
        var res = parser.pathname.split("/");
        if (res[0] === 'invite' && res[1]) {
          _url = res[1];
          return true;
        }
        else {
          return false;
        }
      }

      return {
        checkURL: checkInviteURL,
        get: function () {
          return _url;
        }
      }
    }])
    .factory('nfcService', function ($rootScope, $ionicPlatform, $location, $ionicHistory, $timeout) {

      var tag = {};

      $ionicPlatform.ready(function () {
        var isWebView = ionic.Platform.isWebView();

        if (isWebView) {

          $timeout(function() {
            var message = [
              ndef.textRecord(" letskarite://user/" + $rootScope.auth.username),
              ndef.uriRecord("https://karite.xyz/#/user/" + $rootScope.auth.username)
            ];

            nfc.share(message, function (msg) {
              console.log(msg)
            }, function (msg) {
              console.log(msg)
            });
          }, 4000);



          nfc.addNdefListener(function (nfcEvent) {

            //console.log($ionicHistory.currentView())
            /*

             we can get the statename by doing
             $ionicHistory.currentView().stateName

             We will want to do this to give this factory independent behaviours such as reading in the
             username for a rent or something


             */

            $rootScope.$apply(function () {
              angular.copy(nfcEvent.tag, tag);
              nfc_string_data = nfc.bytesToString(tag.ndefMessage[0]["payload"]);
              console.log("NFC | retrived " + nfc_string_data);

              var split = nfc_string_data.split("/");

              for (var i = 0; i < split.length; i++) {
                if (split[i] === '/' || split[i] === ' ') {
                  split.slice(i, 1)
                }
              }

              split = split.filter(Boolean)
              if (split[0].localeCompare('letskarite:') == 0 || split[0].localeCompare('en letskarite:') == 0 ) {
                console.log("its our tag")
                if (split.length === 3) {
                  switch (split[1]) {
                    case 'product':
                      $location.path('app/item/' + split[2])
                      break;
                    case 'user':
                      $location.path('app/user/' + split[2])
                      break;
                  }
                }
              }
            });
          }, function () {
            console.log("Listening for NFC");
          }, function (err) {
            console.error("Unable to add NFC listener reason: " + err)
          });
        }


      });

      return {
        tag: tag,

        clearTag: function () {
          angular.copy({}, this.tag);
        },
        writeTag: function (type, value) {
          console.log(type + ' ' + value)


          var message = [
            ndef.textRecord("letskarite://product/" + value),
            ndef.uriRecord("https://karite.xyz/listings/" + value)
          ];

          nfc.write(message, function(msg) {
            console.log(msg)
          } , function(msg) {
            console.log(msg)
          });


        }
      };
    });
}())
