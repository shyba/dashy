describe('/applications', function () {
  beforeEach(function() {
    initServer();
    cleanDb();
  });

  afterEach(function () {
    closeServer();
  });


  describe('POST /request/:app_key', function() {
    it('should validate if the app_key exists', function (done) {
      new Request({ path: '/requests/invalid_key' }).run({}, function (output) {
        expect(output).toEqual('Invalid application key. Please make sure the given key is correct.');
        done();
      });
    });

    it('should create a request for the application if the app_key exists', function(done) {
      var data = {
        request: {
          endpoint: 'Service',
          success: true
        }
      };

      new Application({ name: 'The app' }).save(function(err, app) {
        new Request({ path: '/requests/' + app.key }).run(data, function (output) {
          expect(output).toEqual('Success');

          Application.findOne({ key: app.key }, function(err, app) {
            expect(app.requests.length).toEqual(1);
            expect(app.requests[0].endpoint).toEqual(data.request.endpoint);
            expect(app.requests[0].success).toEqual(data.request.success);
            done();
          });
        });
      });

    });
  });

  describe('POST /new', function(done) {
    it('should create an Application', function(done) {
      var data = {
        application: {
          name: 'A Name'
        }
      };

      new Request({ path: '/applications/new' }).run(data, function (output) {
        Application.find(function (err, apps) {
          expect(apps.length).toEqual(1);
          expect(apps[0].name).toEqual('A Name');
          done();
        });
      });

    });
  });

});
