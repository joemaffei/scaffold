Scaffold = function(selector, extension) {
  
  Object.defineProperty(this, "selector", {
    value: selector || extension.selector || null,
    enumerable: false
  });
  
  Object.defineProperty(this, "root", {
    get: function() {
      return this.parent ? this.parent.root : this
    },
    enumerable: false
  });
  
  Object.defineProperty(this, 'children', {
    get: function() {      
      return Object.keys(this).map(function(property){
        return this[property];
      }, this) || {};
    }
  });
  
  Object.defineProperty(this, 'childrenObject', {
    get: function() {
      var _this = this;	// there should be a way to avoid this
      return Object.keys(this).reduce(function(result, property, index){
        result[property] = result[index] = _this[property];
        return result;
      }, {}) || {};
    }
  });
  
  Object.defineProperty(this, 'siblings', {
    get: function() {
      if (this.hasOwnProperty('parent')) {
        return this.parent.children.filter(function(scaffold){
          return scaffold !== this;
        }, this);
      } else {
        return [];
      }
    }
  });

  Object.defineProperty(this, "DOM", {
    get: function() {
      return document.querySelector(this.selector);
    },
    enumerable: false
  });

  Object.defineProperty(this, "$", {
    get() {
      return $(this.selector);
    },
    enumerable: false
  });  
  
  if (extension.constructor === Object) {														// only extend if extension is an object
    
    for (property in extension) {
      if (extension[property].constructor === Object) {
        
        // objects in extension are assumed to be Scaffold objects
        this[property] = Object.defineProperty(new Scaffold(null, extension[property]), 'parent', {
          value: this,
          enumerable: false
        });
        
      } else if (typeof extension[property] === 'function') {
        
        Object.defineProperty(this, property, {													// make functions non-enumerable
          value: extension[property],
          enumerable: false
        });        
        
        if (property.length > 2 && property.toLowerCase().startsWith('on')) {	// attach event if property starts with 'on'
          this.DOM[property.toLowerCase()] = extension[property].bind(this);
          // 'bind' here changes the context of 'this' in the event handler, like jQuery does
        }
        
      } else {
        
      	this[property] = extension[property];
        
      }
    }
  }
};

$$$ = function(selector, extension) {
  return new Scaffold(selector, extension);
}