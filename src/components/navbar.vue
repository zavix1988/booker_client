<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <span class="navbar-brand mb-0 h1">Broadboard booker</span>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <router-link class="nav-link" to="/">Home</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/about">About</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/admin">Admin</router-link>
                </li>
            </ul>
        </div>
        <router-link class="btn btn-bd-download d-none d-lg-inline-block mb-3 mb-md-0 ml-md-3" to="/login">Login</router-link>
    </nav>

</template>

<script>
    export default {
        name: "navbar"
    }
</script>

<style scoped>
</style>