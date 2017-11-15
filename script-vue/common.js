Zepto(function ($) {
	var app = new Vue({
		data: {
			a: 2,
			b: 4,
			message: "hello vue!",
			seen: true,
			counter: 0,
			todos: [
				{
					text: "学习JavaScript"
        },
				{
					text: "学习 Vue"
        },
				{
					text: "整个 牛项目"
        }
      ]
		},
		methods: {
			// ...
			doSomething: function () {
				// 修改数据
				this.message = 'changed'
				// DOM 还没有更新
				this.$nextTick(function () {
					// DOM 现在更新了
					// `this` 绑定到当前实例
					this.doSomethingElse()
				})
			},
			doSomethingElse: function () {
				this.seen = false;
			}
		},

	}).$mount('#app')


	app.$on('test', function (msg) {
		console.log(msg)
	})
	app.$emit('test', {
		"id": 'message'
	})
	// 函数
	app.$watch(
		function () {
			return this.a + this.b
		},
		function (newVal, oldVal) {
			alert(newVal)
		}
	)
	console.log(app.message);
	console.log(app.$el);
	console.log(document.getElementById('app'));
})

// alert(app)
