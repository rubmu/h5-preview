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

| 属性  |  说明 |  类型 | 默认值  |
| ------------ | ------------ | ------------ | ------------ |
|  renderTo | 预览窗口对应DOM渲染位置，可为Jquery对象或者Jquery选择器名称，非必填 |  Element/Selector  |  body |
|  id | 预览窗口的Id属性值，在页面中的唯一id，如果为null则自动生成随机id,一个id只会显示一个 |  String |  随机字符串 |
|  top |  预览窗口离顶部的距离,可以是百分比或像素(如 '100px')  0标识居中显示 |  String |  200px |
|  width |  预览窗口的宽度，建议取值>=800px | Number  |   800 |
|  height |  预览窗口的高度，建议取值>=710px | Number  |  710 |
|  opacity |  预览窗口遮罩层的透明度,如果设置为0,则不显示遮罩层，取值范围0~1之间 | Number  |   0.5 |
|  showClose | 是否显示关闭预览窗口按钮  | Boolen  |  true |
|  draggable | 是否可以拖动窗口 |  Boolen |  false |
|  data  | 要预览的对象，对象包含Id和url两个字段  |  Object | {id:"",url:'http://h5.deiyoudian.com/jycccc'} |
|  showPage  | 是否展示上一条和下一条按钮，用于要预览对象多与1条，点击下一条自动切换至下一条预览数据  |  Boolen |  false |
|  pageData  | 要预览对象集合，当启用显示翻页时，集合内容为所有要翻页的预览对象集合 |  Array(Object) |  [{id:"",url:'http://h5.deiyoudian.com/jycccc'}] |
|  closed |  预览窗口会把当前预览对象传递给 closed 函数 | Function  |   当前预览的data对象 |
|  buttons | 自定义按钮及事件，将追加在预览窗口右侧二维码下边  | Array(objct)  |   复制按钮对象 |
