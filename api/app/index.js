function App() {
    this.customModels = [];
}

App.prototype.registerSite = function() {

};

App.prototype.registerWidget = function() {

};

App.prototype.registerModels = function(models) {
    var self = this;
    models.forEach(function(model) {
        self.customModels.push(model);
    })
};

module.exports = App;
