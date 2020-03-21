$(document).ready(function() {
	var name, value, status, sencondTime;
	var str = location.href; //取得整个地址栏
	var num = str.indexOf("?")
	str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
	console.log(str);
	var arr = str.split("=");
	console.log(arr);
	if (arr[1]) {
		checkPaymentDone(arr[1])
	};
	var timeId;
	var checkId = null;
	var i = 0;


	function checkPaymentDone(no) {
		var url = 'https://payapi.yixelnb.cn' + '/collect/transaction/query';
		// var url = 'http://192.168.110.161:9006' + '/collect/transaction/query';
		$.ajax({
			async: false, //同步，异步
			url: url, //请求的服务端地址
			data: {
				transfer_no: no
			},
			type: "post",
			dataType: "json",
			success: function(data) {
				console.log(data);
				const orderStatus = data.order.status;
				const payUrl = data.order.status;
				if (orderStatus == 'INIT') {
					$('#orderStatus').text('订单初始化中...')
					timeId = setInterval(function() {
						getOrder(no)
					}, 2000);
				} else if (orderStatus == 'PAYING') {
					timeId = setInterval(function() {
						getOrder(no)
					}, 2000);
				} else if (orderStatus == 'SUCCESS') {
					$('#orderStatus').text('订单支付成功')
					window.location.replace("success.html")
				} else if (orderStatus == 'FAILED' || orderStatus == 'TIMEOUT') {
					$('#orderStatus').text('订单支付失败')
					window.location.replace("fail.html")
				}
			},
			error: function() {
				// alert('error'); //错误的处理
				return false;
			}
		});
	}

	function getOrder(no) {
		var url = 'https://payapi.yixelnb.cn' + '/collect/transaction/query';
		// var url = 'http://192.168.110.161:9006' + '/collect/transaction/query';

		$.ajax({
			async: false, //同步，异步
			url: url, //请求的服务端地址
			data: {
				transfer_no: no
			},
			type: "post",
			dataType: "json",
			success: function(data) {
				//成功之后的处理，返回的数据就是 data
				const orderStatus = data.order.status;
				if (orderStatus == 'PAYING') {
					console.log(i)
					if(i==0){
						i++
						creatCode2(data.order.pay_url)
						$('#orderStatus').text('订单支付中...')
						$('.timeLeft').css('display', 'block')
						$('#timeCut').css('display', 'block')
						$('#alipay').css('display', 'block')
					}else{					
						$('#orderStatus').text('订单支付中...')
						$('.timeLeft').css('display', 'block')
						$('#timeCut').css('display', 'block')
						$('#alipay').css('display', 'block')
					}
					sencondTime = data.order.create_time;
					timer;
				} else if (orderStatus == 'SUCCESS') {
					i=0
					$('#orderStatus').text('订单支付成功')
					clearInterval(timeId)
					clearInterval(timer)
					window.location.replace("success.html")
				} else if (orderStatus == 'FAILED' || orderStatus == 'TIMEOUT') {
					i=0
					$('#orderStatus').text(' ')
					clearInterval(timeId)
					clearInterval(timer)
					window.location.replace("fail.html")
				}
			},
			error: function() {
				alert('error'); //错误的处理

			}
		});
	}
	var maxtime = 5 * 60; //5分钟，按秒计算，自己调整!
	function CountDown() {
		const creatTime = moment(sencondTime).format("YYYY-MM-DD HH:mm:ss")
		const currenTime = moment().format('YYYY-MM-DD HH:mm:ss');
		const seconds = moment(currenTime).diff(creatTime, "seconds");
		if (seconds > 300) {
			clearInterval(timer);
			$("#timeCut").text('已超时');
			window.location.replace("fail.html")
		} else {
			const second = maxtime - seconds
			if (second >= 0) {
				msg = " " + second + "秒";
				$("#timeCut").text(msg);
			} else {
				clearInterval(timer);
				$("#timeCut").text('已超时');
				window.location.replace("fail.html")
			}
		}
	}
	var timer = setInterval(function() {
		CountDown()
	}, 1000);

	function creatCode2(e) {
		console.log(e)
		var qrcode = new QRCode("qrcode2", {
			text: e,
			width: 200,
			height: 200,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: QRCode.CorrectLevel.L
		});
	}
})
