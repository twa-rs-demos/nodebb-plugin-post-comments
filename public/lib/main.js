(function () {

	$(window).on('action:topic.loading', function (ev, data) {
		add_toggle();
		getComments();

	});

	function save_comment() {
		$.ajax({
			type:"POST",
			url:"/save/comment",
			dataType: 'json',
			data:{pid:32,com_content:"我是个乖宝宝"},
			success: function (err,result) {
				console.log(result);
			},
			error: function (err) {
				console.log('error');
			}

		})
	}

	function add_toggle(){
		var comment_a = '<a class="flip"><i class="comAreadisplay">收起</i><i class="comAreaHide" style="display:none;">展开</i></a>';
		$('.post-tools').append(comment_a);
		$(".flip").click(function () {
			var current_panel = $(this).closest('div').next();
			current_panel.slideToggle("slow");
			$(this).children('i').toggle();
		});
	}

	function getComments() {
		$.ajax({
			type: "POST",
			url: '/posts',
			data: {tid: 33},
			dataType: 'json',
			success: function (result) {

				var src =  $.parseJSON(result);
				getPagePosts(src.posts);

				$(".writeCom").click(function () {
					var next = $(this).parent().next();
					if (next.css("display") === 'block') {
						next.css('display', 'none');
					} else {
						next.css('display', 'block');
					}
				});

				$('.com_submit').click(function () {
					save_comment();
				});
			},
			error: function (err) {
				console.log('error');
			}
		});
	};

	function getPagePosts(postData) {
		var writer_div = '<div><button class="writeCom" >我要说一句</button></div>' +
			'<div class="commentInputArea"><input /><button class="com_submit">发表</button></div>';
		for(var i=0;i<postData.length;i++){
			if(postData[i].hasOwnProperty("comments")){
				var data_pid = postData[i].pid;
				var comments = postData[i].comments;
				var comment_area = '<div class="panel"><ul class="comments_ul">'+addComments(comments)+'</ul>'+writer_div+'</div>';
				$('[data-pid=' + data_pid + ']').find('.post-footer').after(comment_area);
			}
		}
	};

	function addComments(comments_data) {
		var comment_li='';
		for (var k = 0; k < comments_data.length; k++) {
			comment_li += '<li >' + comments_data[k].com_content + '</li>';
		}
		return comment_li;
	}

}());