var _ = require('lodash');
var FlowNodeTypeCollection = require('../../app/collections/flow-node-type-collection');
var when = require('when');

describe('FlowNodeTypeCollection', function () {
  var sut, stub, fakeFS, fakeNodeCollection;

  beforeEach(function () {
    sut = new FlowNodeTypeCollection('user uuid', 'user token');

    fakeNodeCollection = new FakeNodeCollection();
    stub = sinon.stub(sut, 'getNodeCollection');
    stub.returns(fakeNodeCollection);
  });

  describe('fetch', function () {
    var promise;

    beforeEach(function () {
      sinon.spy(sut, 'fromFile');
      promise = sut.fetch();
    });

    it('should call fromFile', function () {
      expect(sut.fromFile).to.have.been.called;
    });

    it('should call getNodeCollection with the user uuid', function () {
      expect(stub).to.have.been.called;
    });

    it('should call nodeCollection.fetch', function(){
      expect(fakeNodeCollection.fetch).to.have.been.called;
    });
  });

  describe('fromNodes', function () {
    it('should call getNodeCollection', function () {
      sut.fromNodes();
      expect(stub).to.have.been.called;
    });

    it('should call fetch on the nodeCollection', function () {
      sut.fromNodes();
      expect(fakeNodeCollection.fetch).to.have.been.called;
    });

    describe('when getNodeCollection resolves', function () {
      it('should map the response to node types', function (done) {
        var node1 = {name : 'moscow-mule', type: 'channel', nodeType:{}};
        var nodes = [node1];

        sut.fromNodes().then(function(responseNodes){
          expect(_.first(responseNodes).name).to.equal('moscow-mule');
          done();
        }).catch(done);

        fakeNodeCollection.fetch.resolve(nodes);
      });
    });
  });

  describe('convertNode', function(){
    it('should look like this', function(){
      var flowNodeType = {
        "name": "lockitino",
        "class": "channel",
        "category": "channel",
        "uuid": "1",
        "defaults": {
          category: 'channel',
          uuid: "1",
          name: 'lockitino',
          type: 'channel',
          nodeType: {
            'logo': 'foo.png',
            'helpText': 'this text helps'
          }
        },
        "logo": "foo.png",
        "helpText": "this text helps",
        "input": 1,
        "output": 1,
        "type":"channel",
        "formTemplatePath": "/pages/node_forms/channel_form.html"
      };
      var node = {name: 'lockitino', type: 'channel', category: 'channel', uuid: '1', nodeType: {logo: 'foo.png', helpText: 'this text helps'}};
      expect(sut.convertNode(node)).to.deep.equal(flowNodeType);
    });

    it('should look like this and like that', function(){
      var flowNodeType = {
        "name": "mockitama",
        "class": "channel",
        "category": "channel",
        "uuid": "1",
        "defaults": {
          category: 'channel',
          uuid: '1',
          name: 'mockitama',
          type: 'channel',
          nodeType: {
            'logo': 'bar.png',
            'helpText': 'this text helps',
          }
        },
        "logo" : "bar.png",
        "helpText": "this text helps",
        "input": 1,
        "output": 1,
        "type":"channel",
        "formTemplatePath": "/pages/node_forms/channel_form.html"
      };
      var node = {name: 'mockitama', type: 'channel', category: 'channel', uuid: '1', nodeType: {logo: 'bar.png', helpText: 'this text helps',}};
      expect(sut.convertNode(node)).to.deep.equal(flowNodeType);
    });

    it('should merge some stuff into this', function(){
      var flowNodeType = {
        "name": "margarita",
        "class": "channel",
        "category": "channel",
        "uuid": "lksdflksdfj",
        "defaults": {
          category: 'channel',
          type: 'channel',
          name: 'margarita',
          fooCount: 'barnone',
          nodeType: {
            'logo': 'baz.png',
            'helpText': 'this text helps',
          },
          uuid: 'lksdflksdfj'
        },
        "logo":"baz.png",
        "helpText": "this text helps",
        "input": 1,
        "output": 1,
        "type":"channel",
        "formTemplatePath": "/pages/node_forms/channel_form.html"
      };
      var node = {type: 'channel', name: 'margarita', uuid: 'lksdflksdfj', category: 'channel', fooCount: 'barnone', nodeType:{logo:'baz.png', helpText: 'this text helps'}};
      expect(sut.convertNode(node)).to.deep.equal(flowNodeType);
    });
  });
});

var FakeFS = function(){
  var self = this;

  self.readFile = sinon.spy(function(filename, options, callback){
    self.readFile.resolve = callback;
  });

  return self;
};

var FakeNodeCollection = function(){
  var self = this;

  self.fetch = sinon.spy(function(){
    var defer = when.defer();
    self.fetch.resolve = defer.resolve;
    return defer.promise;
  });

  return self;
};
