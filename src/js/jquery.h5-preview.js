(function ($) {

    /**
     * 并行加载指定的脚本
     * 并行加载[同步]同时加载，不管上个是否加载完成，直接加载全部
     * 全部加载完成后执行回调
     * @param {Array|String} scripts 指定要加载的脚本
     * @param {Function} callback 成功后回调的函数
     */
    var parallelLoadScripts = function parallelLoadScripts(scripts, callback) {
        if (typeof (scripts) !== 'object') {
            scripts = [{ "url": scripts, "id": randomWord(true, 5, 8) }];
        }
        var HEAD = document.getElementsByTagName('head')[0] || document.documentElement;
        var s = [];
        var loaded = 0;
        for (var i = 0; i < scripts.length; i++) {
            if (document.getElementById(scripts[i].name)) {
                loaded++;
                if (loaded === scripts.length && typeof (callback) === 'function') callback();
                continue;
            }

            s[i] = document.createElement('script');
            s[i].setAttribute('type', 'text/javascript');
            s[i].setAttribute('id', scripts[i].name);
            // 同步
            s[i].setAttribute('src', scripts[i].url);
            HEAD.appendChild(s[i]);

            // 异步
            s[i].onload = s[i].onreadystatechange = function () {
                if (! /*@cc_on!@*/ 0 || this.readyState === 'loaded' || this.readyState === 'complete') {
                    loaded++;
                    if (loaded === scripts.length && typeof (callback) === 'function') callback();
                }
            };

        }
    };

    //加载css样式
    var loadCssContent = function loadCssContent(renderTo, id, cssContent) {

        if (cssContent && cssContent !== '' && $(id).length === 0) {
            renderTo = (typeof renderTo == 'string') ? $(renderTo) : renderTo;
            var css = " <style id=\"" + id + "\" type=\"text/css\">";
            css += cssContent;
            css += "</style>";
            renderTo.append(css);
        }

    };

    //Js模拟休息
    var sleep = function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    };

    //查找对象在数组中的位置 jquery.inArray不能查找对象
    //没有返回-1，如果有返回第一次匹配到数组位置
    var objectInArray = function objectInArray(anObject, objectArr) {

        if ($.isArray(objectArr)) {
            for (var i = 0; i < objectArr.length; i++) {
                var isEquals = true;
                $.each(anObject, function (name, value) {
                    if (objectArr[i][name] != value) {
                        isEquals = false;
                        return;
                    }
                });

                if (isEquals) {
                    return i;
                }
            }
        }
        return -1;
    };

        /*
    ** randomWord 产生任意长度随机字母数字组合
    ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
    */
    var randomWord = function randomWord(randomFlag, min, max) {
        var str = "",
            range = min,
            arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        // 随机产生
        if (randomFlag) {
            range = Math.round(Math.random() * (max - min)) + min;
        }
        for (var i = 0; i < range; i++) {
            pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    };

    //默认参数
    var defaluts = {
        renderTo: null, //追加的位置
        id: null, /* 在页面中的唯一id，如果为null则自动生成随机id,一个id只会显示一个 */
        top: "200px", /* 窗口离顶部的距离,可以是百分比或像素(如 '100px')  0标识居中显示 */
        opacity: 0.5, /* 窗口隔离层的透明度,如果设置为0,则不显示隔离层 */
        //showType: 'fade', /* 窗口显示的类型,可选值有:show、fade、slide、fly */
        //showSpeed: 1000, /* 窗口显示的速度,可选值有:'slow'、'fast'、表示毫秒的整数 */
        showClose: true, /* 是否显示窗口右上角的关闭按钮 */
        draggable: false, /* 是否可以拖动窗口 */
        data: {
            id: "",
            url: 'http://h5.deiyoudian.com/jycccc'
        }, /*数据*/
        showPage: false, //是否展示分页
        pageData: [], //翻页数据
        width: 800, /* 窗口的宽度，值为'auto'或表示像素的整数 */
        height: 710, /* 窗口的高度，值为'auto'或表示像素的整数 */
        buttons: [{
            text: "复制链接",
            className: "primary", //系统默认样式
            style: "", //自定义样式
            autoClose: false,
            initFunc: function (self) { //初始化事件
                if (self) {
                    self.attr("id", randomWord(true,5,8)); //设置名称
                    self.attr("data-clipboard-text", "hello preview!");

                    parallelLoadScripts([{ "name": "clipboard", "url": "https://cdn.bootcss.com/clipboard.js/2.0.1/clipboard.js" }], function () {
                        var clipboard = new ClipboardJS("#" + self.attr("id"), { //先实例化
                            // 点击copy按钮，直接通过text直接返回复印的内容
                            text: function () {
                                sleep(300);
                                return self.attr("data-clipboard-text");

                            }
                        });

                        clipboard.on('success', function (e) {
                            alert('复制成功');　　//复制成功区间
                        });

                        clipboard.on('error', function (e) {

                        });
                    });
                }
            },
            clickFunc: function (self, data) { //点击事件

                if (data.url && self) {
                    self.attr("data-clipboard-text", data.url);
                }
            }
        }], /* 窗口的按钮 */
        closed: function (data) { } /* 窗口关闭后执行的函数 */
    };

    $.extend($, {
        preview: function (setting) {
            var ps = $.extend(defaluts, setting);

            if (ps.data === null || ps.data.url === null || ps.data.url === undefined) {
                alert('data参数错误，无法预览');
            }

            var css = ".preview-modal-mask{position:fixed;top:0;bottom:0;left:0;right:0;background-color:rgba(55,55,55);height:100%;z-index:1000;display:none;}.preview-modal-wrap{position:fixed;overflow:auto;top:0;right:0;bottom:0;left:0;z-index:1000;-webkit-overflow-scrolling:touch;outline:0}.preview-modal-wrap *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}.page-maskingLayer .close::after,.page-maskingLayer .close::before{content:'';position:absolute;height:2px;width:100%;top:50%;left:0;margin-top:-1px;background:#000}.page-maskingLayer .close.rounded::after,.page-maskingLayer .close.rounded::before{border-radius:5px}.page-maskingLayer .close::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg)}.page-maskingLayer .close::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg)}.preview-modal{width:auto;margin:0 auto;position:relative;outline:0;top:100px}.preview-modal-content{position:relative;background-color:#fff;border:0;border-radius:6px;background-clip:padding-box;height:100%;box-shadow:0 4px 12px rgba(0,0,0,.15)}.preview-modal-close{z-index:1;font-size:12px;position:absolute;right:20px;top:15px;overflow:hidden;cursor:pointer;width: 20px;height: 20px;display:none;}.page-maskingLayer .preview-modal-body{padding:0;height:100%}.preview-modal-body{padding:16px;font-size:12px;line-height:1.5}.page-maskingLayer .maskingLayer_div .lf{background:#f4f4f4;position:relative;width:50%;height:100%;float:left}.page-maskingLayer .maskingLayer_div .lf .arrow{position:absolute;top:50%;width:2rem;height:2rem;border-top:.3rem solid #dcdcdc;border-right:.3rem solid #dcdcdc;box-shadow:0 0 0 #d3d3d3;-webkit-transition:all .2s ease;transition:all .2s ease;display:none}.page-maskingLayer .maskingLayer_div .lf .arrow.left{left:25px;-webkit-transform:translate3d(0,-50%,0) rotate(-135deg);transform:translate3d(0,-50%,0) rotate(-135deg)}.page-maskingLayer .maskingLayer_div .lf .arrow.right{right:25px;-webkit-transform:translate3d(0,-50%,0) rotate(45deg);transform:translate3d(0,-50%,0) rotate(45deg)}.page-maskingLayer .maskingLayer_div .lf .arrow:hover{border-top: 0.3rem solid #bfbfbf; border-right: 0.3rem solid #bfbfbf;}.page-maskingLayer .maskingLayer_div .lf .wechat-head{width:350px;height:60px;background:url('data:image/png;base64,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Us2bN1dCQoIGDRqkxo0b37WrkYaEhOiTTz7R1q1b09y3SJEi6tatm8f68t577+nNN99UmTJlFBsTo9atW6dZWmjEiBHG5/bkU0+TO3zosFq1flnbtm7TI488om3bttmNJvOEr776yvg79fb21nfffWcXqElSvnz59Mwzz2jvnj16JiBAv/32myRpyJAhatWqVartT58+3fhZS5curY0bN9rVUStTpoz69eun0qVLq1OnTpKkkydPauPGjQ73NHv27DG+7tixo12g89prrxn/TpLv58yePXuM2VudOnVSixYtUt0/M3bu/N5jbed2OS5oW7FiRZqvZ3XQ1rZtW6NeWGpCQ0ONFVA7duzoVkH5o0eP6ssvv8x0H7NbWFiYw4g8Z094fv75Z82ZM8ftdp3dGBUvXtztoE2S0/8PHTt2SNcbT8eOHY0nHSm1adMmXT9Tdtu2bZvWrFkjKXFY+4QJE1KtX+fKmDFjjEDUr6Sf1q1dZxRUdSVv3rzq0aOH8ufPr379+klKrC20bt06u9WTAMAsLVq2dFi1++l6T6tjh47pmnpy69Yth6kdAQEBWr16tcMCL4899piWLVuul19+Wbt27TK2r1+/XtOnT3c6yiE0NFSdO3fWqVOJD74aNWqkb775xuWIiD///NMY/Z2kYcOGWrhwgV2N0TJlyuiLL77QCy++oNCjocb2+fPna+DAgbr//vudtr19+3a7baNHj3Y6Uq1Zs2ayWCwOU6R++OEHgjbgHjB79mwjSB8xYoTLkWxTp06VxWLRxIkT1el/n+m+WLlSo0aN0rRp01S3bl0FBQXZHdewYUONGDFCEyZMkNVq1ezZs+0e4mY3m82m7du3a9q0afrxxx/dPq5v375O31vNUqxYMWNK55ChQ02t33340GENGTJEn332mUqXLm1au64kH/E4ZswYh5AtOa8CBTRjxgw1bdpUknT58mVdvnxZJUuWdLr/2bNnjRDPYrFo/fr1LhcraNmypcaMGaNx48ZJkubOm+sQtJ08edJoq0GDBnav+fj4qE6dOjpw4IAuX76sW7duOf0duHHjht58801JicHfRx995PLnNUNumS7qrqioKLfq+7sjxwVtaQ1tzI6hj02aNDES7tSsW7fOCNoCAwPdWgzhm2++yVTQtnjxYpe13fbv369PP/1UkvTuu+/q6aefdrqfGQXpJ0yY4NZ+hQoVcrmi282bN43ReX5+fi6foJhRZPn27TvpeuNJSEhwuf+dO3cy3Z+sEh0dbYwmkxI/PGXkzebQoUN2y5VPnjg5zZAtuc6dO2vbtm3G6MaVK1cStAHwiOSjvi0Wi0aNGqX33ntP+/c7TiHNkyePy3YWL15sN2qrYMGC+uqrr1yuopwvXz4NHTrUoVbLoUOHVLduXYf9586da4RsUuIK4Fu2bHE5bWf27NkOIxI+//xzu5AtSaFChTR3zly7G+TIyEgtW7ZMffr0cdg/ZTDp4+NjV24gpcDAQFWsWNG4CZESS3AAyNni4uKMGUV+fn52nyGTSxqpO3HiRIdSOpI0fPhwzZw50yFokxKnWC5YsEDh4eGaO3euhgwZovz585v9o6RLfHy8vv76a02fPt2Y3ucub29v9erVy0M9s7dv3z4tXrzY9HaXLl2q9u3bOw1VzWSz2eweRrmzGNGTTz4pLy8v42H/kSNHXAZtCxYsML5+/vlGaZb/6d69u7FQ0v6Q/Tp69Kjd/U3SveCDDz6oAgUKOByfvJ7dnTt3nAZtQ4cONcpPzJ8/327RAnjevHnzFBQUlOHSVMnluKAN6ZPaktHJ66rUrl3bKNSYnbp27aquXbs6fW3ZsmXGBXnPnj0ZXro5PWo/UVvTpzkuknD48GENHDhQUmINgKSCoMn16tXL7qYiJxg7dqyxZHenTp3UuHHjDLWT/Gmjv7+/wxMfdwwaNMgI2nbt2pXqEykAyKyyZctq8eLFeuKJJ9J9bFxcrD6d+andtvbt26f54CcgIEBHjhxx6xx79+51us1Z0Hbr1i27GwgpcWRIatfNGjVqqHz58nZh3meffeY0aEvZ5+rVq6dZa8jf39/umphUbwdAzrVz506jyH+vXr1cPpxPWtCsk5OHpp06dtTw4cPtFj1L7r777lOvXr00fvx4RUZGaufOnU4Duaxw69YtLVmyRDNmzDA+L6dXt27d5Ovra3LPnEsafeUJY8eO1c6dOz3WvpQYtK1bt05S4oMuZ3VFU8qbN69d0OZqwEBsTIxdaaJ27V5Ns21fX189/3wj7diR+HMvWLDArtxD+fLldfLkSUVGRurIkSOqWbOm8Vp8fLyxMJyPj4+KFi3q0P6mTZuMkej9+/fXM888k2afYK7Y2Fijtl9mwzaCNmSJTz75xKGGWWBgoMtVW5yx2WzG1/c5eUrgCYUKFnJ603Xz5k3j6ypVqjgtbu3JIeGe8N///lfz5s2TlHghmTRpUobauXr1qt1qRqNGjcpQ0cnatWsrJCTEGJGR0/4+AeQMefLkUdeuXTVlyhSXo8/Scvz4CYVfDrfb9sYbb5jRPcOrr77q8L786qvObwzOnDnjMML/lVdeSfMcrVu3tiu/cf78eV2LjFTh/xUkT9K9e3e7ByjujCT/7dhvdt8/+ug/0jwGwN3t++//v8xKag9Vk0b6pHwvSb4ttZkkbdq00fjx441zZnXQZrVaNX/+fM2ZM8dh9dD0sFgsevvtt03smWuhoaHpWl00vX788UeHEV1my5cvX7offp07d87u+udqlNr53383RrRbLBa3B5y88kobI2hLObq7atWqxlTXnTt32gVt//3vf41+OQtw/vrrL+N3w9/fX+PcWDABnrN161Y9+uijmZopl61BW2xMjEaNHq0VK1bY/YPw8fFRx44dNXHiBKdTHJDzFC1a1GFKaHpX2omKijK+LpjO6YxRUVGpptLDhw83aoLlRvHx8erfv7/x/bRp05w+aXHH6dOnja8tFkumViNyp44hAGTGvHnzXJZOcFfK6Z++vr52719nz57Vhg0bdPbsWV27dk2VKlVS1apVVaNGDbcWNZASR4tcvXpVX375pYoXL67u3bu7vAFxtuqpO1N8GjRo4FDn9uIffzjcHCev/+OOs2fP6lSY/aJKjz9ew+3jAdydkqaA+5X0c7oAglnKlSsnv5J+Cr8cnqXTzi9cuKBZs2ZpyZIlptSyevXVV53OgvEEZ4vLmW39+vUeDdoyIimQlRIXsXM1evDy5cvG12XKlnF7imby+8mUoxr79u2rOXPmKDo62iib9PTTT+vs2bN2owtHjBjh0O7bb78tq9Uqi8WihQsXyiuLBpXAudjYWB08eFDPPfdchtvI1qDN1Qqi169fN4rHe7oAIHKOa9euSUpcvTK9Id3ff/+d6hMoV3XUwsLCnL4ZJr+JmT59urH8eHJ//PFHuvqYnWbNmmUsRx0YGJihqZ5Jkgdtjz76aJYtoQwAGZGekO3vv/92uj1l0Fbq4cQHS1arVW+/3d9uddGUevbsqfHjx6f51NTX11cff/yxJk2alGZ9ImfTMh966KFUj3G1z4ULFzL90CPlogxS4orWAHK2pFWWq/hXcWt/m83m8Lkw+YyV5NvmzJljV0PTu0Di6vOhoaF2o3t9fHzs6r6Z4dixY5o+bZq+XrPG6eqbGfXee++Z1lZafvjhB4+fw5Mj5tLr1q1bmjhxorGgm5+fnz744AOX+ye/TyterLjb50n+kCk8PFzx8fHGfWmxYsU0ffp09e3bVwkJCU6n7vbs2dMhvFm2bJkxEm706NGqUYMHUXeDsLCwnBu0pbWC6PLlywnaTLBkyRKnH7pPnDhhfL127VqFhoY67PPII494dPnp9Ei62DoLtdLi7X2f0wUZxowZk+oF9NKlSw6ryKXk7AYiJzl//rzxd+Pt7a1p06Zlqr3k9X0effTRTLUFADlBymtsqZKl9Pvvv+vFF190OrosuYULF2rHjh1asmSJnnzyyTTP5U4RcGcPetypCeQsaEur/2nZs2ePpkyZYretS5cu+sc/mDoK5HRJD8FTe39JHqr7+Pik2l6PHj20ePFi5c2bV0888YSaNWtmV1NaSpxiOnnyZEmJD9+//fbbjHbfQUhIiKZPn65t27aZ1maSoKAgVa5c2fR2XQkLC7snzuHM2rVrdePGDUmJq3SePHlSO3bsMEapVateTau/Wp3qqqjJR6OlZ4R2yuvkX3/9ZTdrq0OHDqpevbpGjx6tw4cPKzIyUt7e3qpcpbIGvjdQrVq1sjv+3LlzxordderUSXVhIWStzEwTl7I5aLsbVxC9Fy1btkwHDhxIdZ+kon8p1alT5+4J2v53MS/0YPpXwcyf38vpSkgffvhhqr9nfn5+CgwMdNh+6dIl7dixQ5LUqlUrFS5c2GGfjRs3ZvofaFYYNGiQ8SFm1KhRmb75ST6irUyZMplqCwBygpQj2kqUKKHevXvbhVTFihVT8eLFFRYW5nDjeP78eXXq1EkHDx40ZVn5lMFfkSJF3Bpd7OxmOTOjs48fP+6wYnTFihV5iArkIslXoXdn36RVMp9++mmtXr1abdq0cfpQ3GKxaPXq1Zme+p9cvXr10tXflFJ7/87K0WySFBER4fI1Z7N1MlJ4P7VzeNLYsWN17tw5h+0FCxbUokWLFBgYmOY1L3nQ5s6I7yT33XefvL29janEly5dciiPVK1aNa1fv16SdC0yUg/6+Djtj81mU+/evXX79m15e3trwYIF6Z61hbsX/ydzgUqVKikuLs5he2RkpM6fPy8pceSRs5FiaS1z7K7Jkyc7rICWdO7kypYtq/j4eKdtJD25OBV2Ks0w6NChQ+l6OuGKv7+/0xFtu3fvNoK2f/7zn04XQ/jll1/u+qBtw4YN2r59u6TERR3MGHpvtVqNr92p89a2bVu36m0MGDDA5bLxAJCdUtZpWbFihXFj2LZtW02cONH4IG6z2bRnzx7179/fbkGgS5cuafTo0ZoxY0am+5O8pqmUOFrZHc5WDEwasZJev//+u5q3bG53HfT29taKFSsyvOgEgLtL4cKFZbVa7T77malx48ZaunSpXn/9dYfXli5dqsaNG3vkvGZ7ut7TqlevXnZ3wzBy5Mjs7oJHREdHq1+/fmrevLkGDBigChUquNw3+XUyvdekggULGkFb8unNzjhbACTJzJkzjem3H374oUfrHCL9MjKLLjnTgra4uFiNGjVay5cvtxshVLBgQb3++uuaNGkiCxtkk6R6dymtW7dOXbp0kZRYOLJ169aSEuebHzt2LFNzklM6fvy4W/tdvXrVrVoIaQVYzuo9wN7Nmzc1ZMgQ4/uZM2ea8hQleWFvZ1OWU7Jarbpy5Uqa+6W8cQSAu0WBFEWLk65jI0aMcLihyZs3rwICArR//341bNjQburN4sWL1bdvX/n7+2eqPyVKlLD73t2HPs5CtZRP6t3xxx/9mPylAAAgAElEQVR/qFmzZnYrsXp5eembb77J0qlTADyrbNmyslqt+u34b2nvnEGtWrXSnDlz1LdvX2Pb7NmzHabg3c0Gvjcwy8/50EMPKTw83Olrye+Tko+0Su/9U3pGgplp5syZunnzpqTEOtvnzp1TWFiY1qxZI6vVqqVLl2r16tWaM2eOy7rTfn5+xtdXr15N1/mT75+8nfQIDQ3V2P+tLNq0aROHuqU2m03btm3TL7/8orCwMJUuXVrVqlVTy5YtnT4Ug/lSC2rdYVrQNmrUaKeBTnR0tLHgQcqVrO4V77zzjjG3OjXJp4r07NnTrVUuU04v8bSQkBC98MILslgs2r9/f6Y/7CepX7++Q72uTZs2OUzb7Nevn9Og7datW1qyZInx/SOPPKIWLVq4PN/999+fuQ7/z40bN/Tjjz86bP/tt///QHHkyBGnNzFJF4C71YcffmjUMujcubPq1q1rSrvJn8Y4G9adUsmSJVyuwBQREWHKKk8A4EnOViurXLmy3cOMlO6//3599tlnevHFF+22Hz58ONPX3pSjvm/fvq07d+6k+eHc2aiUhx9+OF3nvnTpkoKCguze/y0Wi7788ku3Vj4FkHPUrl1bBw4cUPjlcJ0+fdpjI3Jef/11Xb9+XcOHD9fkyZPVuXNnj5zHE/z9/R3e57NChQoVXAZtadXKS885skOjRo2cbh87dqyGDh2q9evX6/bt2+rWrZsqVqzodGXUkiVLGl+nZwrs9evX7e5VUz7YckdcXKx69uyphIQEFSlSRLNn22coFy9eVO8+vbV7126HYytWrKhFixapZs2a6T4v3Ofl5eVW3dzUmBa0LV++PNXXv/zyy3s2aIuNjU13IJaRY7JCvXr1VL9+fe3bt0+DBw/W5s2uV0pLj969e+uVV16x21a7dm2HIprJVxFKbuvWrXZB240bNzRhwgS3ikJnxk8//aQmTZqkuk/37t092gdPOH78uGbNmiUp8WKb2qo86ZXeoG3lyi9dvta5c2ejxoFZHwoAwGzOphc0b948zWtU/fr15evraxdw/frrr5nuj7NwLCIiItXC0En7pJTWMcklhWzJp8RaLBYtXbpUL7zwgtvtAMgZGjdurHnz5klKLFA/dOhQj53rrbfeUu3ate+qKZjuGDhwoFs1Ms1Wv3597dmzx6PnyEhdN08qWbKkFi9erIsXL+rgwYOSpMGDBxtlcpJLfp3868pfbp8j+XXSYrFkaFTf+PETjGv9jBkz7MI6m82mjh076qeffpKUOKq8du1aOnXqtI4fP66TJ0/q5Zdf1i+//MK9kQcFBQWluRp8WkwL2tJauCCt+cs52bPPPutWLbMzZ85o586dkqQmTZqobNmy6Tomq3z44YcKCAjQrl27tGHDhrtiaPZ3330nKTFd9vHx0ZUrV7Rr1640Q7DMcvUGGhsba4xi8/X1dTrlMiIiwtQlwc00aPAgo28DBgxQPotF11KZWpQ8FL5586b++uv/L0gPPfSQ3QeI5EFbeHi4rl+/nuELQfIpx1WquLd0PABkNWfvT+5OkaxcubLdzdCxY8dS3f/69et64IEHUp3q7ywcu3DhQpqhmbOFD9wd0Xb58mUFBQXpzJkzxrakkO1u+BwBwHxNmjRRkSJFFBkZqfnz5+udd97x6LS2nBaylSpVSu3atcuWc7/88sseX3imZcuWHm0/I/Lnz68xY8YYM5/27dunmzdvOtRhSx5u/RXuftCWvNxNeh5EJQkJCdEnn3wiSXr11VeN0k1JVq5caYRsgYGBWrnyC6P81qhRozRz5kxZrVZNmTLF5QAVZJyXl5eCgoJUtWrVTLfFYggm6NChgzp16pTmfuvWrTNCsy5dujj8w3Lmm2++yfKgrVatWurQoYO+/PJL/fvf/74rPiAnLTzwwgtNVaZMWc2aNUtfrVrl8aCtYcOGTkf17d69W82aNZOUGAI6WwzhmWee0c8//+zR/mXU/pD9xtcffPBBuka0ffLJJ8YFQpJOnTplV5+gTJkyslgsRpA3Z84cDR8+PN19jIuLtRvxaMYbHgB4Qu3atR22uTsVJWX9SVfTUC5fvqyRI0dq48aN8vHxUZcuXYz6Lik5+/C/ZcuWNG9Sv/32W7faSunPP//USy+95BCyrVixQs2bN0/zeAA5U/78+dWnTx9NnjxZ4eHhmjFjhoYNG2bqOWw2W7aMCDPDgAEDsm0VyerVq6tu3bpOS+CYoX79+qpWrZpH2s6slNMqw8LCHLYlrz968eJFnT17VmXKlEmz7R9++MH4umSpkqns6Sg6Olpvvvlm4rElS2ratGkO+yQffdezZ0+7Gvf9+vXTzJkzJSXeGxO0ma93796mrP4uEbRlmLe3t8pXKC/JeW0WsxQqVMg4j7urhiWZPXu2bt265fL10NBQ4+sNGzbo9OnTdudt06aNHnnkEU2dOlVeXl5655130tl79127dk1btmxR2zZt5JWiqHRoaKixQukrr7RRxYoVNWvWLK366isNHDSIwsp3mfvuu0/du3fXwoULJSUOie7Tp48KFy6crnZ27dpthHU+Pj4ZqoEAAFmhVq1a8vb2tqspefTo0TSPi4uLs7sWS3JaS0ZKfGixZs0aSYlP1KdNm6YmTZo4rXtWpkwZVa1a1W4a6rp16zR+/HiXfYmNidGWLVvstjVp0iTN0Snh4eEKeilIp06dMrZZLBatWrVKgYGBqR4LIOfr16+f5s+fL6vVqsmTJ6tBgwZ270vt2rXT119/7VZbKUd/HTx4UEOGDNHatWvdWsn+blKkSBF169YtW/swduxYBQUFeaTtMWPGeKTd5P7zn/8YA07q1q2ban3u5FKGmzExMQ77PPLII/L39zdmz6xdu9atmutJ12FJatqkqVv9STJixAjjnnbevHlO742SBhlYLBaH6/vDDz+s8hXK61TYKYWFhZkSQqf87JLbmRWySQRtGVa9enX9dPgnj5+nadOm+qlpxs4zffp0l0UwU1q7dq3Wrl3rdLuUuHqsp4K2LVu2aO3atUpISFDz5s0dgrak2n5JQzkLFiyoGjVq6JdfftH7779v94Z3N7lz5052d8GlgICAdPUvLCzM+F169NFH7RYvKODluJrwyJEjtWrVKkVHRys6OlozZ87UP//5T7fPFxUVZff7ZuYKuABgtgceeECvvfaaXS3Rr776Su+++67TEc9JPv30U4cSA66CtqR6lclt3LjR5QID7777rvHkXJLOnz+v4OBgl0Wkv16zxqEMyIABA1z2XfpfyBYUpFNh/x+yeXl5adWqVWraNH03IABypsKFC2vq1Knq3r27EhIS1LFjRwUHBxulRBYvXqzFixenu93Tp0+rffv2Cg8PV/MWzfWffwc73CPczfr27Wva4mwZ1bBhQ3Xt2lVLly41td0ePXqofv36prbpTExMjGbMmCEpscyCu0Fb8hlFFotFNWrUcLpf79699d5770lKDNDSCtpOnjxpLIhnsVjUtWtXt/oj2dcb79Onj8trcVJpooeKP+Qw3VWSyjz2mE6FnVJCQoJu3bqV6TpiTZo01qZN5tRkhz2CtntYcb/iprWV2WKLCQkJ+uWXXxQSEqL9+/dr3759xoqXqdX3O3bsmL755htJiU+5kt5Mxo0bp5dfflnbt2/Xzp07PT6F1B179+6VxWKRt7e3fvnlF+MJiTvDkLPaunXr0rX/22+/bVwcOnfunOa0gGLFimnQoEEaN26cpMSw9P7773frSVF8fLzee+89XbhwQVJiyOvpGhMAkFm9e/e2C9piYxNXFVu9erXTEbk7duzQxIkT7baVLl3a6TRUKfHB2/z58+22pXbta9OmjcaMGaNLly4Z27p27arvv//eYaW4gwcPOjxMq1GjRqoPOcLDw/XSSy/ZTfH38vLS119/reeff97lcQDuPW3bttWePXu0aNEiRUZGqlGjRlq5cmWGVxo+cOCAOnToYDzkrfd0vRwVsnl7e6tXr17Z3Q1JiZ/Bj4Ye1eFDh01pr06dOvo4iz6X169f3yhHc+zYMW3bti3NkdLx8fH68MMPje9r1KzhcmR2+/bt9f777ys6Olq//vqrvvjiC5floOLj4/X+++8b37/yyit2pXNSExERobfeektS4kqtqZXsKVu2rC5duqTwy+EO01nj4+MV8r/yP76+vhkO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');background-position:50%;background-size:100%;border-bottom:1px solid #e5e5e5;position:absolute;left:50px;top:20px}.page-maskingLayer .maskingLayer_iframe{width:350px;height:606px;position:absolute;left:50px;top:80px;z-index:2;border-radius:5px;z-index:1001}.page-maskingLayer .maskingLayer_div{height:100%;}.page-maskingLayer .maskingLayer_div .lr{width:50%;height:100%;background:#fff;float:left}.page-maskingLayer.has-pageing .maskingLayer_div .lf{width:60%}.page-maskingLayer.has-pageing .maskingLayer_div .lr{width:40%}.page-maskingLayer .maskingLayer_div .lr .con{width:80%;position:relative;top:40%;margin:auto;-webkit-transform:translateY(-40%);transform:translateY(-40%)}.page-maskingLayer .maskingLayer_div .lr .link-qrcode{width:210px;height:210px;margin:auto;}.page-maskingLayer .maskingLayer_div .lr .link-qrcode .qrcode{width:100%;height:100%}.page-maskingLayer .maskingLayer_div .lr .con .btns{text-align:center}.page-maskingLayer .maskingLayer_div .lr .con .btns button{margin:5px}.page-maskingLayer .maskingLayer_div .lr .con .link-txt{background-color:#f5f7f9;min-width:210px;margin: 25px auto 10px;text-align:center;min-height:28px;line-height:28px;padding-left:8px;padding-right:8px;overflow:hidden;text-overflow:ellipsis;font-family:MicrosoftYaHei;font-weight:400;word-break:break-all}.preview-btn.primary{color:#fff;background-color:#2d8cf0;border-color:#2d8cf0}.preview-btn{display:inline-block;margin-bottom:0;font-weight:400;text-align:center;touch-action:manipulation;cursor:pointer;background-image:none;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;padding:5px 15px 6px;font-size:12px;border-radius:4px;transition:color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;color:#515a6e;background-color:#fff;border:1px solid #dcdee2}.text-center{text-align:center;}";

            if (ps.renderTo) {  //追加位置
                ps.renderTo = (typeof ps.renderTo == 'string' ? $(ps.renderTo) : ps.renderTo);
            }
            else {
                ps.renderTo = $(document.body);
            }

            //加载css样式
            loadCssContent(ps.renderTo, "h5-preview", css);

            ps.id = ps.id == null ? randomWord(true, 5, 8) : ps.id;
            var $preview_window = $("" + ps.id + "");
            if ($preview_window.length < 1) {
                $preview_window = $("<div id='" + ps.id + "' class='page-maskingLayer v-transfer-dom " + (ps.showPage == true ? "has-pageing" : "") + "'><div class='preview-modal-mask'></div><div class='preview-modal-wrap'><div class='preview-modal'><div class='preview-modal-content'><a class='preview-modal-close'><i class='close rounded'></i></a><div class='preview-modal-body'><div class='maskingLayer_div clearfix'><div class='lf'><a href='javascript:void(0)' title='上一个' class='arrow left'></a><a href='javascript:void(0)' title='下一个' class='arrow right'></a><div class='wechat-head'></div><div class='maskingLayer_iframe'></div></div><div class='lr'><div class='con'><div class='link-qrcode'><div class='qrcode-preview' style='width:210px;height:210px;'></div><div class='text-center'>请使用手机扫码查看</div></div><div class='link-txt'></div><div class='btns text-center'></div></div></div></div></div></div></div></div></div>").appendTo(ps.renderTo);
            }

            var $preview_window_modal = $preview_window.find(".preview-modal");

            if (ps.opacity > 0) { //遮罩层
                $preview_window.find(".preview-modal-mask").css("opacity", ps.opacity).show();
            }

            if (ps.showClose) { //关闭按钮
                $preview_window.find(".preview-modal-close").show();
                $preview_window.find(".preview-modal-close").on("click", function () {

                    closeWindow();
                    if (typeof (ps.closed) === 'function') {
                        ps.closed(ps.data);
                    }
                });
            }

            if (ps.width > 0) { //宽度
                $preview_window_modal.css("width", ps.width + "px");
            }

            if (ps.height > 0) { //高度
                $preview_window_modal.css("height", ps.height + "px");
            }

            if (ps.top == "") //居中
            {
                ps.top = (document.documentElement.clientHeight - ps.height) / 2 + $(document).scrollTop() + "px";
            }
            $preview_window.css({ "left": (($(document).width() - ps.width) / 2) + "px", "top": ps.top + "px" });

            //显示网址和二维码
            if (ps.data) {
                previewUrlAndQrcode();
            }

            if (ps.buttons.length > 0) { //要显示的button

                //输出按钮
                $.each(ps.buttons, function () {
                    var $this = $(this);
                    var $btn = $("<button type='button' class='preview-btn " + printText($this.attr("className")) + "' style='" + printText($this.attr("style")) + "'><span>" + printText($this.attr("text")) + "</span></button>").appendTo($preview_window.find(".lr .con .btns"));

                    if (typeof ($this.attr("initFunc")) == 'function') {
                        $this.attr("initFunc")($btn);
                    }

                    $btn.click(function () {
                        if (typeof ($this.attr("autoClose")) != 'undefined' && $this.attr("autoClose") == true) {
                            closeWindow();
                        }

                        if (typeof ($this.attr("clickFunc")) == 'function') {
                            $this.attr("clickFunc")($btn, ps.data);
                        }
                    });
                });
            }

            //计算左侧预览区域位置
            var left = (($preview_window_modal.find(".lf").width() - $preview_window_modal.find(".wechat-head").width())) / 2 + "px";
            $preview_window_modal.find(".wechat-head").css("left", left);
            $preview_window_modal.find(".maskingLayer_iframe").css("left", left);
            $preview_window_modal.find(".maskingLayer_iframe").css("height", ($preview_window_modal.find(".lf").height() - 104) + "px");

            //显示上一条/下一条
            if (ps.showPage) {
                var i = objectInArray(ps.data, ps.pageData);
                $preview_window_modal.find(".lf .arrow").fadeIn(2000);

                //注册事件
                $preview_window_modal.find(".lf .arrow.left").click(function () {
                    if (i === -1) {
                        ps.pageData.push(ps.data);
                        i = ps.pageData.length - 1;
                    }
                    else {
                        i--;
                    }

                    if (i < 0) {
                        i = ps.pageData.length - 1;
                    }
                    ps.data = ps.pageData[i];
                    previewUrlAndQrcode();
                });

                $preview_window_modal.find(".lf .arrow.right").click(function () {
                    if (i === -1) {
                        ps.pageData.push(ps.data);
                        i = 0;
                    }
                    else {
                        i++;
                    }

                    if (i >= ps.pageData.length) {
                        i = 0;
                    }

                    ps.data = ps.pageData[i];
                    previewUrlAndQrcode();
                });
            }

            //自由拖动
            if (ps.draggable) {
                var bDrag = false;
                var disX = disY = 0;
                var oH2 = $preview_window_modal[0]; //将JQ抓换成Dom对象
                var oWin = $preview_window_modal[0];
                oH2.style.cursor = "move";
                oH2.onmousedown = function (event) {
                    var event = event || window.event;
                    bDrag = true;
                    disX = event.clientX - oWin.offsetLeft;
                    disY = event.clientY - oWin.offsetTop;
                    this.setCapture && this.setCapture();
                    return false
                };
                document.onmousemove = function (event) {
                    if (!bDrag) return;
                    var event = event || window.event;
                    var iL = event.clientX - disX;
                    var iT = event.clientY - disY;
                    var maxL = document.documentElement.clientWidth - oWin.offsetWidth;
                    var maxT = document.documentElement.clientHeight - oWin.offsetHeight;
                    iL = iL < 0 ? 0 : iL;
                    iL = iL > maxL ? maxL : iL;
                    iT = iT < 0 ? 0 : iT;
                    iT = iT > maxT ? maxT : iT;

                    oWin.style.marginTop = oWin.style.marginLeft = 0;
                    oWin.style.left = iL + "px";
                    oWin.style.top = iT + "px";
                    return false
                };
                document.onmouseup = window.onblur = oH2.onlosecapture = function () {
                    bDrag = false;
                    oH2.releaseCapture && oH2.releaseCapture();
                };
            }

            $preview_window.fadeIn(ps.showSpeed);

            return ps.id;

            //预览地址和qrcode
            function previewUrlAndQrcode() {
                $preview_window_modal.find(".maskingLayer_iframe").empty().html("<iframe src='" + ps.data.url + "' frameborder='0' width='100%' height='100%'></iframe>");

                $preview_window_modal.find(".link-txt").text(ps.data.url);
                parallelLoadScripts([{ "name": "jquery-qrcode", "url": "https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js" }], function () {
                    $preview_window.find('.link-qrcode .qrcode-preview').empty().qrcode({
                        render: "canvas", //table方式
                        width: 210, //宽度
                        height: 200, //高度
                        text: ps.data.url
                    });
                });

            }

            //关闭窗口
            function closeWindow() {
                $preview_window.hide();

                $preview_window.find(".preview-modal-mask").hide();
                $preview_window_modal.find(".lf .arrow").hide().unbind("click");
                $preview_window.find(".lr .con .btns").empty();
                $preview_window.find(".preview-modal-close").hide().unbind("click");
                $preview_window_modal.find(".maskingLayer_iframe").empty();
            }

            function printText(text) {
                if (text != undefined) {
                    return text;
                }
                return "";
            }
        }

    });
})(jQuery);