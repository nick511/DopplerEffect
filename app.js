angular.module('app.dopplerEffect', ['ngMaterial'])
  .controller('DopplerEffectCtrl', DopplerEffectCtrl)
  .service('mathUtil', mathUtil);

/* @ngInject */
function DopplerEffectCtrl(mathUtil) {
  var vm = this;
  var oldValue = 0;
  var SLIDER_MIN = 0;
  var SLIDER_MAX = 100;
  var OUTPUT_MIN = -100;
  var OUTPUT_MAX = 100;
  var logRange = new mathUtil.LogRange(SLIDER_MIN, SLIDER_MAX, OUTPUT_MIN, OUTPUT_MAX);

  vm.value = 0;
  vm.sliderVal = 0;
  vm.slider_min = SLIDER_MIN;
  vm.slider_max = SLIDER_MAX;
  vm.photoFilter = {};

  vm.calculateValue = calculateValue;
  vm.calculatePosition = calculatePosition;
  vm.calculatePosition();

  ////////////

  function calculateValue() {
    vm.value = Math.round(logRange.result(vm.sliderVal));
    oldValue = vm.value;
    changeColor();
  }

  function calculatePosition() {
    if (vm.value === undefined) {
      vm.value = oldValue;
      return;
    } else {
      oldValue = vm.value;
    }

    vm.sliderVal = logRange.getInput(vm.value);
    changeColor();
  }

  function changeColor() {
    var colorDeg = 0;
    var outputRange = (OUTPUT_MAX - OUTPUT_MIN) / 2;
    if (vm.value > 0) { //red:-50
      colorDeg = -50/outputRange * vm.value;
    } else { //blue:180
      colorDeg = 180/outputRange * -vm.value;
    }

    vm.photoFilter = {
      filter: 'hue-rotate(' + colorDeg + 'deg)',
      '-webkit-filter': 'hue-rotate(' + colorDeg + 'deg)'
    };
  }
}

function mathUtil() {
  this.LogRange = LogRange;

  ////////////

  function LogRange(inputMin, inputMax, min, max) {
    this.inputMin = inputMin;
    this.inputMax = inputMax;

    this.diff = 0;
    if (min < 1) { //min must >= 1
      this.diff = min - 1;
      min = 1;
      max = max - this.diff;
    }
    this.min = Math.log(min);
    this.max = Math.log(max);

    this.scale = (this.max - this.min) / (this.inputMax - this.inputMin);
  }

  LogRange.prototype = {
    result: function(input) {
      return Math.exp((input - this.inputMin) * this.scale + this.min) + this.diff;
    },
    getInput: function(value) {
      value -= this.diff;
      return this.inputMin + (Math.log(value) - this.min) / this.scale;
    }
  };
}
