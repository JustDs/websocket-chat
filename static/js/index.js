(function () {

	document.addEventListener('DOMContentLoaded', function (event) {

		var messageBox = document.getElementById('message-box');
		var sendButton = document.getElementById('btn-send');
		var addressBox = document.getElementById('server-address');
		var openButton = document.getElementById('btn-open');
		var closeButton = document.getElementById('btn-close');
		var connectPanel = document.getElementById('connect-panel');
		var messageWrap = document.getElementById('message-wrap');
		var messageList = document.getElementById('message-list');


		var appendMessage = function (type, message) {

			messageList.insertAdjacentHTML('beforeend',
				'<li class="' + type + '">' + message.replace(/\n/g, '<br />') + '</li>');

			messageWrap.scrollTop = messageWrap.scrollHeight;
		}

		var connection = null;

		openButton.addEventListener('click', function (event) {

			event.preventDefault();

			if (!connection) {

				var address = addressBox.value;

				connection = new WebSocket(address);

				connection.addEventListener('open', function (event) {

					console.log('Connection opened.');

					openButton.innerHTML = '';

					connectPanel.classList.add('folded');
				});

				connection.addEventListener('message', function (event) {

					console.log('Message received: "' + event.data + '"');

					appendMessage('received-message', event.data);
				});

				connection.addEventListener('close', function (event) {

					console.log('Connection closed.');
				});

				connection.addEventListener('error', function (event) {

					console.log('An error occurred:');
					console.dir(event);
				});
			}
		});

		closeButton.addEventListener('click', function (event) {

			event.preventDefault();

			if (connection) {

				connection.close();

				connection = null;

				connectPanel.classList.remove('folded');
			}
		});

		sendButton.addEventListener('click', function (event) {

			event.preventDefault();

			var message = messageBox.value;

			if (connection && message.length) {

				appendMessage('sent-message', message);

				connection.send(message);

				messageBox.value = '';
				messageBox.rows = 1;
				messageBox.focus();
			}
		});

		messageBox.addEventListener('input', function (event) {

			messageBox.rows = 1;

			while (messageBox.scrollHeight > messageBox.clientHeight && messageBox.rows < 3 ) {

				messageBox.rows++;
			}
		});
	});

})();