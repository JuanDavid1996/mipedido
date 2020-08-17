const axios = require('axios')


export function send(to: string, data: any, registrationIds?: string[]) {
	return new Promise((resolve: any, rejected: any) => {
	  
	  const content: any = { 
	  	to,
	  	data,
	  	android: {
	  		priority: "hight"
	  	}
	  };

	  if (registrationIds) {
	  	content.registrationIds = registrationIds
	  	delete content.to;
	  }

	  console.log("before to send to pn: ", content)

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
			console.log("Error when try to send pn ", error);
	      rejected(error);
    	})
	})
}


export async function notifyNewOrder(registrationIds: string[], order: any) {
	console.log("registrationIds ", registrationIds)
	const content = {
		title: "Nuevo pedido",
		body: "Desde " + order.origin + " a " + order.destination,
		priority: "hight",
	}

	const data = { notification: {...content, order: order._id } }

	try { await send("", data, registrationIds); }
	catch(e) {}
}