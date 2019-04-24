var app = new Vue({
	el: "#app",
	data: {
		username: "加载中...",
		email: "加载中...",
		phone: "加载中...",
		history: [],
		currtime: new Date().getTime()
	},
	mounted() {
		this.init();
	},
	computed: {
		historyWeek: function() {
			return this.listHistoryByDay(null, 7);
		},
		historyMonth: function() {
			return this.listHistoryByDay(7, 30);
		},
		historyYear: function() {
			return this.listHistoryByDay(365, null);
		}
	},
	methods: {
		dataFormat:function(time){
			return new Date(time).format("yyyy-MM-dd hh:mm:ss");
		},
		listHistoryByDay: function(start, stop) {
			var baseTime = 1000 * 60 * 60 * 24;
			var currtime = new Date().getTime();
			var result = new Array();
			for(var i = 0; i < this.history.length; i++) {
				if(start != null) {
					if((this.history[i].time + baseTime * start)>=currtime){
						continue;
					}
				}
				if(stop != null) {
					if((this.history[i].time + baseTime * stop)<=currtime){
						continue;
					}
				}
				result.push(this.history[i]);
			}
			return result;
		},
		init: function() {
			firebase.auth().onAuthStateChanged(function(user) {
				if(user) {
					app.exists();
					firebase.auth().onAuthStateChanged(function(user) {
						var user = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
						user.once("value").then(function(snapshot) {
							var data = snapshot.val();
							console.log(data);
							app.username = data.username;
							app.email = data.email;
							app.phone = data.phone;
							app.history = data.history;
						})
					});
				} else {
					window.location.href = "signin.html";
				}
			});
		},
		exists: function() {
			var user = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
			user.once("value")
				.then(function(snapshot) {
					if(snapshot.exists() == false) {
						firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
							username: "defaultUserName",
							email: "defaultEmail",
							phone: "defaultPhone",
							history: [{
								username: "defaultUserName",
								email: "defaultEmail",
								phone: "defaultPhone",
								time: new Date().getTime()
							}]
						});
						console.log("dd\;");
					}
					console.log("ok")
				});
		},
		signout: function() {
			firebase.auth().signOut().then(function() {
				window.location.href = "signin.html";
			}).catch(function(error) {
				alert("注销失败");
			});
		},
		edit: function() {
			var input = document.getElementsByTagName("input");
			for(var j = 0; j < input.length; j++) {
				input[j].readOnly = false;
			}
		},
		submit: function() {
			var user = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
			user.once("value").then(function(snapshot) {
				var data = snapshot.val();
				app.history.push({
					username: data.username,
					email: data.email,
					phone: data.phone,
					time: new Date().getTime()
				})
			})

			firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
				username: app.username,
				email: app.email,
				phone: app.phone,
				history: app.history
			});
		}
	}
});