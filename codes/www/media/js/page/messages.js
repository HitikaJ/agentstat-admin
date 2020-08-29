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

$(document).ready(function(){
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
                        var url = WEBSITE_URL+'page-three.html?agent_id='+row.id;
                        return "<a href='"+url+"' target='_blank'>"+row.connector.agent_name+"</a>";
                    } else {
                        return 'Not Found';
                    }
                    
                }
            },
            {   
                defaultContent: 'Both', title: "Proof Provided By", sWidth: '20%'
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


    jQuery('#profileDisputeOpendataTable').on( 'click', 'tr', function () {
        jQuery('.profileDisputeInfo').show();
        jQuery("#profileDisputeOpendataTable").parent().hide(); 
        jQuery("#profileDisputeOpendataTable_wrapper").hide();

        var reclaimId = $(this).data('id');

        settings = get_settings('reclaim-dispute/'+reclaimId, 'GET');
        settings['headers'] = {};
        $.ajax(settings).done(function (response) {
            var response = JSON.parse(response);
            $('.dis-username').text(response.full_name);
            $('.dis-email').text(response.email);
            $('.dis-phone').text('111-222-3333');
            $('.dis-date').text(niceDate(response.created_at));

            $('.agent-name').text(row.connector.agent_name);
            
            $('.dis-photoid').attr('src', response.id_picture);
            $('.fancy-dis-photoid').attr('href', response.id_picture);

            $('.dis-licenseid').attr('src', response.real_estate_license);
            $('.fancy-dis-licenseid').attr('href', response.real_estate_license);
            
        }).fail(function(err) {
            console.log(err.responseText);
        });
    });
});