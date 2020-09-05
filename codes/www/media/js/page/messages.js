var reclaimId = '';
var keywordAlertId = '';

function diffOfHours(createdAt) {
    var pastDate = new Date(createdAt);

    var dateNow = new Date();

    var seconds = Math.floor((dateNow - (pastDate))/1000);
    var minutes = Math.floor(seconds/60);
    var hours = Math.floor(minutes/60);

    return hours;
}

function proofDeadline(createdAt) {
    var hours = diffOfHours(createdAt);
    return (hours > 24) ? 0 : 24-hours;
}

function decisionDeadline(createdAt) {
    var hours = diffOfHours(createdAt);
    return (hours > 24) ? 0 : 48-hours;
}

function disputePendingShow(open=true) {
    if (open) {
        $('.dispute-pending-section').show();
        $('.dispute-decided-section').hide();
    } else {
        $('.dispute-pending-section').hide();
        $('.dispute-decided-section').show();
    }
}

function backOpenProfile() {
    $("#profileDisputeOpendataTable").parent().show(); 
    $("#profileDisputeOpendataTable_wrapper").show();
    $('.profileDisputeInfo').hide();
}

function backCloseProfile() {
    $("#profileDisputeCloseddataTable").parent().show(); 
    $("#profileDisputeCloseddataTable_wrapper").show();
    $('.closedProfileDisputeInfo').hide();
}

function decisionInfavour(status) {
    if (status=='pending') {
        var text = 'Pending';
    } else if (status=='accept') {
        var text = 'Disputee';
    } else {
        var text = 'Current Owner';
    }
    return text;
}

function initDisputePending() {
    $('#profileDisputeOpendataTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort":false,
        "bAutoWidth": false, 
        "ajax": function(data, callback, settings) {
            $.get(API_URL+'reclaim-dispute/', {
                page: offsetToPageno(data.start),
            }, function(res) {
                notificationBadge('profileDispute-tab-classic', 'Profile', res.total);
                callback({
                    recordsTotal: res.total,
                    recordsFiltered: res.total,
                    data: res.data
                });
            });
        },
        "columns": [
            { 
                data: "created_at", title: "Dispute Date", sWidth: '20%',
                render: function(data, type, row, meta){
                    return niceDate(data);
                }
            },
            {   
                data: null, title: "Agent Profile", sWidth: '20%' ,
                render: function(data, type, row, meta){
                    if (row.agent_profile_connector !== null) {
                        var url = WEBSITE_URL+'page-three.html?agent_id='+row.connector.id;
                        return "<a class='agent-profile-link' href='"+url+"' target='_blank'>"+row.connector.agent_name+"</a>";
                    } else {
                        return 'Not Found';
                    }
                    
                }
            },
            {   
                data: "provide", title: "Proof Provided By", sWidth: '20%'
            },
            { 
                data: null, title: "Proof Deadline", sWidth: '20%',
                render: function(data, type, row, meta){
                    return proofDeadline(row.created_at)+' Hours';
                }
            },
            {   
                data: "email", title: "Decision Deadline", sWidth: '20%',
                render: function(data, type, row, meta){
                    return decisionDeadline(row.created_at)+' Hours';
                }
            }
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.id);
        }
    });
}

