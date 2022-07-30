<template>
    <ContentField v-if="!$store.state.user.pulling_info">
        <!-- <ContentField> -->

        <!-- 如果正在拉取信息的话， 就先不要展示登录界面 -->
        <!-- 这里是bootstrap里的grids，把界面分成12份 -->
        <div class="row justify-content-md-center">
            <div class="col-3">

                <!-- 阻止默认的提交行为 -->
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <!-- 这里是前端的内容，这俩是要同时出现的，上面的for和下面的id是对应的 -->
                        <label for="username" class="form-label">用户名</label>
                        <input v-model="username" type="text" class="form-control" id="username" placeholder="请输入用户名">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">密码</label>
                        <input v-model="password" type="password" class="form-control" id="password"
                            placeholder="请输入密码">
                    </div>
                    <div class="error-message">
                        {{ error_message }}
                    </div>
                    <button type="submit" class="btn btn-primary">提交</button>
                </form>
            </div>
        </div>



    </ContentField>
</template>

<script>
import ContentField from '@/components/ContentField.vue'
import { useStore } from 'vuex'
import { ref } from 'vue'
import router from '../../../router/index'

export default {
    name: 'UserAccountLoginView',
    components: {
        ContentField,
    },
    setup() {
        const store = useStore();
        let username = ref("");
        let password = ref("");
        let error_message = ref("");

        const jwt_token = localStorage.getItem("jwt_token");
        if (jwt_token) {
            store.commit("updateToken", jwt_token);
            store.dispatch("getinfo", {//如果调用getinfo成功，说明登录成功了，那么就调用回调函数跳转到home页面
                success() {
                    router.push({ name: "home" });
                    store.commit("updatePullingInfo", false);
                },
                error() {
                    store.commit("updatePullingInfo", false);
                }
            });
        }
        else {
            store.commit("updatePullingInfo", false);
        }


        const login = () => {
            error_message.value = "";//提交之后要记得清空报错，不然影响观感

            //调用vuex的actions里的函数要用dispatch
            store.dispatch("login", {
                username: username.value,
                password: password.value,
                success() {
                    store.dispatch("getinfo", {
                        success(resp) {
                            router.push({ name: "home" });//如果登录成功，跳转到主页面
                            console.log(store.state.user);
                            console.log(resp);
                        }
                    })
                },
                error() {
                    error_message.value = "用户名或密码错误";
                }
            })
        }

        return {
            username,
            password,
            error_message,
            login,
        }
    }
}
</script>

<style scoped>
button {
    width: 100%;
}

.error-message {
    color: red;
}
</style>