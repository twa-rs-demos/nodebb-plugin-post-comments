(function () {

    var src;
    var pre_scroll_top = 0;
    var timer = null;

    $(window).on('action:topic.loading', function (ev, data) {
        get_comments();
        submit_comment();

        $(window).scroll(function () {

            if(timer === null){
                timer = setTimeout(function () {
                    get_comments();
                    submit_comment();
                },3000);

                timer = null;
            }
        });

    });


    function submit_comment() {

        $("#content").off().on('click', '.comment-submit', function () {

            var data_pid = $(this).closest("li").data('pid');

            var value = $(this).prev().val();
            var showComment = "<li>" + value + "</li>";
            $(this).parent().prev().prev().children().append(showComment);
            $(this).prev().val("");

            sendComment(value, data_pid);
        })
    }

    function sendComment(value, pid) {

        $.ajax({
            type: "POST",
            url: "/save/comment",
            data: {com_content: value, pid: pid},
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
                src = $.parseJSON(result).posts;
                get_page_posts(src);
                add_write_comment_event();
            },
            error: function (err) {
                console.log('error');
            }
        });
    }

    function add_write_comment_event() {

        $('#content').on('click', '.comment-write', function () {
            var next = $(this).parent().next();
            if (next.css("display") === 'block') {
                next.css('display', 'none');
            } else {
                next.css('display', 'block');
            }
        });
    };

    function add_edit_area(data_pid) {

        var edit_area =
            '<div>' +
            '	<button class="comment-write btn btn-primary btn-sm" data-pid="' + data_pid + '">我要说一句</button>' +
            '</div>' +
            '<div class="comment-input-area" data-pid="' + data_pid + '">' +
            '	<input data-pid="' + data_pid + '"/>' +
            '	<button class="comment-submit btn btn-primary btn-sm" data-pid="' + data_pid + '">发表</button>' +
            '</div>';
        return edit_area;
    }

    function get_page_posts(postsData) {

        for (var i = 0; i < postsData.length; i++) {
            var comment_area = '';
            var data_pid = postsData[i].pid;

            if (postsData[i].hasOwnProperty("comments")) {
                var comments = postsData[i].comments;
                comment_area += add_comment_data(add_comments(comments), data_pid);
            } else {

                comment_area += add_comment_data('', data_pid);
            }

            add_toggle(data_pid);
            comment_area += add_edit_area(data_pid);

            if ($('[data-pid=' + data_pid + ']').find('.panel').length === 0) {
                $('[data-pid=' + data_pid + ']').find('.post-footer').after(comment_area);
                flip_toggle(data_pid);
            }
        }

    }

    function add_comment_data(comments_li, data_pid) {

        var comment_area =
            '<div class="panel" data-pid="' + data_pid + '">' +
            '	<ul class="comments_ul" data-pid="' + data_pid + '">' +
            comments_li +
            '	</ul>' +
            '</div>';
        return comment_area;
    }

    function add_comments(comments_data) {

        var comment_li = '';
        for (var k = 0; k < comments_data.length; k++) {
            comment_li += '<li >' + comments_data[k].com_content + '</li>';
        }
        return comment_li;
    }

    function add_toggle(data_pid) {

        var comment_flip =
            '<a class="flip">' +
            '	<i>收起</i>' +
            '	<i style="display:none;">展开</i>' +
            '</a>';
        if ($('[data-pid=' + data_pid + ']').find('.flip').length === 0) {
            $('[data-pid=' + data_pid + ']')
                .find('.post-tools').after(comment_flip);
        }

    }


    function flip_toggle(data_pid) {

        $('[data-pid=' + data_pid + ']').find('.flip').click(function () {
            var current_panel = $(this).closest('div').next();
            current_panel.slideToggle("normal");
            $(this).children('i').toggle();
            $(this).closest('div').nextAll('.comment-input-area').css('display', 'none');
        });

    }

    $(window).on('popstate', function () {

        $.ajax({
            type: "post",
            url: '/reply/newpost',
            dataType: 'json',
            success: function (result) {

                var postsdata = [];
                var newPost = $.parseJSON(result);
                postsdata.push(newPost);

                setTimeout(function () {
                    get_page_posts(postsdata);
                }, 1000);

            },
            error: function (err) {
                console.log('err');
            }
        });
    })
}());