import { toast, Bounce } from "react-toastify";
export const toastError = (str: string) => {
    toast.error(str, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        pauseOnFocusLoss:false,
        progress: undefined,
        theme: "dark",
        transition: Bounce
    });
}
export const toastSuccess = (str: string) => {
    toast.success(str, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        pauseOnFocusLoss:false,
        progress: undefined,
        theme: "dark",
        transition: Bounce
    });
}
export const toastInfo = (str: string) => {
    toast.info(str, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        pauseOnFocusLoss:false,
        progress: undefined,
        theme: "dark",
        transition: Bounce
    });
}