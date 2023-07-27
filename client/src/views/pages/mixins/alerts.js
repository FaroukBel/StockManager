import swal from "sweetalert";

export default{

  methods:{
    success(message){
      return swal('Succès !',message, 'success');

    },
    info(message){
      return swal('Important !',message, 'info');

    },
    error(message){
      return swal('Erreur',message, 'error');


    }
  }
}
