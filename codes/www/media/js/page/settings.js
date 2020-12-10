$(document).ready(function(){

    $('#save_password_btn').click(function(){
        $('.password-msg').hide();
    
        var old_password = $('#current-password').val();
        var new_password = $('#new-password').val();
        var repeat_password = $('#repeat-password').val();
    
        if (old_password == '' || new_password == '' || repeat_password == '') {
            $('.password-msg').html('All fields are required');
            $('.password-msg').show();
            return false;
        }
    
        if (new_password != repeat_password) {
            $('.password-msg').html('New password and confirm does not matched');
            $('.password-msg').show();
            return false;
        }
    
        data = {}
        data['old_password'] = old_password;
        data['new_password'] = new_password;
    
        settings = get_settings('change-password/', 'POST', JSON.stringify(data));
        $.ajax(settings).done(function (response) {
            var data = JSON.parse(response);
            if (data.status == true) {
                $('.password-msg').html('SUCCESS! Your password has been successfully changed.');
                $('.password-msg').show();
            }
        }).fail(function(err) {
            var err = JSON.parse(err.responseText);
            $('.password-msg').html(err.msg);
            $('.password-msg').show();
        });
    });
});