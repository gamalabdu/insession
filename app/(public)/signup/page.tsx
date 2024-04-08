import "./styles.css";
import Form from "./components/form";

const SignUp = () => {
  //   const handleInputChange = (
  //     e: React.ChangeEvent<HTMLInputElement>,
  //     type: string
  //   ) => {
  //     if (type === "username") {
  //       setUsername(e.target.value);
  //     } else if (type === "password") {
  //       setPassword(e.target.value);
  //     } else if (type === "email") {
  //       setEmail(e.target.value);
  //     }
  //   };

  //   const handleInputBlur = (type: string) => {
  //     if (type === "username" && !username.trim()) {
  //       // Reset the label position if the username is empty
  //       setUsername("");
  //     } else if (type === "password" && !password.trim()) {
  //       // Reset the label position if the password is empty
  //       setPassword("");
  //     }
  //   };

  // if (user) {
  //     return router.push("/dashboard")
  // }

  return (
    <div className="login-page-container">
      <Form />
    </div>
  );
};

export default SignUp;
