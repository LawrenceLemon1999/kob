<template>
    <ContentField>
        <!-- 这里是bootstrap里的grids，把界面分成12份 -->
        <div class="row justify-content-md-center">
            <div class="col-3">
                <div class="mb-3">
                    <!-- 这里是前端的内容，这俩是要同时出现的，上面的for和下面的id是对应的 -->
                    <label for="username" class="form-label">用户名</label>
                    <input type="text" class="form-control" id="username" placeholder="请输入用户名">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">密码</label>
                    <input type="password" class="form-control" id="password" placeholder="请输入密码">
                </div>
                <div class="error-message">
                    密码错误
                </div>
                <button type="submit" class="btn btn-primary">提交</button>
            </div>
        </div>



    </ContentField>
</template>

<script>
import ContentField from '@/components/ContentField.vue'

export default {
    name: 'UserAccountLoginView',
    components: {
        ContentField,
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