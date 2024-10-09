import { reactive } from "vue";

export const store = reactive ({
    loggedUser: {
        name: "",
        surname: "",
        email: "",
    }
});