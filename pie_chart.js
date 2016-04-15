var extend = require('extend');
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
    //计算点击产生的角度
    function getDegree(x, y) {
        var pi = Math.PI;
        var degree = 0;
        var k = 0;
        var c = Math.sqrt(x * x + y * y);
        var SinK = y / c;
        var CosK = x / c;
        if (x == 0 && y > 0) {
            degree = pi / 2;
        } else if (x == 0 && y < 0) {
            degree = 3 * pi / 2;
        } else if (x > 0 && y == 0) {
            degree = 0;
        } else if (x < 0 && y == 0) {
            degree = pi;
        }

        if (c != 0) {
            if (y > 0) {
                degree = Math.acos(CosK);
            } else {
                degree = 2*pi - Math.acos(CosK);
            }
        }
        console.log(degree);
        return degree;
    }

    //判断canvas被点击，传送过来的x, y，是否在当前扇形区域内
    pie_chart.prototype.inArea = function(screen_x, screen_y) {
            var x = screen_x - this.options.centerPoint.x;
            var y = screen_y - this.options.centerPoint.y;
            var r = this.options.radius;
            if (x * x + y * y <= r * r && (getDegree(x, y) > this.options.startDegree && getDegree(x, y) < this.options.endDegree)) {

                return true;
            }
            return false;
        }
        //点击事件
    pie_chart.prototype.click = function(x, y) {
        if (this.inArea(x, y)) {
            this.clearPie();
            //对偏移的处理
            this.options.centerPoint.x += (this.options.out ? -1 : 1) * 10 * Math.cos((this.options.endDegree - this.options.startDegree) / 2 + this.options.startDegree);
            this.options.centerPoint.y += (this.options.out ? -1 : 1) * 10 * Math.sin((this.options.endDegree - this.options.startDegree) / 2 + this.options.startDegree);
            this.basicDraw(this.options.color);
            this.options.out = (this.options.out ? false : true);
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
            } else {
                this.basicDraw(this.options.color);
            }
        }
        //清空指定区域（这里需要改进白色为背景色）
    pie_chart.prototype.clearPie = function() {
        this.basicDraw("white");
    };


    return pie_chart;
})();


module.exports = pie_chart;
