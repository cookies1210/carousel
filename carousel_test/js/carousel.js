 /**
 * Created by Administrator on 2017/5/18 0018.
 */
 ;(function($){
     var Carousel = function(posters){
         var self = this;
         /*保存旋转木马对象以及旋转木马下面的元素*/
         this.posters = posters;
         this.poster_list = posters.find(".poster_list");
         this.poster_item = posters.find(".poster_item");
         this.first_item = this.poster_item.first();
         this.last_item = this.poster_item.last();
         this.prev_btn = posters.find(".poster_prev_btn");
         this.next_btn = posters.find(".poster_next_btn");

         /*默认配置参数设置*/
         this.setting={
             "width":1000,
             "height":344,
             "posterwidth":680,
             "posterheight":344,
             "scale":0.9,
             "speed":500,
             "varicalAlign":"center"
         }
         $.extend(this.setting,this.getsetting());
         this.setSettingValue();
         this.setSettingPosition();
         this.setBtn();
         /*按钮点击*/
         this.prev_btn.click (function(){
             self.changeDir("left");
         })
         this.next_btn.click(function(){
             self.changeDir("right");
         })
         this.autoplayn();
         this.posters.hover(function(){
             window.clearInterval(self.timea);
         },function(){
             self.autoplayn();
         });
     };
/*原型里创建的函数是公用的*/
     Carousel.prototype = {
         /*设置旋转木马基本的宽高*/
         setSettingValue: function () {
             this.posters.css({
                 width: this.setting.width,
                 height: this.setting.height
             })
             this.poster_list.css({
                 width: this.setting.width,
                 height: this.setting.height
             })
         },
         /*设置按钮和第一帧的位置*/
         setBtn: function () {
             var bw = (this.setting.width - this.setting.posterwidth) / 2,
                 bh = this.setting.height
             this.prev_btn.css({
                 width: bw,
                 height: bh,
                 left: 0,
                 top: 0,
             })
             this.next_btn.css({
                 width: bw,
                 height: bh,
                 right: 0,
                 top: 0,
             })
             this.first_item.css({
                 left: bw,
                 zIndex: Math.floor(this.poster_item.size() / 2),
             })
         },
         /*设置垂直对齐方式*/
         setVerticalAlign: function (height) {
             var top;

             if (this.setting.varicalAlign == "top") {
                 top = 0;
             } else if (this.setting.varicalAlign == "center") {
                 top = (this.setting.height - height) / 2;
             } else if (this.setting.varicalAlign == "bottom") {
                 top = this.setting.height - height;
             } else {
                 top = (this.setting.height - height) / 2;
             }
             return top;
         },
         /*设置剩余帧的位置信息*/
         setSettingPosition: function () {

             var _this_ = this;
             var sliceItems = this.poster_item.slice(1),//��ȥ��һ��li֮�������li
                 curSize = sliceItems.size() / 2,//����li����
                 rightItems = sliceItems.slice(0, curSize),//�ұ�����li
                 rZindex = Math.floor(this.poster_item.size() / 2),//�����ұ�li�Ĳ㼶��ϵ
                 leftItems = sliceItems.slice(curSize)//�������li

             var rw = this.setting.posterwidth,
                 rh = this.setting.posterheight,
                 bw = (this.setting.width - this.setting.posterwidth) / 2

             /*右边的css信息设置*/
             rightItems.each(function (i) {
                 var j = i;
                 rZindex--;
                 rw = rw * _this_.setting.scale;
                 rh = rh * _this_.setting.scale;
                 var lm = bw + _this_.setting.posterwidth + (bw / curSize) * (i + 1) - rw;

                 $(this).css({
                     width: rw,
                     height: rh,
                     zIndex: rZindex,
                     opacity: 1 / ++i,
                     left: lm,
                     top: _this_.setVerticalAlign(rh),

                 });
             });
             var lo = curSize;
             var lw = rightItems.last().width(),
                 lh = rightItems.last().height();
             /*左边的css信息设置*/
             leftItems.each(function (i) {
                 var j = i;
                 var ll = i * (bw / curSize);
                 $(this).css({
                     width: lw,
                     height: lh,
                     zIndex: i,
                     opacity: 1 / lo,
                     left: ll,
                     top: _this_.setVerticalAlign(lh),
                 })
                 lw = lw / _this_.setting.scale;
                 lh = lh / _this_.setting.scale;
                 lo--;
             })
         },
         /*得到人工配置参数*/
         getsetting: function () {
             var setting = this.posters.attr("data_setting");
             /*转化为json格式*/
             if (setting && setting != "") {
                 return $.parseJSON(setting);
             } else {
                 return {};
             }
         },
         /*旋转*/
         changeDir: function (dir) {
             var self1 = this;
             var zIndexArr = [];

             if (dir == "left") {
                 this.poster_item.each(function () {
                     var self2 = $(this);
                     var curItem = self2.prev().get(0) ? self2.prev() : self1.last_item,
                         width = curItem.width(),
                         height = curItem.height(),
                         zindex = curItem.css("zIndex"),
                         opacity = curItem.css("opacity"),
                         left = curItem.css("left"),
                         top = curItem.css("top")
                     zIndexArr.push(zindex);
                     self2.animate({
                         width: width,
                         height: height,
                         /*zIndex:zindex,*/
                         opacity: opacity,
                         left: left,
                         top: top
                     },self1.setting.speed,function(){
                         self1.autoplay = true;
                     });
                 });
                 //zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
                 this.poster_item.each(function (i) {
                     $(this).css("zIndex", zIndexArr[i]);
                 });

             }
             else if (dir == "right") {
                 this.poster_item.each(function () {
                     var self2 = $(this);
                     var curItem = self2.next().get(0) ? self2.next() : self1.first_item,
                         width = curItem.width(),
                         height = curItem.height(),
                         zindex = curItem.css("zIndex"),
                         opacity = curItem.css("opacity"),
                         left = curItem.css("left"),
                         top = curItem.css("top")
                     zIndexArr.push(zindex);
                     self2.animate({
                         width: width,
                         height: height,
                         /*zIndex:zindex,*/
                         opacity: opacity,
                         left: left,
                         top: top
                     },self1.setting.speed,function(){
                         self1.autoplay = true;
                     });
                 });
                 //zIndex需要单独保存再设置，防止循环时候设置再取的时候值永远是最后一个的zindex
                 this.poster_item.each(function (i) {
                     $(this).css("zIndex", zIndexArr[i]);
                 });

             }
         },
         /*自动轮播*/
         autoplayn:function(){
             var self = this;
            if(this.setting.autoplay){

                this.timea = setInterval(function(){
                    self.changeDir("right");
                },self.setting.autospeed);
            }else{
                clearInterval(this.timea);
            }

         },
     };

    /*类的初始化*/
     Carousel.init = function(posters){
         var _this_ = this;
         posters.each(function(){
             new _this_($(this));
         });
     }
     window["Carousel"] = Carousel;
 })(jQuery);
 /*(function($){...})(jQuery)��������һЩ��ҪԤ�ȶ���õĺ���
  $(function(){ })����������DOM�������֮������\ִ����ЩԤ�ж���õĺ���.*/
