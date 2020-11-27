var agentRequestId = '';

function manualPendingShow(open=true) {
    if (open) {
        $('.manual-pending-section').show();
        $('.manual-decided-section').hide();
    } else {
        $('.manual-pending-section').hide();
        $('.manual-decided-section').show();
    }
}

function backOpenProfile() {
    $("#profileManualOpendataTable").parent().show(); 
    $("#profileManualOpendataTable_wrapper").show();
    $('.profileManualInfo').hide();
}

function backCloseProfile() {
    $("#profileManualCloseddataTable").parent().show(); 
    $("#profileManualCloseddataTable_wrapper").show();
    $('.closedProfileManualInfo').hide();
}

function decisionInfavour(status) {
    if (status=='pending') {
        var text = 'Pending';
    } else if (status=='accept') {
        var text = 'Accepted';
    } else if (status=='decline') {
        var text = 'Declined';
    } else {
        var text = 'Deleted';
    }
    return text;
}

function initManualPending() {
    $('#profileManualOpendataTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort":false,
        "bAutoWidth": false, 
        "ajax": function(data, callback, settings) {
            $.ajax({
                url: API_URL+'agent-request-list/?page='+offsetToPageno(data.start),
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('session_id'));},
                success: function(res) { 
                    notificationBadge('profileManual-tab-classic', 'Profile', res.total);
                    callback({
                        recordsTotal: res.total,
                        recordsFiltered: res.total,
                        data: res.data
                    });
                }
            });
        },
        "columns": [
            { 
                data: "created_at", title: "Request Date", sWidth: '20%',
                render: function(data, type, row, meta){
                    return niceDate(data);
                }
            },
            { 
                data: "name", title: "Name", sWidth: '20%',
                render: function(data, type, row, meta){
                    return data;
                }
            },
            { 
                data: "email", title: "Email", sWidth: '20%',
                render: function(data, type, row, meta){
                    return data;
                }
            },
            { 
                data: "phone", title: "Phone #", sWidth: '20%',
                render: function(data, type, row, meta){
                    return data;
                }
            },
            { 
                data: "brokerage_name", title: "Brokerage", sWidth: '20%',
                render: function(data, type, row, meta){
                    return data;
                }
            },
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.id);
        }
    });
}

function initManualDecision() {
    $('#profileManualCloseddataTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort":false,
        "bAutoWidth": false, 
        "ajax": function(data, callback, settings) {
            $.ajax({
                url: API_URL+'agent-request-list/decided/?page='+offsetToPageno(data.start),
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('session_id'));},
                success: function(res) { 
                    callback({
                        recordsTotal: res.total,
                        recordsFiltered: res.total,
                        data: res.data
                    });
                }
            });
        },
        "columns": [
            { 
                data: "created_at", title: "Requested Date", sWidth: '25%',
                render: function(data, type, row, meta){
                    return niceDate(data);
                }
            },
            { 
                data: "name", title: "Name", sWidth: '20%',
                render: function(data, type, row, meta){
                    return data;
                }
            },
            { 
                data: "brokerage_name", title: "Brokerage", sWidth: '20%',
                render: function(data, type, row, meta){
                    return data;
                }
            },
            {   
                data: "status", title: "Status", sWidth: '25%',
                render: function(data, type, row, meta){
                    return decisionInfavour(data);
                }
            }
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.id);
        }
    });
}

