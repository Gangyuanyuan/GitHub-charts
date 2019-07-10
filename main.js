$('footer>div').click(function(){
	var index = $(this).index()
	$('section').hide().eq(index).fadeIn()
	$(this).addClass('active').siblings().removeClass('active')
})

var page = 1
var count = 0

start()
$('main').scroll(function(){
	if($('section').eq(0).height() -10 <= $('main').height() + $('main').scrollTop()){
		start()
	}
})

// 获取并设置数据
function start(){
	$.ajax({
		url: 'https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&page='+page,
		type: 'GET',
		data: {
			page: this.page,
		},
		dataType: 'jsonp'
	}).done(function(ret){
		console.log(ret)
		setData(ret)
		page += 1
		count += 30
	}).fail(function(){
		console.log('error')
	})
}

function setData(data){
	var arr = data.data.items
	arr.forEach(function(item, index){
		var tpl = `<div class="item">
		 	<a href="https://github.com/TryGhost/Ghost">
		 		<div class="order"><span>1</span></div>
		 		<div class="detail">
		 		    <h2>Ghost</h2>
		 		    <div class="description">Knockout makes it easier to create rich, responsive UIs with JavaScript.</div>
		 		    <div class="extra"><span class="star-count">4196</span> star</div>
		 		</div>
		 	</a>
		 </div>`
		var $node = $(tpl)
		$node.find('.order span').text(index+1+count)
		$node.find('a').attr('href', item.html_url)    
    $node.find('.detail h2').text(item.name)  
    $node.find('.detail .description').text(item.description) 
    $node.find('.detail .star-count').text(item.stargazers_count)
		$('section').eq(0).append($node)
	})
}

// 拼接字符串写法
// function setData(data){
// 	var arr = data.data.items
// 	console.log("参数数组:", arr)
// 	var tpl = ''
// 	for(var i=0; i<arr.length; i++){
// 		tpl += '<div class="item"><a href="'+arr[i].html_url+'"><div class="order"><span>'+(i+1)+'</span>'
// 		tpl += '</div><div class="detail">'
// 		tpl += '<h2>'+arr[i].name+'</h2><div class="description">'+arr[i].description+'</div><div class="extra"><span class="star-count">'+arr[i].stargazers_count+'</span>&nbsp;&nbsp;star</div>'
// 		tpl += '</div></a></div>'
// 	}
// 	$('section').eq(0).html(tpl)
// }