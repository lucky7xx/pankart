import LoginForm from "../components/auth/LoginForm";

export const metadata = {
  title: "Login - I-PanKart",
  description: "Login to your I-PanKart account",
};

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
