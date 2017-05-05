Scaffold = function(selector, extension) {
  this.selector = selector || extension.selector;
  this.$ = $(this.selector);
  this.DOM = document.querySelector(this.selector);
  
  for (property in extension) {
    if (extension[property].constructor === Scaffold) {      
      extension[property].parent = this;
    } else if (property.length > 2 && property.toLowerCase().startsWith('on')) {	// attach event if property starts with 'on'      
      this.DOM[property.toLowerCase()] = extension[property].bind(this);
      // 'bind' here changes the context of 'this' in the event handler, like jQuery does
    }
    this[property] = extension[property];
  }
  
  Object.defineProperty(this, 'root', {
    get: function() {
      return this.parent ? this.parent.root : this
    }
  });
  
  Object.defineProperty(this, 'children', {
    get: function() {
      return Object.keys(this).map(function(property){
        return this[property];
      }, this).filter(function(element){
        return element.constructor === Scaffold;
      });
    }
  });
  
};

$$$ = function(selector, extension) {
  return new Scaffold(selector, extension);
}

var modalButtons = $$$('.modal-buttons', {
    cancelButton: $$$('.cancel-button', {
      onclick: function() {
        this.root.header.set('CANCEL CLICKED!');
      }
    }),
    acceptButton: $$$('.accept-button', {
      ondblclick: function() {
        this.root.content.set('ACCEPT DBLCLICKED!');
      }
    })
  });

var modal = $$$('.modal', {
  open: function() {
    this.$.show();
  },
  close: function() {
    this.$.hide();
  },
  header: $$$('.modal-header', {
    set: function(markup) {
      this.$.html(markup);
    }
  }),
  content: $$$('.modal-content', {
    set: function(markup) {
      this.$.html(markup);
    }
  }),
  buttons: modalButtons
});