const axios = require('axios')


export function send(to: any, notification: any, data: any) {
	return new Promise((resolve: any, rejected: any) => {
	  const content = { to, notification, data };

	  const options = {
	    headers: {
	      'Content-Type': 'application/json',
	      "Authorization": "key=AAAA6j2FCCs:APA91bEBulRwrNmYMqIN3MK7jlWdOKTRlrRjju5sZcrygLRuKYIpnlQaypA44bf0Fl35Kej-vZoVR-LNDQZ2-zKS_7-QDgfG6uawwAS6XRUPaztgRIuX61s3G7SChn0KsU7Ta9SCBzjC"
	    }
	  }

	  axios.post('https://fcm.googleapis.com/fcm/send', content, options)
	    .then((res: any) => {
	     	resolve({ response: res.data, status: res.statusCod })
	    }).catch((error: any) => {
	      rejected(error);
    	})
	})
}