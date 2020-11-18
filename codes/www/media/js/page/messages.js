var reclaimId = '';
var keywordAlertId = '';
var transactionId = '';

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

function transactionPendingShow(open=true) {
    if (open) {
        $('.transaction-pending-section').show();
        $('.transaction-decided-section').hide();
    } else {
        $('.transaction-pending-section').hide();
        $('.transaction-decided-section').show();
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

function backOpenTransaction() {
    $('.transactionEditsInfo').hide();
    $("#transactionEditsOpendataTable").parent().show(); 
    $("#transactionEditsOpendataTable_wrapper").show();
}

function backCloseTransaction() {
    $("#transactionEditsOpendataTable").parent().show(); 
    $("#transactionEditsOpendataTable_wrapper").show();
    $('.transactionEditsInfo').hide();
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

function transactionDecision(status) {
    if (status=='pending') {
        var text = 'Pending';
    } else if (status=='accept') {
        var text = 'Accept';
    } else {
        var text = 'Decline';
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
                data: null, title: "Agent Profile", sWidth: '15%' ,
                render: function(data, type, row, meta){
                    var url = WEBSITE_URL+'page-three.html?agent_id='+row.zillow_agent_id;
                    return "<a class='agent-profile-link' href='"+url+"' target='_blank'>"+row.agent_name+"</a>";   
                }
            },
            {   
                data: "keyword_location", title: "Keyword Location", sWidth: '20%'
            },
            {   
                data: "keyword", title: "Keyword", sWidth: '13%'
            },
            {   
                data: "closed_by", title: "Closed By", sWidth: '12%'
            },
            {   
                data: "notes", title: "Notes", sWidth: '25%'
            },
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.id);
        }
    });
}

function initTransactionEditPending() {
    $('#transactionEditsOpendataTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort":false,
        "bAutoWidth": false, 
        "ajax": function(data, callback, settings) {
            $.get(API_URL+'agent-list/?record_type=agentstat&record_status_not_eq=mark', {
                page: offsetToPageno(data.start),
            }, function(res) {
                notificationBadge('transactionEdits-tab-classic', 'Transaction Edit', res.count);
                callback({
                    recordsTotal: res.count,
                    recordsFiltered: res.count,
                    data: res.results
                });
            });
        },
        "columns": [
            { 
                data: "created_at", title: "Created Date", sWidth: '20%',
                render: function(data, type, row, meta){
                    return niceDate(data);
                }
            },
            {   
                data: null, title: "Agent Profile", sWidth: '20%' ,
                render: function(data, type, row, meta){
                    if (row.agent !== null) {
                        var url = WEBSITE_URL+'page-three.html?agent_id='+row.agent;
                        return "<a class='agent-profile-link' href='"+url+"' target='_blank'>"+row.agent_name+"</a>";
                    } else {
                        return 'Not Found';
                    }
                    
                }
            },
            {   
                data: "record_status", title: "Type", sWidth: '20%',
                render: function(data) {
                    return data;
                }
            },
            {   
                data: "address_text", title: "Street Address", sWidth: '20%',
                render: function(data) {
                    return data;
                }
            },
            {   
                data: null, sWidth: '20%',
                render: function(data, type, row, meta){
                    return '<button class="btn btn-success transaction-marked" data-id="'+row.id+'">Mark as Read</button>';
                }
            }
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.id);
        }
    });
}

function initTransactionEditDecided() {
    $('#transactionEditsCloseddataTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort":false,
        "bAutoWidth": false, 
        "ajax": function(data, callback, settings) {
            $.get(API_URL+'agent-list/?record_type=agentstat&record_status=mark', {
                page: offsetToPageno(data.start),
            }, function(res) {
                callback({
                    recordsTotal: res.count,
                    recordsFiltered: res.count,
                    data: res.results
                });
            });
        },
        "columns": [
            { 
                data: "created_at", title: "Created Date", sWidth: '20%',
                render: function(data, type, row, meta){
                    return niceDate(data);
                }
            },
            {   
                data: null, title: "Agent Profile", sWidth: '20%' ,
                render: function(data, type, row, meta){
                    if (row.agent !== null) {
                        var url = WEBSITE_URL+'page-three.html?agent_id='+row.agent;
                        return "<a class='agent-profile-link' href='"+url+"' target='_blank'>"+row.agent_name+"</a>";
                    } else {
                        return 'Not Found';
                    }
                    
                }
            },
            {   
                data: "address_text", title: "Street Address", sWidth: '20%',
                render: function(data) {
                    return data;
                }
            },
            // {   
            //     data: "email", title: "Decision Deadline", sWidth: '20%',
            //     render: function(data, type, row, meta){
            //         return decisionDeadline(row.created_at)+' Hours';
            //     }
            // }
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.id);
        }
    });
}

