$(document).ready(function(){
    $('#login-form').on('submit', function() {
        var username = $('#username').val();
        var password = $('#password').val();

        if (username == '' || password == '') {
            alert('Username and password field are required.');
            return false;
        }

        var data = {
            'username':username,
            'password':password,
        };
        
        settings = get_settings('staff-login/', 'POST', JSON.stringify(data));
        settings['headers'] = null;
        $.ajax(settings).done(function (response) {
            var data = JSON.parse(response);
            
            localStorage.session_id = data.token;
            localStorage.user_data = JSON.stringify({
                'user_id' : data.user_id,
                'username' : data.username,
                'email': data.email,
                'first_name': data.first_name,
                'last_name': data.last_name,
            });

            window.location = '/dashboard/';

        }).fail(function(err) {
            var res = err['responseText'];
            alert(res);
            // console.log(err);
        });

        return false;
    });
});