function initDisputeDecision() {
    $('#profileDisputeCloseddataTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort":false,
        "bAutoWidth": false, 
        "ajax": function(data, callback, settings) {
            $.get(API_URL+'reclaim-dispute/decided/', {
                page: offsetToPageno(data.start),
            }, function(res) {
                callback({
                    recordsTotal: res.total,
                    recordsFiltered: res.total,
                    data: res.data
                });
            });
        },
        "columns": [
            { 
                data: "created_at", title: "Dispute Date", sWidth: '25%',
                render: function(data, type, row, meta){
                    return niceDate(data);
                }
            },
            {   
                data: null, title: "Agent Profile", sWidth: '25%' ,
                render: function(data, type, row, meta){
                    if (row.agent_profile_connector !== null) {
                        var url = WEBSITE_URL+'page-three.html?agent_id='+row.connector.id;
                        return "<a class='agent-profile-link' href='"+url+"' target='_blank'>"+row.connector.agent_name+"</a>";
                    } else {
                        return 'Not Found';
                    }
                    
                }
            },
            {   
                defaultContent: 'Anna', title: "Decided By", sWidth: '25%'
            },
            {   
                data: "status", title: "Decision Favors", sWidth: '25%',
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

function initKeywordAlertUnmarked() {
    $('#keywordAlertsOpendataTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort":false,
        "bAutoWidth": false, 
        "ajax": function(data, callback, settings) {
            $.get(API_URL+'keyword-alert-found/', {
                page: offsetToPageno(data.start),
            }, function(res) {
                notificationBadge('keywordAlerts-tab-classic', 'Keyword Alert', res.total);
                callback({
                    recordsTotal: res.total,
                    recordsFiltered: res.total,
                    data: res.data
                });
            });
        },
        "columns": [
            { 
                data: "created_at", title: "Date", sWidth: '20%',
                render: function(data, type, row, meta){
                    return niceDate(data);
                }
            },
            {   
                data: null, title: "Agent Profile", sWidth: '20%' ,
                render: function(data, type, row, meta){
                    var url = WEBSITE_URL+'page-three.html?agent_id='+row.zillow_agent_id;
                    return "<a class='agent-profile-link' href='"+url+"' target='_blank'>"+row.agent_name+"</a>";   
                }
            },
            {   
                data: "keyword_location", title: "Keyword Location", sWidth: '20%'
            },
            {   
                data: "keyword", title: "Keyword", sWidth: '20%'
            },
            {   
                data: null, sWidth: '20%',
                render: function(data, type, row, meta){
                    return '<button class="btn btn-success keywork-marked" data-toggle="modal" data-target="#markCloseModal" data-id="'+row.id+'">Mark Closed</button>';
                }
            }
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.id);
        }
    });
}

function initKeywordAlertmarked() {
    $('#keywordAlertsCloseddataTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort":false,
        "bAutoWidth": false, 
        "ajax": function(data, callback, settings) {
            $.get(API_URL+'keyword-alert-found/marked/', {
                page: offsetToPageno(data.start),
            }, function(res) {
                callback({
                    recordsTotal: res.total,
                    recordsFiltered: res.total,
                    data: res.data
                });
            });
        },
        "columns": [
            { 
                data: "created_at", title: "Date", sWidth: '20%',
                render: function(data, type, row, meta){
                    return niceDate(data);
                }
            },
            {   
                data: null, title: "Agent Profile", sWidth: '20%' ,
                render: function(data, type, row, meta){
                    var url = WEBSITE_URL+'page-three.html?agent_id='+row.zillow_agent_id;
                    return "<a class='agent-profile-link' href='"+url+"' target='_blank'>"+row.agent_name+"</a>";   
                }
            },
            {   
                data: "keyword_location", title: "Keyword Location", sWidth: '20%'
            },
            {   
                data: "keyword", title: "Keyword", sWidth: '20%'
            },
            {   
                data: "closed_by", title: "Closed By", sWidth: '20%'
            },
            {   
                data: "notes", title: "Notes", sWidth: '20%'
            },
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.id);
        }
    });
}

function disputeDetail() {
    settings = get_settings('reclaim/'+reclaimId, 'GET');
    settings['headers'] = {};
    $.ajax(settings).done(function (response) {
        var response = JSON.parse(response);
        
        if (response.agent_profile_connector !== null) {
            $('.agent-name').text(response.connector.agent_name);
        }

        $('.dis-fullname').text(response.full_name);
        $('.dis-email').text(response.email);
        $('.dis-phone').text(response.phone);
        $('.dis-brokerage-name').text(response.brokerage_name);
        $('.dis-date').text(niceDate(response.created_at));
        $('.dis-photoid').attr('src', response.id_picture);
        $('.fancy-dis-photoid').attr('href', response.id_picture);
        $('.dis-licenseid').attr('src', response.real_estate_license);
        $('.fancy-dis-licenseid').attr('href', response.real_estate_license);

        $('.cur-fullname').text(response.current_full_name);
        $('.cur-email').text(response.current_email);
        $('.cur-phone').text(response.current_phone);
        $('.cur-brokerage-name').text(response.current_brokerage_name);
        $('.cur-photoid').attr('src', response.current_id_picture);
        $('.fancy-cur-photoid').attr('href', response.current_id_picture);
        $('.cur-licenseid').attr('src', response.current_real_estate_license);
        $('.fancy-cur-licenseid').attr('href', response.current_real_estate_license);

        $('.closedReason').text(response.reason);
        $('.decision-infavour').text(decisionInfavour(response.status));

        if (response.status == 'pending') {
            disputePendingShow();
        } else {
            disputePendingShow(false);
        }
        
    }).fail(function(err) {
        console.log(err.responseText);
    });
}

