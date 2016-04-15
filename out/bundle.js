/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./out/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Pie = __webpack_require__(1);
	var extend = __webpack_require__(2);
	
	var chart = (function() {
	    function chart(options) {
	        this.defaultOptions = {
	            datas: [1,],
	            colors: ["black",],
	            container: null,
	            radius: 0,
	            centerPoint: {},
	            backgroundColor: "white",
	            pies: []
	        };
	
	        this.options = extend(this.defaultOptions, options);
	    }
	
	    chart.prototype.draw = function() {
	        var pies_data = dataDeal(this.options.datas, this.options.colors);
	        var _this = this;
	        for (var i = 0; i < pies_data.length; i++) {
	            this.options.pies[i] = new Pie({
	                container: _this.options.container,
	                centerPoint: _this.options.centerPoint,
	                radius: _this.options.radius,
	                startDegree: pies_data[i].start,
	                endDegree: pies_data[i].end,
	                color: pies_data[i].color
	            });
	
	            this.options.pies[i].draw();
	        }
	
	        this.options.container.addEventListener('click', function(e){
	    		var x = e.clientX;
	    		var y = e.clientY;
	    		for(var i = 0; i < _this.options.pies.length; i++){
	    			_this.options.pies[i].click(x, y);
	    		}
	    	});
	
	    	this.options.container.addEventListener('mousemove', function(e){
	    		var x = e.clientX;
	    		var y = e.clientY;
	    		for(var i = 0; i < _this.options.pies.length; i++){
	    			_this.options.pies[i].mouseOver(x, y);
	    		}
	    	});
	
	    }
	
	
	    function dataDeal(datas, colors) {
	        var pies = [];
	        var offsetDegree = 0;
	        for (var i = 0; i < datas.length; i++) {
	        	pies[i] = {};
	            pies[i].start = offsetDegree;
	            if (i != datas.length - 1) {
	                pies[i].end = offsetDegree + 2 * Math.PI * datas[i];
	            }else{
	            	pies[i].end = 2*Math.PI;
	            }
	            offsetDegree = pies[i].end;
	            pies[i].color = colors[i];
	        }
	        return pies;
	    }
	
	    return chart;
	})();
	
	window.Chart = chart;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var extend = __webpack_require__(2);
	//扇形
	var pie_chart = (function() {
	    function pie_chart(options) {
	        this.defaultOptions = {
	            container: null,
	            centerPoint: {},
	            radius: 0,
	            startDegree: 0,
	            endDegree: 0,
	            color: "black",
	            out: false
	        };
	        this.options = extend(this.defaultOptions, options);
	    }
	    //根据颜色,圆心，半径,偏移角度和结束角度，画扇形
	    pie_chart.prototype.basicDraw = function(color) {
	        var ctx = this.options.container.getContext('2d');
	        ctx.save();
	        //移动旋转，进行扇形的绘制
	        ctx.fillStyle = color;
	        ctx.strokeStyle = "white";
	        ctx.translate(this.options.centerPoint.x, this.options.centerPoint.y);
	        ctx.rotate(this.options.startDegree);
	        ctx.beginPath();
	        ctx.moveTo(0, 0);
	        ctx.lineTo(0 + this.options.radius, 0);
	        ctx.arc(0, 0, this.options.radius, 0, this.options.endDegree - this.options.startDegree, false);
	        ctx.lineTo(0, 0);
	        ctx.closePath();
	        ctx.stroke();
	        ctx.fill();
	
	        ctx.restore();
	    };
	
	    //判断canvas被点击，传送过来的x, y，是否在当前扇形区域内
	    pie_chart.prototype.inArea = function(screen_x, screen_y) {
	        var x = screen_x - this.options.centerPoint.x;
	        var y = screen_y - this.options.centerPoint.y;
	        var r = this.options.radius;
	        if (x * x + y * y <= r * r ) {
	            console.log(Math.tan(this.options.startDegree)+"  :  "+Math.tan(this.options.endDegree));
	            return true;
	        }
	        return false;
	    }
	
	    pie_chart.prototype.click = function(x, y) {
	        if (this.inArea(x, y)) {
	            this.clearPie();
	            this.options.centerPoint.x += (this.options.out ? -1 : 1) * 10 * Math.cos(this.options.endDegree - this.options.startDegree);
	            this.options.centerPoint.y += (this.options.out ? -1 : 1) * 10 * Math.sin(this.options.endDegree - this.options.startDegree);
	            this.basicDraw(this.options.color);
	            this.options.out = (this.options.out ? false : true);
	        } else {
	
	        }
	
	    }
	
	    //暴露出的绘图函数
	    pie_chart.prototype.draw = function() {
	        console.log(this.options);
	        this.basicDraw(this.options.color);
	    }
	
	    //鼠标悬停（改进颜色为指定颜色的亮色）
	    pie_chart.prototype.mouseOver = function(x, y) {
	            if (this.inArea(x, y)) {
	                this.basicDraw("#eeeeee");
	            }else{
	                this.basicDraw(this.options.color);
	            }
	        }
	        //鼠标离开（改进黑色为指定颜色）
	    // pie_chart.prototype.mouseLeave = function() {
	    //         this.basicDraw(this.options.color);
	    //     }
	    //     //清空指定区域（这里需要改进白色为背景色）
	    pie_chart.prototype.clearPie = function() {
	        this.basicDraw("white");
	    };
	
	    return pie_chart;
	})();
	
	
	module.exports = pie_chart;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/*!
	 * object-extend
	 * A well-tested function to deep extend (or merge) JavaScript objects without further dependencies.
	 *
	 * http://github.com/bernhardw
	 *
	 * Copyright 2013, Bernhard Wanger <mail@bernhardwanger.com>
	 * Released under the MIT license.
	 *
	 * Date: 2013-04-10
	 */
	
	
	/**
	 * Extend object a with object b.
	 *
	 * @param {Object} a Source object.
	 * @param {Object} b Object to extend with.
	 * @returns {Object} a Extended object.
	 */
	module.exports = function extend(a, b) {
	
	    // Don't touch 'null' or 'undefined' objects.
	    if (a == null || b == null) {
	        return a;
	    }
	
	    // TODO: Refactor to use for-loop for performance reasons.
	    Object.keys(b).forEach(function (key) {
	
	        // Detect object without array, date or null.
	        // TODO: Performance test:
	        // a) b.constructor === Object.prototype.constructor
	        // b) Object.prototype.toString.call(b) == '[object Object]'
	        if (Object.prototype.toString.call(b[key]) == '[object Object]') {
	            if (Object.prototype.toString.call(a[key]) != '[object Object]') {
	                a[key] = b[key];
	            } else {
	                a[key] = extend(a[key], b[key]);
	            }
	        } else {
	            a[key] = b[key];
	        }
	
	    });
	
	    return a;
	
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map