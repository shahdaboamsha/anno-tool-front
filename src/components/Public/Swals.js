import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import axios from "axios";
import SessionController from "../../utils/SessionController";
import ResponseMessage from "../../utils/ResponsesMessage";

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger",
  },
})

const confirmationSwalProps = {
  icon: "warning",
  showCancelButton: true,
  cancelButtonColor: "var(--dark-bg)",
  confirmButtonText: "Yes",
  confirmButtonColor: "#d33",
  cancelButtonText: "Cancel",
  reverseButtons: true,
}
const swalDialog = (type = "success" || "error", msg) => {

  Swal.fire({
    position: "top-end",
    icon: type == "success" ? "success" : "error",
    text: msg,
    showConfirmButton: false,
    timer: 1500,
  });
}

const confirmationSwal = async (
  method = "post",
  url,
  confirmationMsg,
  successMsg,
  failureMsg, body = {},
  nextUrl = () => { },
  notifyChanges = () => { }
) => {

  swalWithBootstrapButtons
    .fire({
      text: confirmationMsg,
      ...confirmationSwalProps
    })
    .then((result) => {

      if (result.isConfirmed) {

        const doProcess = async () => {

          try {

            const headers = { Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}` }

            if (method === "delete") {
              await axios.delete(url, { headers, data: body })
            }
            else {
              await axios.post(url, { ...body }, { headers })
            }

            Swal.fire({ text: successMsg, icon: "success" })
            nextUrl()
            notifyChanges()

          } catch (error) {
            if (error.code === "ERR_NETWORK") {
              Swal.fire({ text: ResponseMessage.INTERNAL_SERVER_ERROR_MSG, icon: "error" })

            }
            else if (error.response.status === 401) {
              const newToken = await SessionController.refreshToken()
              if (newToken instanceof Error) {
                localStorage.removeItem("ACCESS_TOKEN")
              } else {
                await doProcess()
              }
            } else {
              Swal.fire({ text: failureMsg, icon: "error" })
              console.log(error)
            }
          }
        }
        doProcess()

      }

    })
}

const optionSwal = async(title, text, options) => {
  // تحويل مصفوفة options إلى كائن { value: label }
  // مثلاً ['Apple', 'Banana'] => { apple: 'Apple', banana: 'Banana' }
  const inputOptions = Array.isArray(options)
    ? options.reduce((obj, item) => {
        obj[item.toLowerCase()] = item;
        return obj;
      }, {})
    : options;

  return Swal.fire({
    title: title,
    text: text,
    input: "select",
    inputOptions: inputOptions,
    inputPlaceholder: "Select an option",
    showCancelButton: true,
    confirmButtonText: "Submit",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      return result.value.toLowerCase(); // ترجع الخيار كـ string صغيرة
    }
    return null; // في حال ألغى المستخدم
  });
}
export {
  swalDialog,
  optionSwal,
  confirmationSwal
}
