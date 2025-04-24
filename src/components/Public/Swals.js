import Swal from "sweetalert2";
import 'sweetalert2/src/sweetalert2.scss'
import axios from "axios"

const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
    },
})

const deleteAccoutSwal = (title, feedback) => {

    swalWithBootstrapButtons.fire({
        title: "Are you sure you want to delete your account?",
        text: "All your tasks will be deleted!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "var(--dark-bg)",
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#d33",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            // connect to api here 
            const url = 'http://localhost:3000/users/deleteAccount'
            const headers = { Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}` }
            await axios.post(url, {}, { headers: headers }).then(() => {
                Swal.fire({
                    title: "Your account has been deleted",
                    text: "Thank you for joining our experience",
                    icon: "success"
                })
            })
                .catch(error => {
                    Swal.fire({
                        title: "Oops! An error occured. Try again",
                        text: error.message,
                        icon: "error"
                    })
                })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your imaginary file is safe :)",
                icon: "error"
            });
        }
    });
}

const updateAccountInfoSwal = (message) => {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: message,
        showConfirmButton: false,
        timer: 1500
    })
}

const deleteTaskSwal = (url) => {

    swalWithBootstrapButtons.fire({
        title: "Are you sure that you want to delete this task?",
        text: "You will lose all your annotaions for this task",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "var(--dark-bg)",
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "#d33",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            // connect to api here 
            const headers = { Authorization: `Brearer ${localStorage.getItem('ACCESS_TOKEN')}` }

            await axios.delete(url, { headers: headers }).then(() => {
                Swal.fire({
                    title: "Your task has been deleted successfully",
                    text: "Thank you for joining our experience",
                    icon: "success"
                })
            })
                .catch(error => {
                    Swal.fire({
                        title: "Oops! An error occured while deleting the task. Please try again",
                        text: error.message,
                        icon: "error"
                    })
                })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your imaginary file is safe :)",
                icon: "error"
            });
        }
    });
}
export { deleteAccoutSwal, updateAccountInfoSwal, deleteTaskSwal }