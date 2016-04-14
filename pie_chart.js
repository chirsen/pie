var extend = require('extend');
//扇形
var pie_chart = (function() {
    function pie_chart(options) {
        this.defaultOptions = {
            container: null,
            centerPoint: {},
            radius: 0,
            offSetDegree: 0,
            takePercent: 0,
            color: "black",
            out: false
        };
        this.options = extend(this.defaultOptions, options);
    }

    pie_chart.prototype.basicDraw = function(color) {
        var ctx = this.options.container.getContext('2d');
        // this.options.centerPoint.y += Math.floor((this.options.out ? 1 : 0 )*10*Math.sin(this.options.takePercent/2));
        // this.options.centerPoint.x += Math.floor((this.options.out ? 1 : 0 )*10*Math.cos(this.options.takePercent/2));
        ctx.save();

        ctx.fillStyle = color;
        ctx.translate(this.options.centerPoint.x, this.options.centerPoint.y);
        ctx.rotate(this.options.offSetDegree);
        ctx.beginPath();
        ctx.moveTo(this.options.centerPoint.x, this.options.centerPoint.y);
        ctx.lineTo(this.options.centerPoint.x + this.options.radius, this.options.centerPoint.y);
        ctx.arc(this.options.centerPoint.x, this.options.centerPoint.y, this.options.radius, 0, this.options.takePercent, false);
        ctx.lineTo(this.options.centerPoint.x, this.options.centerPoint.y);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    };

    //判断canvas被点击后，是否在当前扇形区域内
    pie_chart.prototype.inArea = function(screen_x, screen_y) {
        var x = screen_x-this.options.centerPoint.x;
        var y = screen_y-this.options.centerPoint.y;
        var r = this.options.radius;
        var off = this.options.offSetDegree;
        var take = this.options.takePercent;
        if(x*x + y*y <= r*r && (y >= x*Math.sin(off)) && y <= x*Math.sin(off+take)){
            return true;
        }
        return false;
    }

    pie_chart.prototype.draw = function() {
        var _this = this;
        _this.basicDraw(this.options.color);
        _this.basicDraw(this.options.color);
        //浮动
        _this.options.container.addEventListener("mousemove", function(e) {

            var x = e.clientX;
            var y = e.clientY;
            if (_this.inArea(x, y)) {
                _this.mouseOver();
            }

        });
        //点击
        _this.options.container.addEventListener('click', function(e) {

            var x = e.clientX;
            var y = e.clientY;

            if (_this.inArea(x, y)) {
                _this.clearPie();
                _this.options.out = _this.options.out ? false : true;
                _this.basicDraw(_this.options.color);
            }
        });

    }

    pie_chart.prototype.mouseOver = function() {
        this.basicDraw("black");
    }

    pie_chart.prototype.clearPie = function() {
        this.basicDraw("white");
    };

    return pie_chart;
})();


window.Pie = pie_chart;
