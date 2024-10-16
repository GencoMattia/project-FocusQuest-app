<script>
import axios from 'axios';
export default {
    data() {
        return {

        }
    }
}
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h1>New Moment Form</h1>

                <form action="" method="post">
                    <div class="mb-3">
                        <label for="name">Insert Moment's Name</label>
                        <input type="text" name="name" id="moment-form-name">
                    </div>

                    <div class="mb-3">
                        <label for="message">Insert Moment's message</label>
                        <input type="text" name="message" id="moment-form-message">
                    </div>

                    <div class="mb-3">
                        <label for="name">Insert Moment's Image</label>
                        <input type="file" name="moment_img" id="moment-form-img">
                    </div>

                    <div class="mb-3">
                        <label for="name">Insert Moment's Emotion</label>
                        <select name="emotion_id" id="moment-form-emotion">
                            <option v-for="emotion in emotions" value="{{ emotion.id }}">{{ emotion.name }}</option>
                        </select>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped></style>