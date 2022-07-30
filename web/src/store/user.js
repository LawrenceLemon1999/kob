import $ from 'jquery'

export default ({
    state: {
        id: "",
        username: "",
        photo: "",
        token: "",
        is_login: false,
        pulling_info: true,//表示当前是否在获取信息中，如果是的话，就不要展示登录界面
    },
    getters: {
    },
    mutations: {
        updateUser(state, user) {
            state.id = user.id;
            state.username = user.username;
            state.photo = user.photo;
            state.is_login = user.is_login;
        },
        updateToken(state, token) {
            state.token = token;
        },
        logout(state) {
            state.id = "";
            state.username = "";
            state.photo = "";
            state.token = "";
            state.is_login = false;
        },
        updatePullingInfo(state, pulling_info) {
            state.pulling_info = pulling_info;
        }
    },

    //mutation里的操作都不是异步的，action是
    //比如下面的ajax需要和server通信，有个等待时间，浏览器在等待的时候可以先去执行别的函数，这就是异步。
    //action不能直接修改state
    //调用mutation的方法是使用commit，调用actions里的方法是用dispatch
    //同步的操作放在mutations里，异步的放在actions里

    //同步的操作放在mutations里，异步的放在actions里
    actions: {
        login(context, data) {
            $.ajax({
                url: "http://localhost:3000/user/account/token/",
                type: "POST",
                data: {
                    username: data.username,
                    password: data.password,
                },
                success(resp) {
                    //想要调用mutations里的函数，需要用commit
                    if (resp.error_message === "success") {
                        localStorage.setItem("jwt_token", resp.token);
                        context.commit("updateToken", resp.token);
                        data.success(resp);
                    }
                    else {
                        data.error(resp);
                    }
                },
                error(resp) {
                    data.error(resp);
                }
            });
        },
        getinfo(context, data) {
            $.ajax({
                url: "http://localhost:3000/user/account/info/",
                type: "GET",
                headers: {
                    Authorization: "Bearer " +
                        context.state.token,
                },
                success(resp) {
                    // console.log(resp);
                    if (resp.error_message === "success") {
                        context.commit("updateUser", {
                            ...resp,//这里是解析resp
                            is_login: true,
                        });
                        data.success(resp);
                    }
                    else {
                        data.error(resp);
                    }
                },
                error(resp) {
                    data.error(resp);
                }
            });
        },
        logout(context) {
            localStorage.removeItem("jwt_token");
            context.commit("logout");
        }
    },
    modules: {
    }
})
