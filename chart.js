var Pie = require('./pie_chart.js');
var extend = require('extend');
//绘制饼状图
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

    //对给的数据进行处理
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
