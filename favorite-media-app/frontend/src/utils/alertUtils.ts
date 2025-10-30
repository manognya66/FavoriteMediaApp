import Swal from "sweetalert2";

export const showSuccess = (title: string, text?: string) => {
  Swal.fire({
    icon: "success",
    title,
    text,
    showConfirmButton: false,
    timer: 2000,
    background: "#f9fafb",
  });
};

export const showError = (title: string, text?: string) => {
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "OK",
    background: "#fff0f0",
  });
};

export const showConfirm = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, proceed!",
  });
  return result.isConfirmed;
};
