import { useLocation } from "wouter";
const useNavigate = () => {
  const [, navigate] = useLocation();
  return navigate;
};
export default useNavigate;
