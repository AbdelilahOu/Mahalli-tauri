export function useStore() {
  const isShowModal = useState("showModal", () => false);
  const modalName = useState("modalName", () => "");
  const toggleModal = (s: boolean) => (isShowModal.value = s);
  const setModalName = (n: string) => (modalName.value = n);

  return {
    isShowModal,
    modalName,
    toggleModal,
    setModalName,
  };
}
