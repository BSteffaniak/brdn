app.service('$dataShare', [function () {
	var self = this;
	
    this.data = {};
    
	this.get = function (keyword) {
        return self.data[keyword];
    };
    
    this.set = function (keyword, value) {
        self.data[keyword] = value;
    };
    
    this.clear = function () {
        for (var key in self.data) {
            self.data[key] = undefined;
        }
    };
}]);