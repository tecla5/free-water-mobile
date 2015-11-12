Polymer({
  is: 'firebase-login',
  properties:{
    user: Object
  },
  listeners: {
    'googleLogin.tap': 'googleLogin',
    'facebookLogin.tap': 'facebookLogin'
  },
  ready: function(){
    this.ref = new Firebase('https://blinding-fire-1061.firebaseIO.com');
    var self = this;

    this.ref.onAuth(function(authData){
        self.setUserProperty(authData);
    });
  },
  attached: function(){
    this.showUserLoggedInfo();
  },
  showLoginDialog: function(){
    var self = this;

    return new Promise(function(resolve, reject){
      self.$.loginDialog.open();
      self.promiseOpts = {
        resolve:  resolve,
        reject: reject
      };
    });
  },
  login: function(platform){
    var self = this;
    this.ref.authWithOAuthPopup(platform, function(error, authData) {
      if (error) {
        console.log('Login Failed!', error);
        self.promiseOpts.reject(error);
      } else {
        console.log('Authenticated successfully with payload:', authData);
        self.setUserProperty(authData);
        self.promiseOpts.resolve(self.user);
      }

      self.closeLoginDialog();
    });
  },
  showUserLoggedInfo: function(){
    var userNameComponent = document.querySelector('.user-name');

    if (userNameComponent){
      document.querySelector('.user-name').innerHTML = this.user.displayName;
      document.querySelector('.user-picture').src = this.user.picture;
    }
  },
  setUserProperty: function(authData){

    if (authData){
      this.user = {};

      if (authData.google){
        this.user.displayName = authData.google.displayName;
        this.user.picture = authData.google.profileImageURL;
      }else{
         //user = authData.facebook;
      }
      console.log(JSON.stringify(authData));
      this.showUserLoggedInfo();
    }else{
      this.user = authData;
    }
  },
  googleLogin: function(){
    this.login('google');
  },
  facebookLogin: function(){
    this.login('facebook');
  },
  closeLoginDialog: function(){
    //TODO: add code to close login dialog
    this.promiseOpts = {};
  }

});