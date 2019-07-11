// 点击底部切换页面
$('footer>div').click(function(){
	var index = $(this).index()
	$('section').hide().eq(index).fadeIn()
	$(this).addClass('active').siblings().removeClass('active')
	// $('main').scrollTop(0) // 切换返回顶部
	if(index == 0){
		if($('#repos .container').html() == ""){
			startRepos()
		}
	}else if(index == 1){
		if($('#users .container').html() == ""){
			startUsers()
		}
	}else if(index == 3){
		// $('main').scrollTop(0)
	}
})

var page1 = 1
var page2 = 1
var page3 = 1
var count1 = 0
var count3 = 0
var isLoading1 = false
var isLoading2 = false
var isLoading3 = false
var isEnding1 = false
var isEnding2 = false
var isEnding3 = false
var keyword

// 部署默认页面
startRepos()

// 滚动加载页面
var clock
$('main').scroll(function(){
	if(clock){
		window.clearTimeout(clock) // 定时器节流
	}
	clock = setTimeout(function(){
		if($('footer>div').eq(0).hasClass('active')){
			if($('#repos').height() -30 <= $('main').height() + $('main').scrollTop()){
				startRepos()
			}
		}else if($('footer>div').eq(1).hasClass('active')){
			if($('#users').height() -30 <= $('main').height() + $('main').scrollTop()){
				startUsers()
			}
		}else if($('footer>div').eq(2).hasClass('active')){
			if($('#search').height() -30 <= $('main').height() + $('main').scrollTop()){
				startSearch()
			}
		}
	}, 300)
})

// 点击按钮搜索
$('#search button').on('click', function(){
	$('#search .container').html("")
	page3 = 1
	count3 = 0
  startSearch()
})

// 回车键搜索
$('#search input').on('keyup', function(e){
  if(e.key === 'Enter') {
  	$('#search .container').html("")
    startSearch()
  }
})


// repos 页面获取并设置数据
function startRepos(){
	if(!isEnding1){
		if(isLoading1){
			return     // 避免多次重复请求
		} 
		isLoading1 = true
		$('#repos .loading').show()
		$.ajax({
			url: 'https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&page='+page1,
			type: 'GET',
			data: {
				page: this.page,
			},
			dataType: 'jsonp'
		}).done(function(ret){
			console.log('repos:', ret)
			setReposData(ret)
			page1 += 1
			count1 += 30
		}).fail(function(){
			console.log('error')
		}).always(function(ret){
			isLoading1 = false
			$('#repos .loading').hide()
			var arr = ret.data.items
			if(arr.length === 0){  // 所有数据获取完毕
				isEnding1 = true
				$('#repos .ending').show()
			}
		})
	}
}	
function setReposData(data){
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
		$node.find('.order span').text(index+1+count1)
		$node.find('a').attr('href', item.html_url)    
    $node.find('.detail h2').text(item.name)  
    $node.find('.detail .description').text(item.description) 
    $node.find('.detail .star-count').text(item.stargazers_count)
		$('#repos .container').append($node)
	})
}

// users 页面获取并设置数据
function startUsers(){
	if(!isEnding2){
		if(isLoading2){
			return     // 避免多次重复请求
		} 
		isLoading2 = true
		$('#users .loading').show()
		$.ajax({
			url: 'https://api.github.com/search/users?q=followers:>1000+location:china+language:javascript&page='+page2,
			type: 'GET',
			data: {
				page: this.page,
			},
			dataType: 'jsonp'
		}).done(function(ret){
			console.log('users:', ret)
			setUsersData(ret)
			page2 += 1
		}).fail(function(){
			console.log('error')
		}).always(function(ret){
			isLoading2 = false
			$('#users .loading').hide()
			var arr = ret.data.items
			if(arr.length === 0){  // 所有数据获取完毕
				isEnding2 = true
				$('#users .ending').show()
			}
		})
	}
}
function setUsersData(data){
	var arr = data.data.items
	arr.forEach(function(item, index){
		var $node = $(`<div class="item">
          <a href="#">
            <div class="cover"><img src="" alt=""></div>
            <div class="detail">
            	<h2>ruanyf </h2>
            	<div class="extra"><span class="nationality">China</span></div>
            </div>
          </a>
        </div> `)
		$node.find('.cover img').attr('src', item.avatar_url)
    $node.find('a').attr('href', item.html_url)    
    $node.find('.detail h2').text(item.login)
		$('#users .container').append($node)
	})
}

// search 页面获取并设置数据
function startSearch(){
	keyword = $('#search input').val()
	if(!isEnding3){
		if(isLoading3){
			return     // 避免多次重复请求
		} 
		isLoading3 = true
		$('#search .loading').show()
		$.ajax({
			url: 'https://api.github.com/search/repositories?q='+keyword+'+language:javascript&sort=stars&order=desc&page='+page3,
			type: 'GET',
			data: {
				page: this.page,
			},
			dataType: 'jsonp'
		}).done(function(ret){
			console.log('search:', ret)
			setSearchData(ret)
			page3 += 1
			count3 += 30
		}).fail(function(){
			console.log('error')
		}).always(function(ret){
			isLoading3 = false
			$('#search .loading').hide()
			var arr = ret.data.items
			if(arr.length === 0){  // 所有数据获取完毕
				isEnding3 = true
				$('#search .ending').show()
				console.log(1)
			}
		})
	}
}	
function setSearchData(data){
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
		$node.find('.order span').text(index+1+count3)
		$node.find('a').attr('href', item.html_url)  
    $node.find('.detail h2').text(item.name)  
    $node.find('.detail .description').text(item.description) 
    $node.find('.detail .star-count').text(item.stargazers_count)
		$('#search .container').append($node)
	})
}