function initNewAgentUnmarked() {
    $('#newAgentOpendataTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort":false,
        "bAutoWidth": false, 
        "ajax": function(data, callback, settings) {
            $.get(API_URL+'web-agent/?has_seen=no', {
                page: offsetToPageno(data.start),
            }, function(res) {
                notificationBadge('newAgent-tab-classic', 'New Agent', res.count);
                callback({
                    recordsTotal: res.count,
                    recordsFiltered: res.count,
                    data: res.results
                });
            });
        },
        "columns": [
            { 
                data: "created_at", title: "Created Date", sWidth: '20%',
                render: function(data, type, row, meta){
                    return niceDate(data);
                }
            },
            {   
                data: "full_name", title: "Agent Name", sWidth: '20%',
            },
            {   
                data: "agent_profile_connector", title: "Profile Link", sWidth: '20%' ,
                render: function(data, type, row, meta){
                    if (row.agent_profile_connector !== null) {
                        var url = WEBSITE_URL+'page-three.html?agent_id='+row.agent_profile_connector;
                        return "<a class='agent-profile-link' href='"+url+"' target='_blank'>"+row.zillow_agent_name+"</a>";
                    } else {
                        return 'Not Attached';
                    }
                    
                }
            },
            {   
                data: "social_provider", title: "Source", sWidth: '20%',
            },
            {   
                data: null, sWidth: '20%',
                render: function(data, type, row, meta){
                    return '<button class="btn btn-success new-agent-marked" data-id="'+row.id+'">Mark as Read</button>';
                }
            }
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.id);
        }
    });
}

function initNewAgentmarked() {
    $('#newAgentCloseddataTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort":false,
        "bAutoWidth": false, 
        "ajax": function(data, callback, settings) {
            $.get(API_URL+'web-agent/?has_seen=yes', {
                page: offsetToPageno(data.start),
            }, function(res) {
                callback({
                    recordsTotal: res.count,
                    recordsFiltered: res.count,
                    data: res.results
                });
            });
        },
        "columns": [
            { 
                data: "created_at", title: "Created Date", sWidth: '20%',
                render: function(data, type, row, meta){
                    return niceDate(data);
                }
            },
            {   
                data: "full_name", title: "Agent Name", sWidth: '20%',
            },
            {   
                data: "agent_profile_connector", title: "Profile Link", sWidth: '20%' ,
                render: function(data, type, row, meta){
                    if (row.agent_profile_connector !== null) {
                        var url = WEBSITE_URL+'page-three.html?agent_id='+row.agent_profile_connector;
                        return "<a class='agent-profile-link' href='"+url+"' target='_blank'>"+row.zillow_agent_name+"</a>";
                    } else {
                        return 'Not Attached';
                    }
                    
                }
            },
            {   
                data: "social_provider", title: "Source", sWidth: '20%',
            },
            {   
                data: null, title:"Marked By",sWidth: '20%',
                render: function(data, type, row, meta){
                    return 'Anna';
                }
            }
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.id);
        }
    });
}

