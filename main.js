$('footer>div').click(function(){
	var index = $(this).index()
	$('section').hide().eq(index).fadeIn()
	$(this).addClass('active').siblings().removeClass('active')
})

var page1 = 1
var page2 = 1
var count = 0
var isLoadig1 = false
var isLoadig2 = false

startRepos()
startUsers()

var clock
$('main').scroll(function(){
	if(clock){
		window.clearTimeout(clock) // 定时器节流
	}
	clock = setTimeout(function(){
		if($('#repos .container').height() -30 <= $('main').height() + $('main').scrollTop()){
			startRepos()
			startUsers()
		}
	}, 300)
})



// repos 页面获取并设置数据
function startRepos(){
	if(isLoadig1){
		return     // 避免多次重复请求
	} 
	isLoadig1 = true
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
		count += 30
	}).fail(function(){
		console.log('error')
	}).always(function(){
		isLoadig1 = false
		$('#repos .loading').hide()
	})
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
		$node.find('.order span').text(index+1+count)
		$node.find('a').attr('href', item.html_url)    
    $node.find('.detail h2').text(item.name)  
    $node.find('.detail .description').text(item.description) 
    $node.find('.detail .star-count').text(item.stargazers_count)
		$('#repos .container').append($node)
	})
}


// users 页面获取并设置数据
function startUsers(){
	if(isLoadig2){
		return     // 避免多次重复请求
	} 
	isLoadig2 = true
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
	}).always(function(){
		isLoadig2 = false
		$('#users .loading').hide()
	})
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
