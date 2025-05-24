import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import axios from "axios";
import SessionController from "../../utils/SessionController";

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger",
  },
})

const warningSwalProps = {
  icon: "warning",
  showCancelButton: true,
  cancelButtonColor: "var(--dark-bg)",
  confirmButtonText: "Delete",
  confirmButtonColor: "#d33",
  cancelButtonText: "Cancel",
  reverseButtons: true
}

/** Delete operation swal alerts */
const deleteSwal = async (api,  warningMsg, successMsg) => {

  swalWithBootstrapButtons.fire({ text: warningMsg, ...warningSwalProps })
    .then(
      async (result) => {
        if (result.isConfirmed) {

          try {

            const headers = { Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }
            await axios.delete(`${import.meta.env.VITE_API_URL}/${api}`, { headers: headers })
            Swal.fire({ text: successMsg, icon: "success" })

          } catch (error) {

            if (error.response && error.response.status === 401) {

              const newToken = SessionController.refreshToken()
              if (newToken instanceof Error) {
                localStorage.removeItem('ACCESS_TOKEN')
                deleteSwal(api, warningMsg, successMsg)
              }
            }
            else {
              Swal.fire({ text: "Oops, an error occured during the process, please try again", icon: "error" })
            }
          }

        }
      })
}

const deleteAccoutSwal = (title, feedback) => {
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure you want to delete your account?",
      text: "All your tasks will be deleted!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "var(--dark-bg)",
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        // connect to api here
        const url = "http://localhost:3000/users/deleteAccount";
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
        };
        await axios
          .post(url, {}, { headers: headers })
          .then(() => {
            Swal.fire({
              title: "Your account has been deleted",
              text: "Thank you for joining our experience",
              icon: "success",
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Oops! An error occured. Try again",
              text: error.message,
              icon: "error",
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
    });
};

const updateAccountInfoSwal = (message) => {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
};

const deleteTaskSwal = (url, notifyChanges) => {
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure that you want to restrict this task?",
      text: "You will lose all your annotaions for this task",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "var(--dark-bg)",
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        // connect to api here
        const headers = {
          Authorization: `Brearer ${localStorage.getItem("ACCESS_TOKEN")}`,
        };

        await axios
          .delete(url, { headers: headers })
          .then(() => {
            Swal.fire({
              title: "Your task has been deleted successfully",
              text: "Thank you for joining our experience",
              icon: "success",
            });
            notifyChanges();
          })
          .catch((error) => {
            Swal.fire({
              title:
                "Oops! An error occured while deleting the task. Please try again",
              text: error.message,
              icon: "error",
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
    });
};

const deleteUsersSwal = (url, config, notifyChanges) => {
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure that you want to delete the selected users?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "var(--dark-bg)",
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(url, config)
          .then(() => {
            Swal.fire({
              title: "Users deleted successfully",
              icon: "success",
            });
            notifyChanges();
          })
          .catch((error) => {
            let text = "";
            if (error.code == "ERR_NETWORK") {
              text = "Unable to connect to server";
            } else if (error.status == 401) {
              localStorage.removeItem("ACCESS_TOKEN");
              text = error.response.data.message;
            } else if (error.status == 400) {
              text = error.response.data.message;
            } else {
              text =
                "Oops! An error occured during delete selected users. Try again";
            }
            Swal.fire({
              title:
                "Oops! An error occured while deleting the users. Please try again",
              text: text,
              icon: "error",
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          icon: "error",
        });
      }
    });
};

const deleteTaskssSwal = (url, config, notifyChanges) => {
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure that you want to restrict the selected tasks?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "var(--dark-bg)",
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(url, config)
          .then(() => {
            Swal.fire({
              title: "Tasks deleted successfully",
              icon: "success",
            });
            notifyChanges();
          })
          .catch((error) => {
            let text = "";
            if (error.code == "ERR_NETWORK") {
              text = "Unable to connect to server";
            } else if (error.status == 401) {
              localStorage.removeItem("ACCESS_TOKEN");
              text = error.response.data.message;
            } else if (error.status == 400) {
              text = error.response.data.message;
            } else {
              text =
                "Oops! An error occured during delete selected tasks. Try again";
            }
            Swal.fire({
              title:
                "Oops! An error occured while deleting the tasks. Please try again",
              text: text,
              icon: "error",
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          icon: "error",
        });
      }
    });
};

const removeUserFromShareSwal = (url, config, selectedUserName) => {
  swalWithBootstrapButtons
    .fire({
      title: `Are you sure that you want to remove ${selectedUserName} from task collaborating?`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "var(--dark-bg)",
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#d33",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(url, config)
          .then(() => {
            Swal.fire({
              title: `${selectedUserName} removed successfully`,
              icon: "success",
            });
          })
          .catch((error) => {
            let text = "";
            if (error.code == "ERR_NETWORK") {
              text = "Unable to connect to server";
            } else if (error.status == 401) {
              localStorage.removeItem("ACCESS_TOKEN");
              text = error.response.data.message;
            } else if (error.status == 400) {
              text = error.response.data.message;
            } else {
              text = `Oops! An error occured during remove ${selectedUserName}. Try again`;
            }

            Swal.fire({
              title: "Oops",
              text: text,
              icon: "error",
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          icon: "error",
        });
      }
    });
};

export {
  deleteAccoutSwal,
  updateAccountInfoSwal,
  deleteTaskSwal,
  deleteUsersSwal,
  deleteTaskssSwal,
  removeUserFromShareSwal,
  deleteSwal
};
