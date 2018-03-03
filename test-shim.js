global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};

global.Worker = function() {
  this.addEventListener = function () {
    // Nop
  }
}