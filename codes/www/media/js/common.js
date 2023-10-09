API_URL = 'https://app.realtorstat.com/api/';
// API_URL = 'http://localhost:8000/api/';
WEBSITE_URL = 'https://agentstat.com/';


function get_settings(url, method, data=null) {
	return {
	  'async': true,
	  'crossDomain': true,
	  'headers': {
		'Authorization': 'Token ' + localStorage.getItem('session_id'),
	  },
	  'url': API_URL + url,
	  'method': method,
	  'processData': false,
	  'data': data,
	  'contentType': 'application/json',
	  'mimeType': 'multipart/form-data',
	}
}

function offsetToPageno(offset) {
    return  Math.floor(offset/10)+1;
}

function formatAMPM(timedate) {
	const date = new Date(timedate);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

function nth(d) {
	if (d > 3 && d < 21) return 'th';
	switch (d % 10) {
		case 1:  return "st";
		case 2:  return "nd";
		case 3:  return "rd";
		default: return "th";
	}
}

function niceDate(timedate, withyear=true) {
	const fortnightAway = new Date(timedate);
	const date = fortnightAway.getDate();
	const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][fortnightAway.getMonth()];

	if (withyear) {
		var cdate = `${month} ${date}${nth(date)}, ${fortnightAway.getFullYear()}`;
	} else {
		var cdate = `${month} ${date}${nth(date)}`;
	}
	return cdate;
}

function niceDateTime(timedate) {
	var datetime = `${niceDate(timedate)} at ${formatAMPM(timedate)}`;
	return datetime; 
}

function notificationBadge(id, text, count) {
	if (count > 0) {
		$('#'+id).html(text+' <span class="badge">'+count+'</span>');
	} else {
		$('#'+id).html(text);
	}
}

function currencyFormat(num) {
	return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}


function populateLeads(data) {
    

    var leadList = document.getElementById('leadList');
    if (typeof data === 'string') {
        try {
          var data = JSON.parse(data);
          if (Array.isArray(data)) {
            data.forEach(function (lead) {
             
              var li = document.createElement('li');
              li.textContent = "Name: " + lead.name + ", Email: " + lead.email;
              sendEmail(lead);
              
              leadList.appendChild(li);
            });
          } else {
            console.error('Parsed data is not an array.');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
      else {
        console.error('Invalid data format.');
      }
}


// Function to check authentication
function checkAuth() {
    var pageName = window.location.pathname.split("/")[1];
    var sessionId = localStorage.getItem('session_id');
    
    if (pageName != '' && pageName != 'login') {
        if (sessionId !== null && sessionId !== 'null' && sessionId !== '') {
		
            var settings = get_settings("leads", "GET");
                $.ajax(settings).done(function (response) {
                populateLeads(response);
            }).fail(function (err) {
                console.error("AJAX Request Failed:");
                console.error(err);
            });
            
            
        } else {
            window.location = '/';
        }   
    } else {
        if (sessionId !== null && sessionId !== 'null' && sessionId !== '') {
            settings = get_settings('is-valid-token/', 'GET');
            $.ajax(settings).done(function (response) {
                window.location = '/dashboard/';
            }).fail(function(err) {
                localStorage.clear();
            });
        }
    }
}

function getUserDataStorage(key) {
    var data = JSON.parse(localStorage.getItem('user_data'));
    if (data && key in data) {
        return data[key];
    } else {
        return false;
    }
}

function setUserDataStorage(key, val) {
    var data = JSON.parse(localStorage.getItem('user_data'));
    data[key] = val;
    localStorage.user_data = JSON.stringify(data);
}

function logout_session() {
	localStorage.clear();
    window.location = '/';
}

function agentProfileUrl(slug) {
    return WEBSITE_URL+'profile/'+slug;
}

function agentProfileLink(slug, linkText, id=null) {
    if (slug != null && slug != 'null' && slug != '') {
        var url = agentProfileUrl(slug)
        return "<a class='agent-profile-link' href='"+url+"' target='_blank'>"+linkText+"</a>";
    } if (id != null && id != 'null' && id != '') {
        var url = agentProfileUrl(id)
        return "<a class='agent-profile-link' href='"+url+"' target='_blank'>"+linkText+"</a>";
    } else {
        return 'Un-attached';
    }
}

function loadGeneralData() {
    settings = get_settings('admin-general-data/', 'GET');
    $.ajax(settings).done(function (res) {
        response = JSON.parse(res);
        notificationBadge('message-alert-sidebar', 'Alerts/Messages', response.message_alert);
        notificationBadge('manual-account-sidebar', 'Manual Accounts', response.manual_account);
    });
}

function sidebarLinkActive() {
    var pageName = window.location.pathname.split("/")[1];
    $('ul .nav-item').removeClass('active');
    $( "a[page~='"+pageName+"']").closest('.nav-item').addClass('active');
}

function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '')
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }
    return null
  }

$(document).ready(function() {
    checkAuth();
    loadGeneralData();
    sidebarLinkActive()

    $("body").delegate(".logout-btn", "click", function(e) {
        logout_session();
    });
});
