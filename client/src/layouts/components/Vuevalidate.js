import { required, numeric, minLength, maxLength } from 'vuelidate/lib/validators';
import { validationMixin } from 'vuelidate';

export default {
  mixins: [validationMixin],
  data() {
    return {
      username: '',
      password: '',
      form: {
        privacyPolicies: false
      },
      isPasswordVisible: false,

    };
  },
  validations: {
    username: { required, numeric },
    password: { required, minLength: minLength(8), maxLength: maxLength(32) },
  },
  methods: {
    register() {
      if (this.$v.$invalid) {
        this.error = 'Invalid registration information';
        return;
      }

      // Perform registration logic
      // Call the API, submit the form, etc.
      this.$router.push('/');
    },
  },
};
