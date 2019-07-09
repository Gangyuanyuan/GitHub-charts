$('footer>div').click(function(){
	var index = $(this).index()
	$('section').hide().eq(index).fadeIn()
	$(this).addClass('active').siblings().removeClass('active')
})
$.ajax({
	url: 'https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&page=1',
	type: 'GET',
	data: {
		page: this.page
	},
	dataTape: 'jsonp'
}).done(function(ret){
	console.log(ret)
}).fail(function(){
	console.log('error')
})