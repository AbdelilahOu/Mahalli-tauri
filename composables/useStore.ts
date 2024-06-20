export function useStore() {
  const show = useState("showModal", () => false);
  const name = useState("modalName", () => "");
  const toggleModal = (s: boolean) => (show.value = s);
  const setModalName = (n: string) => (name.value = n);

  return {
    show,
    name,
    toggleModal,
    setModalName,
  };
}
