# h5-preview
a jquery plugin with preview the h5 page and automatically generate a preview QR code

# Setup

First, include the script located on the js folder or load it from a third-party CDN provider.

	 <script src="js/jquery.js"></script>
     <script src="js/jquery.h5-preview.js"></script>
	 

Now,use it

     $.preview({
         data: 
		 {
             "id": 'h5-preview1',
             "url": 'http://h5.xianshengstore.com/sanquan2018'
         }
     });
					
					

# 自定义设置项说明

全部自定义项设置实例

```javascript
$.preview({
         renderTo: null, //追加的位置
         id: null, /* 在页面中的唯一id，如果为null则自动生成随机id,一个id只会显示一个 */
        top: "200px", /* 窗口离顶部的距离,可以是百分比或像素(如 '100px')  0标识居中显示 */
        opacity: 0.5, /* 窗口隔离层的透明度,如果设置为0,则不显示隔离层 */
        showClose: true, /* 是否显示窗口右上角的关闭按钮 */
        draggable: false, /* 是否可以拖动窗口 */
        data: {
            id: "",
            url: 'http://h5.deiyoudian.com/jycccc'
        }, /*数据*/
        showPage: true, //是否展示分页
        pageData: [{
            id: "",
            url: 'http://h5.deiyoudian.com/jycccc'
        }], //翻页数据
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
     });
```

插件自定义项说明

| 属性  |  说明 |  类型 | 默认值  |
| ------------ | ------------ | ------------ | ------------ |
|  renderTo | 预览窗口对应DOM渲染位置，可为Jquery对象或者Jquery选择器名称，非必传 |  Element/Selector  |  body |
|  id | 预览窗口的Id属性值，在页面中的唯一id，如果为null则自动生成随机id,一个id只会显示一个 |  String |  随机字符串 |
|  top |  预览窗口离顶部的距离,可以是百分比或像素(如 '100px')  0标识居中显示 |  String |  200px |
|  width |  预览窗口的宽度，建议取值>=800px | Number  |   800 |
|  height |  预览窗口的高度，建议取值>=710px | Number  |  710 |
|  opacity |  预览窗口遮罩层的透明度,如果设置为0,则不显示遮罩层，取值范围0~1之间 | Number  |   0.5 |
|  showClose | 是否显示关闭预览窗口按钮  | Boolen  |  true |
|  draggable | 是否可以拖动窗口 |  Boolen |  false |
|  data  | 要预览的对象，对象包含Id和url两个字段，<a href="#data-explain">data对象说明</a>  |  Object | {id:"",url:'http://h5.deiyoudian.com/jycccc'} |
|  showPage  | 是否展示上一条和下一条按钮，用于要预览对象多与1条，点击下一条自动切换至下一条预览数据  |  Boolen |  false |
|  pageData  | 要预览对象集合，当启用显示翻页时，集合内容为所有要翻页的预览对象集合,<a href="#data-explain">data对象说明</a>  |  Array(Object) |  [{id:"",url:'http://h5.deiyoudian.com/jycccc'}] |
|  closed |  预览窗口会把当前预览对象传递给 closed 函数，<a href='#closed-explame'>查看实例 </a> | Function  |   当前预览的data对象 |
|  buttons | 自定义按钮及事件，将追加在预览窗口右侧二维码下边 ，默认为 复制链接按钮 | Array(objct)  |   复制按钮对象 |

<div id="data-explain">data对象说明</div>

| 属性  |  说明 |  类型 | 默认值  |
| ------------ | ------------ | ------------ | ------------ |
|  id |  要预览的链接对应对象Id，结合自定义按钮和函数使用，非必传 |  Null |
|  url | 要预览的链接地址，必传 |  String |    Default    |

data示例说明

    {
         id: "",
         url: 'http://h5.deiyoudian.com/jycccc'
     }
	 

<div id="closed-explame">closed 函数实例</div>

    closed: function (data) { 
		alert(JSON.stringify(data))
	} /* 窗口关闭后执行的函数 */


<div id="button-explain">自定义按钮（button）说明</div>

| 属性  |  说明 |  类型 | 默认值  |
| ------------ | ------------ | ------------ | ------------ |
|  text |  按钮显示的文字 |  String | 复制链接 |
|  className | 系统默认的按钮样式，目前可取值 primary或空 |  String |    primary    |
|  style | 自定义样式，格式: style='color:red;' |  String |    空    |
|  autoClose | 按钮点击后是否触发关闭窗口 |  Boolen |    false    |
|  initFunc | 按钮追加到Dom树后，会触发 initFunc 函数，函数参数为 按钮Jquery对象，可通过函数修改按钮属性性/注册事件等系列操作。 |  Function |   function (self) {}     |
|  clickFunc | 按钮被点击后，会触发clickFunc 函数，该函数参数为 按钮Jquery对象和当前预览的<a href="#data-explain">data对象</a>，可在该函数中定义按钮点后需要的操作 |  Function |   function (self,data) {}     |

按钮参数示例
```javascript
{
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
```


