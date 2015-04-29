var _ = require('lodash');
var when = require('when');
var TemplateController = function (options, dependencies) {
  var self = this;
  dependencies = dependencies || {};
  var Template  = dependencies.Template || require('../models/template-model');

  var meshblu = options.meshblu;

  self.findByPublic = function(req, res) {
    return Template.findByPublic(req.query.tags).then(function(templates){
      res.send(200, templates);
    }, function(error) {
      res.send(422, error);
      return when.reject(error);
    });
  };

  self.create = function(req, res) {
    Template.createByUserUUID(req.user.resource.uuid, req.body).then(function(template){
      res.send(201, template);
    }, function(error) {
      res.send(422, error);
    });
  };

  self.update = function(req, res) {
    var query = {uuid: req.params.id};
    Template.findOne(query).then(function(template){
      var updatedTemplate = _.extend({}, template, req.body);
      return Template.update(query, updatedTemplate);
    }).then(function(){
      res.send(204);
    }, function(error) {
      res.send(422, error);
    });
  };

  self.findOne = function(req, res) {
    var query = {
      uuid: req.params.id
    };
    return Template.findOne(query).then(function(template) {
      res.send(200, template);
    }, function(error) {
      res.send(404, error);
    });
  };

  self.withUserUUID = function(req, res) {
    return Template.withUserUUID(req.params.uuid).then(function(templates) {
      res.send(200, templates);
    }, function(error) {
      res.send(404, error);
    });
  };

  self.getAllTemplates = function(req, res) {
    return Template.withUserUUID(req.user.resource.uuid).then(function(templates) {
      var sortedTemplates = _.sortBy(templates, 'created').reverse()
      res.send(200, sortedTemplates);
    }, function(error) {
      res.send(404, error);
    });
  };

  self.importTemplate = function(req, res) {
    Template.importTemplate(req.user.resource.uuid, req.params.id, meshblu).then(function(flow){
      res.send(201, flow);
    }, function(error) {
      res.send(422, error);
    });
  };

  self.withFlowId = function(req, res) {
    Template.withFlowId(req.params.flowId).then(function(templates) {
      res.send(200, templates);
    }, function(error) {
      res.send(422, error);
    });
  }

  self.delete = function(req, res) {
    Template.remove({uuid: req.params.id}).then(function() {
      res.send(200);
    }, function(error) {
      res.send(422, error);
    });
  }
};


module.exports = TemplateController;
