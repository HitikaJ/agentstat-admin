function initAgentProfiles() {
    $('#agentProfilesTable').DataTable( {
        "processing": true,
        "serverSide": true,
        "bPaginate": true,
        "bLengthChange": false,
        "bFilter": false,
        "bSort":false,
        "bAutoWidth": false, 
        "ajax": function(data, callback, settings) {
            $.ajax({
                url: API_URL+'profiles/?page='+offsetToPageno(data.start),
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('session_id'));},
                success: function(res) { 
                    callback({
                        recordsTotal: res.count,
                        recordsFiltered: res.count,
                        data: res.results
                    });
                }
            });
        },
        "columns": [
            { 
                data: null, title: "Agent Name", sWidth: '20%',
                render: function(data, type, row, meta){
                    return agentProfileLink(row.connector.screen_name, row.connector.agent_name, row.connector.id);
                }
            },
            { 
                data: "email", title: "Email", sWidth: '20%',
                render: function(data, type, row, meta){
                    return data;
                }
            },
            { 
                data: "phone_number", title: "Phone #", sWidth: '20%',
                render: function(data, type, row, meta){
                    return data;
                }
            },
            { 
                data: null, title: "Unclaim", sWidth: '20%',
                render: function(data, type, row, meta){
                    return '<a id="'+row.connector.id+'" href="javascript:void(0)" class="unclaim">Unclaim</a>';
                }
            },
        ],
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('data-id', data.id);
        }
    });
}

$(document).ready(function(){
    initAgentProfiles();

    $("body").delegate(".unclaim", "click", function(e) {        
        var r = confirm("Are you sure to unclaim? This cannot be undo.");
        if (r == true) {
            $.ajax({
                url: API_URL+'unclaim/?agent_id='+ $(this).attr('id'),
                type: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('session_id'));},
                success: function(res) { 
                    setTimeout(function() { 
                        $('#agentProfilesTable').DataTable().ajax.reload();
                    }, 100);
                }
            });
        }         
	})
});