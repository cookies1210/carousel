/**
 * Created by Administrator on 2017/5/18 0018.
 */
;(function($){
    var Carousel = function(posters){
        var self = this;
        /*������תľ�����*/
        this.posters = posters;
        this.poster_list = posters.find(".poster_list");
        this.poster_item = posters.find(".poster_item");
        this.first_item = this.poster_item.first();
        this.last_item = this.poster_item.last();
        this.prev_btn = posters.find(".poster_prev_btn");
        this.next_btn = posters.find(".poster_next_btn");

        /*Ĭ�����ò���*/
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
        alert(this.setvaricalAlign(1000));
    };
//����ԭ�ʹ������õĺ���
    Carousel.prototype ={
        /*�������ò���ȥ�趨�����Ŀ�ȸ߶�*/
        setSettingValue:function(){
            this.posters.css({
                width:this.setting.width,
                height:this.setting.height
            })
            this.poster_list.css({
                width:this.setting.width,
                height:this.setting.height
            })
        },
        /*���ð�ť��λ�ù�ϵ*/
        setBtn:function(){
            var bw = (this.setting.width-this.setting.posterwidth)/ 2,
                bh = this.setting.height
            this.prev_btn.css({
                width:bw,
                height:bh,
                left:0,
                top:0,
            })
            this.next_btn.css({
                width:bw,
                height:bh,
                right:0,
                top:0,
            })
            this.first_item.css({
                left:bw,
                zIndex:Math.floor(this.poster_item.size()/2),
            })
        },
        /*���õ�һ֡��λ�ù�ϵ*/
        /*设置垂直对齐方式*/
        setVerticalAlign:function(height){
            var top;

            if(this.setting.varicalAlign == "top"){
                top=0;
            }else if(this.setting.varicalAlign == "center"){
                top=(this.setting.height-height)/2;
            }else if(this.setting.varicalAlign == "bottom"){
                top = this.setting.height-height;
            }else{
                top=(this.setting.height-height)/2;
            }
            return top;
        },
        /*����ʣ��֡�Ļ���λ�ù�ϵ*/
        setSettingPosition:function(){

            var _this_ = this;
            var sliceItems = this.poster_item.slice(1),//��ȥ��һ��li֮�������li
                curSize = sliceItems.size()/ 2,//����li����
                rightItems = sliceItems.slice(0,curSize),//�ұ�����li
                rZindex = Math.floor(this.poster_item.size()/2),//�����ұ�li�Ĳ㼶��ϵ
                leftItems = sliceItems.slice(curSize)//�������li
            console.log(leftItems);
            //������������
            var rw = this.setting.posterwidth,
                rh = this.setting.posterheight,
                bw = (this.setting.width-this.setting.posterwidth)/ 2

            //�����ұ�λ�ù�ϵ
            rightItems.each(function(i){
                var j = i;
                rZindex--;
                rw = rw*_this_.setting.scale;
                rh = rh*_this_.setting.scale;
                var   lm = bw+_this_.setting.posterwidth+(bw/curSize)*(i+1)-rw;

                $(this).css({
                    width:rw,
                    height:rh,
                    zIndex:rZindex,
                    opacity:1/++i,
                    left:lm,
                    top:_this_.setVerticalAlign(rh),

                });
            });
            var lo = curSize;
            var lw = rightItems.last().width(),
                lh = rightItems.last().height();
            //������ߵ�λ�ù�ϵ
            leftItems.each(function(i){
                var j = i;
                var ll = i*(bw/curSize) ;
                $(this).css({
                    width:lw,
                    height:lh,
                    zIndex:i,
                    opacity:1/lo,
                    left:ll,
                    top:_this_.setVerticalAlign(lh),
                })
                lw=lw/_this_.setting.scale;
                lh=lh/_this_.setting.scale;
                lo--;
            })
        },
        /*��ȡ�˹����ò���*/
        getsetting:function(){
            var setting = this.posters.attr("data_setting");
            /*ת��Ϊjson����*/
            if(setting && setting!=""){
                return $.parseJSON(setting);
            }else{
                return {};
            }
        }
    }
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
