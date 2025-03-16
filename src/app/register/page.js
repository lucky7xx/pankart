import RegisterForm from "../components/auth/RegisterForm";

export const metadata = {
  title: "Register - I-PanKart",
  description: "Create a new I-PanKart account",
};

export default function RegisterPage() {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}