function disputeUpdate(data) {
    settings = get_settings('reclaim/'+reclaimId+'/', 'PUT', JSON.stringify(data));
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        disputePendingShow(false);
    });
}

function keywordUpdate(data, keyword_id) {
    settings = get_settings('keyword-alert-match/'+keyword_id+'/', 'PUT', JSON.stringify(data));
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        reloadKeywordAlertData();
    });
}

function reloadAgentDisputeData() {
    setTimeout(function() { 
        $('#profileDisputeOpendataTable').DataTable().ajax.reload();
        $('#profileDisputeCloseddataTable').DataTable().ajax.reload();
    }, 1000);
}

function reloadKeywordAlertData() {
    setTimeout(function() { 
        $('#keywordAlertsOpendataTable').DataTable().ajax.reload();
        $('#keywordAlertsCloseddataTable').DataTable().ajax.reload();
    }, 100);
}

$(document).ready(function(){
    initDisputePending();
    initDisputeDecision();

    initKeywordAlertUnmarked();
    initKeywordAlertmarked();

    $('#profileDisputeOpendataTable').on( 'click', 'tr', function (e) {
        if ($(e.target).attr('class') == 'agent-profile-link') {
            var url = $(e.target).attr('href');
            window.open(url);
            return false;
        }

        $('.profileDisputeInfo').show();
        $("#profileDisputeOpendataTable").parent().hide(); 
        $("#profileDisputeOpendataTable_wrapper").hide();

        reclaimId = $(this).data('id');
        disputeDetail();
    });

    $('#profileDisputeCloseddataTable').on( 'click', 'tr', function (e) {
        if ($(e.target).attr('class') == 'agent-profile-link') {
            var url = $(e.target).attr('href');
            window.open(url);
            return false;
        }

        $('.closedProfileDisputeInfo').show();
        $("#profileDisputeCloseddataTable").parent().hide(); 
        $("#profileDisputeCloseddataTable_wrapper").hide();

        reclaimId = $(this).data('id');
        disputeDetail();
    });

    $('.completegetReasoncurOwn').on('click',function(){
        $('.closedReason').html($('.getReasoncurOwn').val());
        $('.decision-infavour').text('Current Owner');

        var data = {
            'reason': $('.getReasoncurOwn').val(),
            'status': 'decline',
        };
        disputeUpdate(data);
        reloadAgentDisputeData();
    });

    $('.completgetReasondisputee').on('click',function(){
        $('.closedReason').html($('.getReasondisputee').val());
        $('.decision-infavour').text('Disputee');

        var data = {
            'reason': $('.getReasondisputee').val(),
            'status': 'accept',
        };
        disputeUpdate(data);
        reloadAgentDisputeData();
    });

    $('.markCloseBtn').on('click', function() {
        var data = {
            'closed_by': 'Anna',
            'notes': $('.markCloseDescription').val()
        };
        keywordUpdate(data, keywordAlertId);
        $('.markCloseDescription').val('');
    });

    $(document).on('click', '.keywork-marked',function(){
        keywordAlertId = $(this).data('id');
    });

    $('#profileDisputeOpen-tab-classic').on('click', function(){
        backOpenProfile();
    });

    $('#profileDisputeClosed-tab-classic').on('click', function(){
        backOpenProfile();
    });

    $('.backIcon').on( 'click', function () {
        backOpenProfile();
    });

    $('.closedProfileDisputeInfo-backIcon').on( 'click', function () {
        backCloseProfile();
    });
    
});