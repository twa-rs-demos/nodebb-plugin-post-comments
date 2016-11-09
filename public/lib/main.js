"use strict";

(function () {

	$(window).on('action:topic.loading', function (ev, data) {
		get_comments();
		submit_comment();
	});

	function submit_comment() {

		$("#content").off().on('click', '.comment-submit', function () {

			var pid = $(this).closest("li").data('pid');

			var value = $(this).prev().val();
			var showComment = "<li>" + value + "</li>";
			$(this).parents().prev().prev()
				.children().append(showComment);
			$(this).prev().val("");

			sendComment(value,pid);

		})
	}

	function sendComment(value,pid){
		$.ajax({
			type: "POST",
			url: "/save/comment",
			data: {com_content: value,pid:pid},
			dataType: "json",
			success: function (result) {
			},
			error: function () {
				alert("error");
			}
		});
	}

	function get_comments() {

		$.ajax({
			type: "POST",
			url: '/posts',
			dataType: 'json',
			success: function (result) {
				var src = $.parseJSON(result);
				get_page_posts(src.posts);
				reset_comment_area();
			},
			error: function (err) {
				console.log('error');
			}
		});
	};

	function reset_comment_area(){
		$(".comment-write").click(function () {
			var next = $(this).parent().next();
			if (next.css("display") === 'block') {
				next.css('display', 'none');
			} else {
				next.css('display', 'block');
			}
		});
	};

	function get_page_posts(postData) {

		var writer_div =
			'<div>' +
			'	<button class="comment-write" >我要说一句</button>' +
			'</div>' +
			'<div class="comment-input-area">' +
			'	<input/>' +
			'	<button class="comment-submit">发表</button>' +
			'</div>';


		for (var i = 0; i < postData.length; i++) {
			var comment_area = '';
			var data_pid = postData[i].pid;
			if (postData[i].hasOwnProperty("comments")) {

				var comments = postData[i].comments;
				 comment_area +=
					'<div class="panel">' +
					'	<ul class="comments_ul">' +
							add_comments(comments) +
					'	</ul>'  +
					'</div>';
				add_toggle(data_pid);
			}
			comment_area += writer_div;
			$('[data-pid=' + data_pid + ']').find('.post-footer').after(comment_area);
		}
	};

	function add_comments(comments_data) {

		var comment_li = '';
		for (var k = 0; k < comments_data.length; k++) {
			comment_li += '<li >' + comments_data[k].comContents + '</li>';
		}
		return comment_li;
	};

	function add_toggle(data_pid){

		var comment_flip =
				'<a class="flip">' +
				'	<i>收起</i>' +
				'	<i style="display:none;">展开</i>' +
				'</a>';
		$('[data-pid='+data_pid+']')
			.find('.post-tools').append(comment_flip);

		$('.flip').click(function(){
					var current_panel = $(this).closest('div').next();
					current_panel.slideToggle("normal");
					$(this).children('i').toggle();
					$(this).closest('div').nextAll('.comment-input-area').css('display', 'none');
		});
	}

}());
