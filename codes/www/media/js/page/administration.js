function addKeywordApi(val) {
    var data = {'keyword':val};
    settings = get_settings('keyword-alert/', 'POST', JSON.stringify(data));
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        var response = JSON.parse(response);
        keywordHtml(response);
    });
}

function allKeywordApi() {
    settings = get_settings('keyword-alert/', 'GET');
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        var response = JSON.parse(response);
        $.each(response, function(k,v){
            keywordHtml(v);
        });
    });
}

function delKeywordApi(id) {
    settings = get_settings('keyword-alert/'+id+'/', 'DELETE');
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {

    });
}

function keywordHtml(obj) {
    html = '<div class="col-xl-6 col-sm-12 mb-6 keyword-element">';
    html += '<button class="keywordBtn">'+obj.keyword+'<span class="removeKeyword" data-id="'+obj.id+'"><i class="fas fa-times "></i></span></button>';
    html += '</div>';

    $('.keywords').append(html);
}

$(document).ready(function(){
    allKeywordApi();

    var keywords = [];
    $("#addkeyword-form").submit(function(e){
        e.preventDefault();
        if($("#keyword").val() == '')
        {
            alert('Please enter keyword and then submit.');
            return false;
        }
        
        addKeywordApi($("#keyword").val());

        $("#keyword").val('');
    });

    $(document).on('click', '.removeKeyword', function(){
        var id = $(this).data('id');
        var that = $(this);
        bootbox.confirm({ 
            size: "small",
            message: "Are you sure?",
            callback: function(result){ 
                if (result) {
                    delKeywordApi(id);
                    that.hide().parents('.keyword-element').hide();
                }
            }
        })
    });

    function addkeywordBtns1()
    {
        var html = '';
        keywords.forEach((value,key) => {
            console.log(key);
            console.log(value);
            html += '<div class="col-xl-6 col-sm-12 mb-6">';
            html += '<button class="keywordBtn">'+value+'<span class="removeKeyword"><i class="fas fa-times "></i></span></button>';
            html += '</div>';
        });

        $(".keywords").html(html);
        $(".removeKeyword").on('click',function(){
            var keyword = $(this).parent().text();
            keywords = $.grep(keywords, function(value) {
                return value != keyword;
            });
            addkeywordBtns1();
        });
        $("#keyword").val('');
    }
});