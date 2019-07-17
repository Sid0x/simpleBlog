Vue.component('login', {
    template: '<form style="padding: 10px" th:action="@{/login}" method="post">\n' +
    '<div class="form-group">' +
    '<div><label> User Name : </label><input style="margin: 10px; width: 70%;" class="form-control" type="text" name="username"/></div>\n' +
    '<div><label> Password: </label><input style="margin: 10px; width: 70%;" class="form-control" type="password" name="password"/></div>\n' +
    '</div>' +
    '<input style="margin: 10px" class="btn btn-primary" type="submit" value="Sign In"/>' +
    '<a style="margin: 10px" class="btn btn-primary" href="/registration">Add new user</a>' +
    '</form>'
});

var app = new Vue({
    el: '#app',
    template: '<login/>',

});