function manualDetail() {
    $('.acceptRequestBtn').attr('disabled', false);
    $('.rejectRequestBtn').attr('disabled', false);

    settings = get_settings('agent-request/'+agentRequestId+'/', 'GET');
    settings['headers'] = {};
    $.ajax(settings).done(function (response) {
        var response = JSON.parse(response);

        if (response.status == 'accept') {
            $('.delete-agent').show();
        } else {
            $('.delete-agent').hide();
        }
        
        if (response.agent !== null) {
            var link = '<a target="_blank" href="https://agentstat.com/profile/'+response.agent+'/">'+response.connector.agent_name+'</a>';
            $('.agent-name').html(link);
        } else {
            $('.agent-name').text('');
        }
        $('.created-date').html(niceDate(response.created_at));

        $('.fullname').text(response.name);
        $('.email').text(response.email);
        $('.phone').text(response.phone);
        $('.brokerage-name').text(response.brokerage_name);
        $('.license').text(response.license);
        $('.street-address').text(response.street_address);
        $('.city').text(response.city);
        $('.state').text(response.state);
        $('.zipcode').text(response.zip_code);

        // $('.closedReason').text(response.reason);
        $('.decision-infavour').text(decisionInfavour(response.status));

        if (response.status == 'pending') {
            manualPendingShow();
        } else {
            manualPendingShow(false);
        }
        
    }).fail(function(err) {
        console.log(err.responseText);
    });
}

function manualUpdate(data) {
    settings = get_settings('agent-request/'+agentRequestId+'/', 'PUT', JSON.stringify(data));
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        manualPendingShow(false);
    });
}

function reloadAgentManualData() {
    setTimeout(function() { 
        $('#profileManualOpendataTable').DataTable().ajax.reload();
        $('#profileManualCloseddataTable').DataTable().ajax.reload();
    }, 1000);
}

$(document).ready(function(){
    // START: PROFILE MANUAL
    initManualPending();
    initManualDecision();

    $('#profileManualOpendataTable').on( 'click', 'tr', function (e) {
        if ($(e.target).attr('class') == 'agent-profile-link') {
            var url = $(e.target).attr('href');
            window.open(url);
            return false;
        }

        $('.profileManualInfo').show();
        $("#profileManualOpendataTable").parent().hide(); 
        $("#profileManualOpendataTable_wrapper").hide();

        agentRequestId = $(this).data('id');
        manualDetail();
    });

    $('#profileManualCloseddataTable').on( 'click', 'tr', function (e) {
        if ($(e.target).attr('class') == 'agent-profile-link') {
            var url = $(e.target).attr('href');
            window.open(url);
            return false;
        }

        $('.closedProfileManualInfo').show();
        $("#profileManualCloseddataTable").parent().hide(); 
        $("#profileManualCloseddataTable_wrapper").hide();

        agentRequestId = $(this).data('id');
        manualDetail();
    });

    $('.acceptRequestBtn').on('click',function(){
        $(this).attr('disabled', true);
        // $('.closedReason').html($('.getReasoncurOwn').val());
        $('.decision-infavour').text('Accepted');

        var data = {
            // 'reason': $('.getReasoncurOwn').val(),
            'status': 'accept',
        };
        manualUpdate(data);
        reloadAgentManualData();
    });

    $('.rejectRequestBtn').on('click',function(){
        $(this).attr('disabled', true);
        // $('.closedReason').html($('.getReasonmanuale').val());
        $('.decision-infavour').text('Rejected');

        var data = {
            // 'reason': $('.getReasonmanuale').val(),
            'status': 'decline',
        };
        manualUpdate(data);
        reloadAgentManualData();
    });

    $('#profileManualOpen-tab-classic').on('click', function(){
        backOpenProfile();
    });

    $('#profileManualClosed-tab-classic').on('click', function(){
        backOpenProfile();
    });

    $('.backIcon').on( 'click', function () {
        backOpenProfile();
    });

    $('.closedProfileManualInfo-backIcon').on( 'click', function () {
        backCloseProfile();
    });

    $(document).on('click', '.delete-agent', function(){
        var res = confirm("Are you sure to delete? this cannot be undo!");
        if (res == true) {
            $(this).attr('disabled', true);
            $('.decision-infavour').text('Deleted');
            $('.delete-agent').hide();
            
            var data = {
                'status': 'delete',
            };
            manualUpdate(data);
            reloadAgentManualData();
        } 
    });
    // END: PROFILE MANUAL
});