function disputeDetail() {
    settings = get_settings('reclaim/'+reclaimId+'/', 'GET');
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

function transactionDetail() {
    settings = get_settings('agent-list-update/'+transactionId+'/', 'GET');
    settings['headers'] = {};
    $.ajax(settings).done(function (response) {
        var res = JSON.parse(response);
        
        $('.agent-name').text(res.agent_name);
        $('.dis-date').text(niceDate(res.created_at));

        $('.trans-address').text(res.address_text);
        $('.trans-city').text(res.city);
        $('.trans-state').text(res.state);
        $('.trans-zipcode').text(res.zipcode);
        $('.trans-type').text(res.home_type);
        $('.trans-represented').text(res.represented);
        $('.trans-list-date').text(niceDate(res.list_date));
        $('.trans-sold-date').text(niceDate(res.sold_date));
        $('.trans-list-price').text(currencyFormat(res.list_price_int));
        $('.trans-sold-price').text(currencyFormat(res.sold_price_int));
        
        // $('.transaction-decision').text(transactionDecision(res.record_status));

        // if (res.record_status == 'pending') {
        //     transactionPendingShow();
        // } else {
        //     transactionPendingShow(false);
        // }
        
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

function transactionUpdate(data) {
    settings = get_settings('agent-list-update/'+transactionId+'/', 'PUT', JSON.stringify(data));
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        transactionPendingShow(false);
    });
}

function newAgentUpdate(data, id) {
    settings = get_settings('web-agent/'+id+'/', 'PUT', JSON.stringify(data));
    settings['headers'] = null;
    $.ajax(settings).done(function (response) {
        reloadNewAgentData();
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

function reloadAgentTransactionData() {
    setTimeout(function() { 
        $('#transactionEditsOpendataTable').DataTable().ajax.reload();
        $('#transactionEditsCloseddataTable').DataTable().ajax.reload();
    }, 1000);
}

function reloadNewAgentData() {
    setTimeout(function() { 
        $('#newAgentOpendataTable').DataTable().ajax.reload();
        $('#newAgentCloseddataTable').DataTable().ajax.reload();
    }, 100);
}

$(document).ready(function(){
    // START: PROFILE DISPUTE
    initDisputePending();
    initDisputeDecision();

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
    // END: PROFILE DISPUTE

    // START: KEYWORD ALERT
    initKeywordAlertUnmarked();
    initKeywordAlertmarked();

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
    // END: KEYWORD ALERT

    // START: TRANSACTION EDIT
    initTransactionEditPending();
    initTransactionEditDecided();

    $('#transactionEditsOpendataTable').on( 'click', 'tr', function (e) {
        if ($(e.target).attr('class') == 'agent-profile-link') {
            var url = $(e.target).attr('href');
            window.open(url);
            return false;
        }

        if ($(e.target).attr('class') == 'btn btn-success transaction-marked') {
            $(this).attr('disabled', true);
            transactionId = $(this).data('id');
            var data = {
                'record_status': 'mark',
            };
            transactionUpdate(data);
            reloadAgentTransactionData();
            return false;
        }

        $('.transactionEditsInfo').show();
        $("#transactionEditsOpendataTable").parent().hide(); 
        $("#transactionEditsOpendataTable_wrapper").hide();

        transactionId = $(this).data('id');
        transactionDetail(transactionId);
    });

    $('#transactionEditsCloseddataTable').on( 'click', 'tr', function (e) {
        if ($(e.target).attr('class') == 'agent-profile-link') {
            var url = $(e.target).attr('href');
            window.open(url);
            return false;
        }

        $('.closedtransactionEditsInfo').show();
        $("#transactionEditsCloseddataTable").parent().hide(); 
        $("#transactionEditsCloseddataTable_wrapper").hide();

        transactionId = $(this).data('id');
        transactionDetail(transactionId);
    });

    $('.transactionEdits-backIcon').on( 'click', function (e) {
        $("#transactionEditsOpendataTable").parent().show(); 
        $("#transactionEditsOpendataTable_wrapper").show();
        $('.transactionEditsInfo').hide();
    });
    
    $('.closedtransactionEditsInfo-backIcon').on( 'click', function () {
        $("#transactionEditsCloseddataTable").parent().show(); 
        $("#transactionEditsCloseddataTable_wrapper").show();
        $('.closedtransactionEditsInfo').hide();
    }); 
    
    // $('.accept-submit-btn').on('click', function(){
    //     $('.transaction-decision-reason').html($('.getAcceptReason').val());
    //     $('.transaction-decision').text('Accept');

    //     var data = {
    //         'record_reason': $('.getAcceptReason').val(),
    //         'record_status': 'accept',
    //     };
    //     transactionUpdate(data);

    //     reloadAgentTransactionData();

    //     $('.getAcceptReason').val('');
    // });


    // $('.decline-submit-btn').on('click', function(){
    //     $('.transaction-decision-reason').html($('.getDeclineReason').val());
    //     $('.transaction-decision').text('Decline');

    //     var data = {
    //         'record_reason': $('.getDeclineReason').val(),
    //         'record_status': 'decline',
    //     };
    //     transactionUpdate(data);

    //     reloadAgentTransactionData();

    //     $('.getDeclineReason').val('');
    // });
    // END: TRANSACTION EDIT
    
    // START: KEYWORD ALERT
    initNewAgentUnmarked();
    initNewAgentmarked();

    $(document).on('click', '.new-agent-marked',function(){
        var data = {
            'has_seen': 'yes',
        };
        newAgentUpdate(data, $(this).data('id'));
    });
    // END: KEYWORD ALERT
    
});