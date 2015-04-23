OctoModel = require '../../app/models/octo-model'

describe 'OctoModel', ->
  beforeEach ->
    @meshblu = {}
    @sut = new OctoModel meshblu: @meshblu

  describe '->findManagers', ->
    describe 'when meshblu.mydevices yields one octo-manager device', ->
      beforeEach (done) ->
        @meshblu.mydevices = sinon.stub().yields devices: [uuid: 'hello', type: 'octoblu:octo-manager']
        @sut.findManagers (@managers) => done()

      it 'should yield a octo-manager device uuid', ->
        expect(@managers).to.deep.equal ['hello']

    describe 'when meshblu.mydevices yields another octo-manager device', ->
      beforeEach (done) ->
        @meshblu.mydevices = sinon.stub().yields devices: [uuid: 'goodbye', type: 'octoblu:octo-manager']
        @sut.findManagers (@managers) => done()

      it 'should yield a octo-manager device uuid', ->
        expect(@managers).to.deep.equal ['goodbye']

    describe 'when meshblu.mydevices yields no octo-manager device', ->
      beforeEach (done) ->
        @meshblu.mydevices = sinon.stub().yields devices: [uuid: 'goodbye', type: 'something:else']
        @sut.findManagers (@managers) => done()

      it 'should yield a octo-manager device uuid', ->
        expect(@managers).to.deep.equal []

  describe '->messageManagers', ->
    describe 'when called uuid and token', ->
      beforeEach ->
        @meshblu.message = sinon.spy()
        @sut.messageManagers 'create-octo', ['master'], {uuid: 'dude', token: 'bye'}

      it 'should send a meshblu message to start the octo', ->
        expect(@meshblu.message).to.have.been.calledWith
          payload:
            uuid: 'dude'
            token: 'bye'
          devices: ['master']
          topic: 'create-octo'

    describe 'when called uuid and token', ->
      beforeEach ->
        @meshblu.message = sinon.spy()
        @sut.messageManagers 'create-octo', ['super-master'], {uuid: 'hey you', token: '...'}

      it 'should send a meshblu message to start the octo', ->
        expect(@meshblu.message).to.have.been.calledWith
          payload:
            uuid: 'hey you'
            token: '...'
          devices: ['super-master']
          topic: 'create-octo'

  describe '->createDevice', ->
    describe 'when called a owner uuid', ->
      beforeEach (done) ->
        device =
          uuid: 'hi'
          token: 'see ya'
          type: 'octoblu:octo'
          owner: 'yo'
          configureWhitelist: ['yo']
          discoverWhitelist: ['yo']
          receiveWhitelist: ['yo']
          sendWhitelist: ['yo']

        @meshblu.register = sinon.stub().yields device
        @sut.createDevice 'yo', (@device) => done()

      it 'should call meshblu.register with the defaults', ->
        expect(@meshblu.register).to.have.been.calledWith
          type: 'octoblu:octo'
          owner: 'yo'
          configureWhitelist: ['yo']
          discoverWhitelist: ['yo']
          receiveWhitelist: ['yo']
          sendWhitelist: ['yo']

      it 'should yield an octo device', ->
        expect(@device).to.deep.equal
          uuid: 'hi'
          token: 'see ya'
          type: 'octoblu:octo'
          owner: 'yo'
          configureWhitelist: ['yo']
          discoverWhitelist: ['yo']
          receiveWhitelist: ['yo']
          sendWhitelist: ['yo']

    describe 'when called with a different owner uuid', ->
      beforeEach (done) ->
        device =
          uuid: 'heeellooo'
          token: 'peace'
          type: 'octoblu:octo'
          owner: 'hey'
          configureWhitelist: ['hey']
          discoverWhitelist: ['hey']
          receiveWhitelist: ['hey']
          sendWhitelist: ['hey']

        @meshblu.register = sinon.stub().yields device
        @sut.createDevice 'hey', (@device) => done()

      it 'should call meshblu.register with the defaults', ->
        expect(@meshblu.register).to.have.been.calledWith
          type: 'octoblu:octo'
          owner: 'hey'
          configureWhitelist: ['hey']
          discoverWhitelist: ['hey']
          receiveWhitelist: ['hey']
          sendWhitelist: ['hey']

      it 'should yield an octo device', ->
        expect(@device).to.deep.equal
          uuid: 'heeellooo'
          token: 'peace'
          type: 'octoblu:octo'
          owner: 'hey'
          configureWhitelist: ['hey']
          discoverWhitelist: ['hey']
          receiveWhitelist: ['hey']
          sendWhitelist: ['hey']

  describe '->delete', ->
    beforeEach ->
      @meshblu.mydevices = sinon.stub().yields devices: [uuid: 'not-so-super-master', type: 'octoblu:octo-manager']
      @meshblu.message = sinon.spy()
      @sut.delete('hey you')

    it 'should message the octo-managers', ->
      expect(@meshblu.message).to.have.been.calledWith
        payload:
          uuid: 'hey you'
        devices: ['not-so-super-master']
        topic: 'delete-octo'