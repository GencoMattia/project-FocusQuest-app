import { reactive } from "vue";

export const store = reactive ({
    loggedUser: {
        id: "",
        name: "",
        surname: "",
        email: "",
    },
    selected_task_id: null,
});