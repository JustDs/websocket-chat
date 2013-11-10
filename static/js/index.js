(function () {

	document.addEventListener('DOMContentLoaded', function (event) {

		var appendMessage = function (messageHtml) {

			var container = document.getElementById('message-wrap');
			var messageList = document.getElementById('message-list');

			var originalHeight = container.scrollHeight;

			messageList.insertAdjacentHTML('beforeend', messageHtml);

			container.scrollTop = container.scrollHeight;
		}

		var connection = null;

		document.getElementById('btn-open').addEventListener('click', function (event) {

			event.preventDefault();

			if (!connection) {

				var address = document.getElementById('server-address').value;

				connection = new WebSocket(address);

				connection.addEventListener('open', function (event) {

					console.log('Connection opened.');

					document.getElementById('message-list').innerHTML = '';

					document.getElementById('connect-panel').classList.add('folded');
				});

				connection.addEventListener('message', function (event) {

					console.log('Message received: "' + event.data + '"');

					appendMessage('<li class="received-message">' + event.data + '</li>');
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

		document.getElementById('btn-close').addEventListener('click', function (event) {

			event.preventDefault();

			if (connection) {

				connection.close();

				connection = null;

				document.getElementById('connect-panel').classList.remove('folded');
			}
		});

		document.getElementById('btn-send').addEventListener('click', function (event) {

			event.preventDefault();

			var message = document.getElementById('message').value;

			if (connection && message.length) {

				appendMessage('<li class="sent-message">' + message + '</li>');

				connection.send(message);

				document.getElementById('message').value = '';
				document.getElementById('message').focus();
			}
		});
	});

})();