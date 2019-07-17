function getIndex(list, id) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }

    return -1;
}


var postApi = Vue.resource('/blog{/id}');
var userApi = Vue.resource('/user');

Vue.component('post-form', {
    props: ['blog', 'postAttr'],
    data: function () {
        return {
            text: '',
            id: ''
        }
    },
    watch: {
        postAttr: function (newVal) {
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template:
    '<div class="form-group form-inline">' +
    '<textarea style="width: 70%; margin: 10px;" class="form-control" type="text" placeholder="Write post" v-model="text" />' +
    '<input class="btn btn-primary" type="button" value="Save" @click="save" />' +
    '</div>',
    methods: {
        save: function () {
            var post = {text: this.text};

            if (this.id) {
                postApi.update({id: this.id}, post).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.blog, data.id);
                        this.blog.splice(index, 1, data);
                        this.text = ''
                        this.id = ''
                    })
                )
            } else {
                postApi.save({}, post).then(result =>
                    result.json().then(data => {
                        this.blog.push(data);
                        this.text = ''
                    })
                )
            }
        }
    }
});

Vue.component('post-row', {
    props: ['post', 'editMethod', 'blog'],
    data: function () {
        return {
            userName: null
        }
    },
    template: '<div style="margin: 10px;" class="card">' +
    '<div class="card-body">' +
    '<p class="card-text"><i>({{ post.id }})</i> {{ post.text }}</p>' +
    '<p class="card-text">Author: {{ post.auth }}</p>' +
    '<div v-if="userName !== null">' +
    '<input style="margin-right: 10px;" class="btn btn-primary" v-if="userName.bodyText == post.auth" type="button" value="Edit" @click="edit" />' +
    '<input class="btn btn-primary" v-if="userName.bodyText == post.auth" type="button" value="X" @click="del" />' +
    '</div>' +
    '</div>' +
    '</div>',
    methods: {
        edit: function () {
            this.editMethod(this.post);
        },
        del: function () {
            postApi.remove({id: this.post.id}).then(result => {
                if (result.ok) {
                    this.blog.splice(this.blog.indexOf(this.post), 1)
                }
            })
        }
    },
    created: function () {
        userApi.get().then(result =>
            this.userName = result
        )
    },
});

Vue.component('blog-list', {
    // props: ['blog'],
    data: function () {
        return {
            post: null,
            search: null,
            blog: []
        }
    },
    template:
    '<div>' +
    '<input type="text" @keypress="onlyNumber" @input="addEvent" @change="addEvent" placeholder="Find by id" style="width: 70%; margin: 10px;"/>' +
    '<post-form :blog="blog" :postAttr="post" />' +
    '<div class="card-columns">' +
    '<post-row v-for="post in blog" :key="post.id" :post="post" ' +
    ':editMethod="editMethod" :blog="blog" />' +
    '</div>' +
    '</div>',
    created: function () {
        if (typeof(this.search) !== "undefined" && this.search !== null) {
            postApi.get({id: this.search}).then(result =>
                result.json().then(data =>
                    data.forEach(post => this.blog.push(post))
                )
            )
        } else {
            postApi.get().then(result =>
                result.json().then(data =>
                    data.forEach(post => this.blog.push(post))
                )
            )
        }
    },
    methods: {
        editMethod: function (post) {
            this.post = post;
        },
        addEvent({type, target}) {
            const event = {
                type,
                target: {
                    value: target.value,
                }
            }
            this.search = event.target.value;
            if (typeof(this.search) !== "undefined" && this.search !== null) {
                this.blog = [];
                postApi.get({id: this.search}).then(result =>
                    result.json().then(data =>{
                        if(data[0] == null){  } else {
                        data.forEach(post => this.blog.push(post))}}
                    )
                )
            } else {
                this.blog = [];
                postApi.get().then(result =>
                    result.json().then(data =>
                        data.forEach(post => this.blog.push(post))
                    )
                )
            }

        },
        onlyNumber($event) {
            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
            if ((keyCode < 48 || keyCode > 57)) {
                $event.preventDefault();
            }
        }
    }
});

Vue.component('blog-user', {
    data: function () {
        return {
            userName: null
        }
    },
    template:
        '<nav class="navbar navbar-expand-lg navbar-light bg-light" v-if="userName !== null"><a class="navbar-text" href="/logout" method="post"><span>{{userName.bodyText}} logout</span></a></nav>\n',
    created: function () {
        userApi.get().then(result =>
            this.userName = result
        )
    },
});

var app = new Vue({
    el: '#app',
    template: '<blog-list/>',
    // data: {
    //     blog: []
    // }
});

var appUser = new Vue({
    el: '#app-user',
    template: '<blog-user/>',
});