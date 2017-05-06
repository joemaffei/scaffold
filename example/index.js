var extension = {
  close: function() { this.$.hide() },
  open: function() { this.$.show() },
  header: {
    selector: '.modal-header',
    set: function(text) {
      this.$.text(text);
    }
  },
  content: {
    selector: '.modal-content',
    set: function(text) {
      this.$.text(text);
    }
  },
  buttons: {
    selector: '.modal-buttons',
    cancelButton: {
      selector: '.cancel-button',
      ondblclick: function(event) {
        this.root.content.set('cancelButton dblclicked!');
      }
    },
    acceptButton: {
      selector: '.accept-button',
      onclick: function(event) {
        this.root.content.set('acceptButton clicked!');
      }
    }
  }
}
  
var modal = $$$(".modal", extension);